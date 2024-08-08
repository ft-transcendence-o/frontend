import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../build/GLTFLoader.js';
// import { navigateTo, baseUrl, router} from "../../router.js";

/*
게임 동작 순서
1. PongGame클래스의 생성자 호출
2. 카메라, 조명, 모델을 초기화, 렌더링
3. 카운트 다운 후 게임시작
4. update함수의 로직대로 모델들의 좌표와 이동방향을 계산하여 렌더링하고 게임을 진행함
*/
// ball과 panel의 움직임 변화는 update함수에서 사용하는 함수들이 수행하므로 update함수를 살펴보면 좋을듯합니다

export class PongGame {
    // constructor : renderer, scene, 함수들 정의
    constructor() {
        // socket
        this._socket = new WebSocket("ws://127.0.0.1:8000/ws/game"); //TODO: 추후에 변경해야한다

        // 캔버스의 크기를 설정한다 // 백엔드에서는 신경쓰지말것
        const canvas1 = document.querySelector("#canvas1");
        const canvas2 = document.querySelector("#canvas2");
        this._divCanvas1 = canvas1;
        this._divCanvas2 = canvas2;
        this._canvasWidth = 712;
        this._canvasHeight = 700;
        this._isRunning = true; //백엔드에서는 신경쓰지말것 //game페이지가 로드되면 클래스의 생성자를 호출해서 게임을 렌더링하는데 뒤로가기 버튼을 누르면 다른 페이지임에도 브라우저내부적으로는 게임이 진행되고 있으므로 이를 막기 구분하기 위한 플래그
        this._keyState = {
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        }; // 키보드 입력 상태를 추적하는 변수

        // game_status_var
        this._gameVar = document.querySelector("#game_var");
        this._player1 = {
            Nick: localStorage.getItem("match_1up"),
            Score : 0,
        }
        this._player2 = {
            Nick: localStorage.getItem("match_2up"),
            Score : 0,
        }
        this._mode = localStorage.getItem('mode');
        document.querySelector("#player1_nick").innerHTML = this._player1.Nick;
        document.querySelector("#player2_nick").innerHTML = this._player2.Nick;

        //게임에 사용할 변수들 // 백엔드에서 관리해야하는 변수들
        this._isPaused = false; // 게임을 pause해야할때 사용하는 플래그변수 -> 카운트다운, 골먹힘 등 // 백엔드로부터 값을 받아와야한다

        let renderer1 = new THREE.WebGLRenderer({
            canvas: canvas1,
            antialias: true,
        });
        renderer1.outputEncoding = THREE.sRGBEncoding;
        renderer1.setSize(this._canvasWidth + 11, this._canvasHeight);
        this._renderer1 = renderer1;

        let renderer2 = new THREE.WebGLRenderer({
            canvas: canvas2,
            antialias: true,
        });
        renderer2.outputEncoding = THREE.sRGBEncoding;
        renderer2.setSize(this._canvasWidth, this._canvasHeight);
        this._renderer2 = renderer2;

        let scene = new THREE.Scene();
        scene.background = new THREE.Color("black");
        this._scene = scene;

        this._setupCamera(); // 카메라 객체 설정
        this._setupLight(); // 광원을 설정
        this._setupModel(); // 3차원 모델을 설정

        // keydown 이벤트 핸들러를 추가
        window.addEventListener('keydown', this.keydown.bind(this));

        // keyup 이벤트 핸들러를 추가
        window.addEventListener('keyup', this.keyup.bind(this));

        // main 버튼 이벤트 핸들러를 추가
        this.mainButtonEvent();

        // 뒤로가기 앞으로가기 이벤트 핸들러를 추가
        window.addEventListener('popstate', this.gameRoute.bind(this));

        // socket에 들어온 입력에 대한 이벤트 등록
        this._socket.onopen = () => {
            console.log("Socket is open");
        };
        this._socket.onclose = (event) => {
            console.log("WebSocket is closed now.", event);
        };
        this._socket.onerror = (error) => {
            console.log("WebSocket error observed:", error);
        };
        this._socket.onmessage = (event) => this.handleSocketMessage(event); //이벤트 등록

        // 게임시작시 카운트 다운
        this.countdown();
        this._renderer1.render(this._scene, this._camera1);
        this._renderer2.render(this._scene, this._camera2);
        setTimeout(() => {requestAnimationFrame(this.render.bind(this));}, 5000);

        // render 함수 정의 및 애니메이션 프레임 요청
        // requestAnimationFrame(this.render.bind(this));
    }

    // 카메라 설정
    _setupCamera() {
        console.log("camera");
        const width = this._canvasWidth;
        const height = this._canvasHeight;
        const camera1 = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000
        );
        camera1.position.set(0, 4, 80);
        camera1.lookAt(0, 0, 0);
        this._camera1 = camera1;

        const camera2 = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000
        );
        camera2.position.set(0, 4, -80);
        camera2.lookAt(0, 0, 0);
        this._camera2 = camera2;
    }

    // 조명 설정 | 전체조명사용하도록 수정예정
    _setupLight() {
        console.log("light");
        const PLight = new THREE.PointLight();
        const ALight = new THREE.AmbientLight();
        this._PLight = PLight;
        this._ALight = ALight;
        PLight.position.set(50, 50, 0);
        this._scene.add(PLight, ALight);
    }

    // 렌더링할 Mesh들을 정의하고 생성하는 함수
    _setupModel() {
        console.log("model");
        const loader = new GLTFLoader();

        //Mesh: pacman ball
        loader.load("./pac/scene.gltf", (gltf) => {
            this._ball = gltf.scene;
            this._scene.add(this._ball);
        
            // Ball의 BoundingBox 설정 및 크기 계산
            let box = new THREE.Box3().setFromObject(this._ball);
            let size = new THREE.Vector3();
            box.getSize(size);
            console.log("size: ", size);
            this._radius = Math.max(size.x, size.y, size.z) / 2; // 반지름 계산 하면 대충 2쯤 나옴
            console.log("radius : ", this._radius);
            this._ball.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.computeBoundingBox();
                    child.boundingBox = new THREE.Box3().setFromObject(child);
                }
            });
            this._ballBoundingBox = new THREE.Box3().setFromObject(this._ball);
        });

        const edgeThickness = 0.1; // 선의 두께 설정
        //Mesh: 원근감을 위한 사각테두리라인
        const positions = [10, 10, 0, 10, -10, 0, -10, -10, 0, -10, 10, 0, 10, 10, 0];
        const perspectiveLineEdgesMaterial = new THREE.MeshBasicMaterial({ color: 0x14ff00 });
        const perspectiveLineEdges = new THREE.Group();
        
        for (let i = 0; i < positions.length - 3; i += 3) {
            const start = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
            const end = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
        
            const cylinderGeometry = new THREE.CylinderGeometry(edgeThickness, edgeThickness, start.distanceTo(end), 8); // 8각형으로 원통 구성
            const edge = new THREE.Mesh(cylinderGeometry, perspectiveLineEdgesMaterial);
        
            const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            edge.position.copy(midPoint);
        
            edge.lookAt(end);
            edge.rotateX(Math.PI / 2);
        
            perspectiveLineEdges.add(edge);
        }
        this._perspectiveLineEdges = perspectiveLineEdges;
        this._scene.add(this._perspectiveLineEdges);

        //Mesh: 경기장
        const stadiumGeometry = new THREE.BoxGeometry(20, 20, 100);
        const stadiumMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
        });
        const stadium = new THREE.Mesh(stadiumGeometry, stadiumMaterial);

        this._scene.add(stadium);
        this._stadium = stadium;

        // BoxGeometry의 4개 면 정의
        this._planes = [
            new THREE.Plane(new THREE.Vector3(1, 0, 0), this._stadium.geometry.parameters.width / 2),  // Left
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), this._stadium.geometry.parameters.width / 2), // Right
            new THREE.Plane(new THREE.Vector3(0, 1, 0), this._stadium.geometry.parameters.height / 2), // Bottom
            new THREE.Plane(new THREE.Vector3(0, -1, 0), this._stadium.geometry.parameters.height / 2), // Top
        ];

        //Mesh: 경기장 테두리
        const stadiumEdges = new THREE.EdgesGeometry(stadiumGeometry); //geometry의 테두리를 추출하는 함수
        const edgesMaterial = new THREE.MeshBasicMaterial({ color: 0x1e30f5 });

        const stadiumPositions = stadiumEdges.attributes.position.array;
        const edges = new THREE.Group(); //그룹을 생성한다
        for (let i = 0; i < stadiumPositions.length - 3; i += 6) {
            const start = new THREE.Vector3(stadiumPositions[i], stadiumPositions[i + 1], stadiumPositions[i + 2]);
            const end = new THREE.Vector3(stadiumPositions[i + 3], stadiumPositions[i + 4], stadiumPositions[i + 5]);
        
            const cylinderGeometry = new THREE.CylinderGeometry(edgeThickness, edgeThickness, start.distanceTo(end), 8); // 8각형으로 원통 구성
            const edge = new THREE.Mesh(cylinderGeometry, edgesMaterial);
        
            const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            edge.position.copy(midPoint);
        
            edge.lookAt(end);
            edge.rotateX(Math.PI / 2);
        
            edges.add(edge);
        }
        this._scene.add(edges);

        //Mesh: 패널
        const panelGeomtery = new THREE.PlaneGeometry(6, 6);
        const panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1e30f5,
            transparent: true,
            opacity: 0.5
        });
        const panel1 = new THREE.Mesh(panelGeomtery, panelMaterial);
        panel1.position.set(0, 0, 50);
        panel1.lookAt(0, 0, 100);
        const panel1Plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), this._stadium.geometry.parameters.depth / 2);
        this._panel1Plane = panel1Plane;
        this._panel1 = panel1;
        this._scene.add(panel1);

        const panel2 = new THREE.Mesh(panelGeomtery, panelMaterial);
        panel2.position.set(0, 0, -50);
        panel2.lookAt(0, 0, -100);
        const panel2Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), this._stadium.geometry.parameters.depth / 2);
        this._panel2Plane = panel2Plane;
        this._panel2 = panel2;
        this._scene.add(panel2);
    }

    // 렌더링함수
    render(time) { // 렌더링이 시작된 이후 경과된 밀리초를 받는다
        if (!this._isRunning)
            return ;
        // 렌더러가 scenen을 카메라의 시점을 기준으로 렌더링하는작업을 한다
        this._renderer1.render(this._scene, this._camera1);
        this._renderer2.render(this._scene, this._camera2);
        this.update(time); // 시간에 따라 애니메이션 효과를 발생시킨다
        requestAnimationFrame(this.render.bind(this));
        // 생성자의 코드와 동일: 계속 렌더 메소드가 무한히 반복되어 호출되도록 만든다
    }
    
    // 게임 한판의 결과를 서버에 POST -> 현재는 1VS1에서만 사용
    async fetchResult() {
        const response = await fetch(baseUrl + "/api/game-management/tournament", {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify({
                "player1Nick": "1up",
                "player2Nick": "2up",
                "player1Score" : this._player1.Score,
                "player2Score" : this._player2.Score,
                "mode": "1 ON 1"
            }),
        });
        if (response.ok) {
            console.log("success");
        }
        else {
            console.log(await response.json());
        }
    }

    // 토너먼트경기가 끝나면 하는 동작들
    tournamentGameSet() {
        localStorage.setItem(`game${localStorage.getItem("match_count")}`, JSON.stringify({
            "player1Nick": this._player1.Nick,
            "player2Nick": this._player2.Nick,
            "player1Score" : this._player1.Score,
            "player2Score" : this._player2.Score,
            "mode": "TOURNAMENT"
        }));
        localStorage.setItem("match_count", localStorage.getItem("match_count") + 1);
        document.querySelector("#next_button").addEventListener("click", (event) => {
            this._isRunning = false;
            navigateTo("/match_schedules");
        })
        this._ball.position.x = 0;
        this._ball.position.y = 0;
        this._ball.position.z = 0;
        console.log("ball vec:", this._vec);
        this.pauseGame(1000);
    }

    // 골먹히면 공의 위치를 초기화하고 1초정도 정지하도록 만든 함수
    setGame() {
        this._ball.position.x = 0;
        this._ball.position.y = 0;
        this._ball.position.z = 0;
        console.log("ball vec:", this._vec);
        this.pauseGame(1000);
    }

    // player1이 점수를 딴 경우
    player1Win() {
        console.log("player1 win");
        document.querySelector("#player1_score").innerHTML = ++(this._player1.Score);
        if (this._player1.Score === 1){ // 일정점수에 도달하면 game set
            this._vec.set(0, 0, 0);
            this._angularVec.set(0, 0, 0.1);
            if (this._mode === "TOURNAMENT") {
                document.querySelector("#winner1").innerHTML = `
                <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
                <button id="next_button" type="button" style="
                    background-color: black;
                    width: 328px; height: 199px;
                    margin-left: 20px;" 
                    class="blue_outline">
                    <span style="font-size: 50px; line-height: 50px;">
                        >>NEXT
                    </span>
                    <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
                </button>`;
                this.tournamentGameSet();
            }
            else { //1vs1
                document.querySelector("#winner1").innerHTML = `
                <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
                <button id="next_button" type="button" style="
                    background-color: black;
                    width: 328px; height: 199px;
                    margin-left: 20px;" 
                    class="blue_outline">
                    <span style="font-size: 50px; line-height: 50px;">
                        1 ON 1
                        AGAIN?
                    </span>
                    <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
                </button>`;
                // post API
                this.fetchResult();
                document.querySelector("#next_button").addEventListener("click", (event) => { 
                    this._isRunning = false;
                    navigateTo("/game");
                })
            }
        }
        this.setGame();
    }

    // player2가 점수를 딴 경우
    player2Win() {
        console.log("player2 win");
        document.querySelector("#player2_score").innerHTML = ++this._player2.Score;
        if (this._player2.Score === 1){ // 승리점수가 일정 점수에 도달하면 게임을 끝낸다
            this._vec.set(0, 0, 0);
            this._angularVec.set(0, 0, 0.1);
            if (this._mode === "TOURNAMENT") { // 토너먼트
                document.querySelector("#winner2").innerHTML = `
                <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
                <button id="next_button" type="button" style="
                    background-color: black;
                    width: 328px; height: 199px;
                    margin-left: 20px;" 
                    class="blue_outline">
                    <span style="font-size: 50px; line-height: 50px;">
                        >>NEXT
                    </span>
                    <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
                </button>`;
                this.tournamentGameSet();
            }
            else { // 1VS1의 경우
                document.querySelector("#winner2").innerHTML = `
                <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
                <button id="next_button" type="button" style="
                    background-color: black;
                    width: 328px; height: 199px;
                    margin-left: 20px;" 
                    class="blue_outline">
                    <span style="font-size: 50px; line-height: 50px;">
                        1 ON 1
                        AGAIN?
                    </span>
                    <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
                </button>`;
                // 결과를 backend에 POST
                this.fetchResult();
                document.querySelector("#next_button").addEventListener("click", (event) => {
                    this._isRunning = false;
                    navigateTo("/game");
                })
            }
        }
        this.setGame();        
    }

    // GoalArea와 ball이 충돌했을때 동작하는 함수
    collisionWithGoalArea() {
        const collisionPoint1 = this.getCollisionPointWithPlane(this._panel1Plane); //panel1이 위치한 평면과 공의 충돌좌표 //충돌하지 않았다면 null을 반환한다
        const collisionPoint2 = this.getCollisionPointWithPlane(this._panel2Plane); //panel2가 위치한 평면과 공의 출돌좌표 //충돌하지 않았다면 null을 반환한다

        if (collisionPoint1){
            // 충돌한 좌표가 panel내부에 있다면
            if (Math.abs(collisionPoint1.x  - this._panel1.position.x) < 4 && Math.abs(collisionPoint1.y - this._panel1.position.y) < 4 && this._flag == true) {
                this.collisionInPanel1();
            }
            // panel과 부딪히지 않은 경우
            else { 
                this.player2Win();
            }
        }
        // panel2쪽 평면과 충돌한 경우
        else if (collisionPoint2){
            if (Math.abs(collisionPoint2.x  - this._panel2.position.x) < 4 && Math.abs(collisionPoint2.y - this._panel2.position.y) < 4 && this._flag == false) {
                this.collisionInPanel2();
            }
            else {
                this.player1Win();
            }
        }
    }

    // 렌더링마다 mesh들의 상태를 업데이트하는 함수
    update(time) {
        // if (this._socket.onopen && this._ball && !this._isPaused) {
            if (this._socket.onopen && !this._isPaused) {
            // 공의 원근감을 알기 위한 사각형모양의 링의 z좌표 변경
            this._perspectiveLineEdges.position.z = this._ball.position.z;
        }
    }

    handleSocketMessage(event) {
        console.log("get socket msg");
        const received = JSON.parse(event.data); // ball 좌표, panel1 좌표, panel2 좌표가 순서대로 들어온다고 가정
        console.log(received);

        this._ball.position.set(received.game.ball[0], received.game.ball[1], received.game.ball[2]);
        this._panel1.position.set(received.game.panel1[0], received.game.panel1[1], received.game.panel1[2]);
        this._panel2.position.set(received.game.panel2[0], received.game.panel2[1], received.game.panel2[2]);
    }

    // 게임 일시정지
    pauseGame(duration) {
        this._isPaused = true;
        setTimeout(() => {
            this._isPaused = false;
        }, duration);
    }

    keydown(event) {
        if (event.code in this._keyState){
            this._keyState[event.code] = true;
            this._socket.send(JSON.stringify(this._keyState));
        }
        // console.log(this._keyState);
        // if (event.code === "KeyW") {
        //     this._socket.send("W,True");
        // }
        // if (event.code === "KeyS") {
        //     this._socket.send("S,True");
        // }
        // if (event.code === "KeyA") {
        //     this._socket.send("A,True");
        // }
        // if (event.code === "KeyD") {
        //     this._socket.send("D,True");
        // }
        // if (event.code === "ArrowUp") {
        //     this._socket.send("Up,True");
        // }
        // if (event.code === "ArrowDown") {
        //     this._socket.send("Down,True");
        // }
        // if (event.code === "ArrowLeft") {
        //     this._socket.send("Left,True");
        // }
        // if (event.code === "ArrowRight") {
        //     this._socket.send("Right,True");
        // }
    }

    keyup(event){
        if (event.code in this._keyState){
            this._keyState[event.code] = false;
            this._socket.send(JSON.stringify(this._keyState));
        }
        // if (event.code === "KeyW") {
        //     this._socket.send("W,False");
        // }
        // if (event.code === "KeyS") {
        //     this._socket.send("S,False");
        // }
        // if (event.code === "KeyA") {
        //     this._socket.send("A,False");
        // }
        // if (event.code === "KeyD") {
        //     this._socket.send("D,False");
        // }
        // if (event.code === "ArrowUp") {
        //     this._socket.send("Up,False");
        // }
        // if (event.code === "ArrowDown") {
        //     this._socket.send("Down,False");
        // }
        // if (event.code === "ArrowLeft") {
        //     this._socket.send("Left,False");
        // }
        // if (event.code === "ArrowRight") {
        //     this._socket.send("Right,False");
        // }
    }

    countdown() {
        let countdownElement = document.querySelector("#countDown");
        let countdownValue = 4;
    
        let countdownInterval = setInterval(() => {
            countdownElement.innerText =  --countdownValue;
    
            if (countdownValue === 0) {
                countdownElement.innerText = "START";
                this._socket.send("start");
            }
            else if (countdownValue === -1) {
                clearInterval(countdownInterval);
                countdownElement.innerText = "";
                return ;
            }
        }, 1000);
    }

    mainButtonEvent() {
        this._Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");
	
		this._Top_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(event.target.href);

                if (event.target.href === "http://localhost:5500/main") {
                    this._isRunning = false;
                    navigateTo("/main");
                }
            });

            Button.addEventListener("mouseenter", (event) => {
                Button.classList.remove("blue_outline");
                Button.classList.add("green_outline");
                Button.classList.add("white_stroke_2_5px");
            });

            Button.addEventListener("mouseleave", (event) => {
                Button.classList.add("blue_outline");
                Button.classList.remove("green_outline");
                Button.classList.remove("white_stroke_2_5px");
            });
        });
    }

    gameRoute() {
        this._isRunning = false;
        console.log("gameROute");
        console.log("isRunning : ", this._isRunning);
        router();
    }
}

window.onload = function() {
    new PongGame();
}
