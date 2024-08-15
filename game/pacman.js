import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../build/GLTFLoader.js';
import { navigateTo, baseUrl, router} from "../../router.js";
import { get_translated_value } from "../../language.js"

//game_end

export class PongGame {
    constructor(sessionData, mode) {
        console.log("wss://127.0.0.1/api/pong-game/" + mode + sessionData.user_id)
        this._mode = mode;
        this._socket = new WebSocket("wss://127.0.0.1/api/pong-game/" + mode + sessionData.user_id);

        const canvas1 = document.querySelector("#canvas1");
        const canvas2 = document.querySelector("#canvas2");
        this._divCanvas1 = canvas1;
        this._divCanvas2 = canvas2;
        this._canvasWidth = 712;
        this._canvasHeight = 700;
        this._isRunning = true;
        this._rotVec = new THREE.Vector3(0, 0, 0);
        this._keyState = {
            KeyW: false,
            KeyA: false,
            KeyS: false,
            KeyD: false,
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };

        // game_status_var
        console.log("Session Data:", sessionData);
        this._gameVar = document.querySelector("#game_var");
        this._player1 = {
            Score : sessionData.left_score, //
        }
        this._player2 = {
            Score : sessionData.right_score,
        }
        
        this._player1.Nick = sessionData.players_name[0];
        this._player2.Nick = sessionData.players_name[1];
        if (sessionData.current_match === 1) {
            this._player1.Nick = sessionData.players_name[2];
            this._player2.Nick = sessionData.players_name[3];
        }
        else if (sessionData.current_match === 2) {
            this._player1.Nick = sessionData.win_history[0];
            this._player2.Nick = sessionData.win_history[1];
        }
        document.querySelector("#player1_score").innerHTML = this._player1.Score;
        document.querySelector("#player2_score").innerHTML = this._player2.Score;
        document.querySelector("#player1_nick").innerHTML = this._player1.Nick;
        document.querySelector("#player2_nick").innerHTML = this._player2.Nick;
        

        //게임에 사용할 변수들
        this._isPaused = false;

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
        this._bindKeydown = this.keydown.bind(this);
        window.addEventListener('keydown', this._bindKeydown);

        // keyup 이벤트 핸들러를 추가
        this._bindKeyup = this.keyup.bind(this);
        window.addEventListener('keyup', this._bindKeyup);

        // main 버튼 이벤트 핸들러를 추가
        this.mainButtonEvent();

        // 뒤로가기 앞으로가기 이벤트 핸들러를 추가
        window.addEventListener('popstate', this.gameRoute.bind(this));

        // socket에 들어온 입력에 대한 이벤트 등록
        this._socket.onopen = () => {
            this._socket.send(JSON.stringify(sessionData));
            //잘 갔는지 확인이 가능한가?
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

    }

    // 카메라 설정
    _setupCamera() {
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
        const PLight = new THREE.PointLight();
        const ALight = new THREE.AmbientLight();
        this._PLight = PLight;
        this._ALight = ALight;
        PLight.position.set(50, 50, 0);
        this._scene.add(PLight, ALight);
    }

    // 렌더링할 Mesh들을 정의하고 생성하는 함수
    _setupModel() {
        const loader = new GLTFLoader();

        //Mesh: pacman ball
        loader.load("./game/pac/scene.gltf", (gltf) => { //backend테스트시 이거사용
        // loader.load("./pac/scene.gltf", (gltf) => {
            this._ball = gltf.scene;
            this._scene.add(this._ball);
        
            // Ball의 BoundingBox 설정 및 크기 계산
            let box = new THREE.Box3().setFromObject(this._ball);
            let size = new THREE.Vector3();
            box.getSize(size);
            this._radius = Math.max(size.x, size.y, size.z) / 2; // 반지름 계산 하면 대충 2쯤 나옴
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
        const stadiumEdges = new THREE.EdgesGeometry(stadiumGeometry);
        const edgesMaterial = new THREE.MeshBasicMaterial({ color: 0x1e30f5 });

        const stadiumPositions = stadiumEdges.attributes.position.array;
        const edges = new THREE.Group();
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
        if (!this._isRunning) {
            console.log("rendering finish");
            return ;
        }
        // 렌더러가 scenen을 카메라의 시점을 기준으로 렌더링하는작업을 한다
        this._renderer1.render(this._scene, this._camera1);
        this._renderer2.render(this._scene, this._camera2);
        this.update(time); // 시간에 따라 애니메이션 효과를 발생시킨다
        requestAnimationFrame(this.render.bind(this));
    }

    // 토너먼트경기가 끝나면 하는 동작들
    tournamentGameSet() {
        document.querySelector("#next_button").addEventListener("click", (event) => {
            this._isRunning = false;
            navigateTo("/match_schedules");
        })
    }

    player1Win() {
        // document.querySelector("#player1_score").innerHTML = this._player1.Score;
        if (this._mode === "tournament/") {
            document.querySelector("#winner1").innerHTML = `
            <div style="font-size: 100px; line-height: 100px; color: white;">${get_translated_value("game_win")}!</div>
            <button id="next_button" type="button" style="
                background-color: black;
                width: 328px; height: 199px;
                margin-left: 20px;" 
                class="blue_outline">
                <span style="font-size: 50px; line-height: 50px;">
                    >>${get_translated_value("QR_next")}
                </span>
                <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
            </button>`;
            document.querySelector("#next_button").addEventListener("click", (event) => {
                this._isRunning = false;
                navigateTo("/match_schedules");
            })
        }
        else { //1vs1
            document.querySelector("#winner1").innerHTML = `
            <div style="font-size: 100px; line-height: 100px; color: white;">${get_translated_value("game_win")}!</div>
            <button id="next_button" type="button" style="
                background-color: black;
                width: 328px; height: 199px;
                margin-left: 20px;" 
                class="blue_outline">
                <span style="font-size: 50px; line-height: 50px;">
                    ${get_translated_value("again_1ON1")}
                </span>
                <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
            </button>`;
            document.querySelector("#next_button").addEventListener("click", (event) => { 
                this._isRunning = false;
                navigateTo("/normal_game");
            })
        }
    }

    player2Win() {
        // document.querySelector("#player2_score").innerHTML = this._player2.Score;
        if (this._mode === "tournament/") { // 토너먼트
            document.querySelector("#winner2").innerHTML = `
            <div style="font-size: 100px; line-height: 100px; color: white;">${get_translated_value("game_win")}!</div>
            <button id="next_button" type="button" style="
                background-color: black;
                width: 328px; height: 199px;
                margin-left: 20px;" 
                class="blue_outline">
                <span style="font-size: 50px; line-height: 50px;">
                    >>${get_translated_value("QR_next")}
                </span>
                <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
            </button>`;
            document.querySelector("#next_button").addEventListener("click", (event) => {
                this._isRunning = false;
                navigateTo("/match_schedules");
            })
        }
        else { // 1VS1의 경우
            document.querySelector("#winner2").innerHTML = `
            <div style="font-size: 100px; line-height: 100px; color: white;">${get_translated_value("game_win")}!</div>
            <button id="next_button" type="button" style="
                background-color: black;
                width: 328px; height: 199px;
                margin-left: 20px;" 
                class="blue_outline">
                <span style="font-size: 50px; line-height: 50px;">
                    ${get_translated_value("again_1ON1")}
                </span>
                <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
            </button>`;
            document.querySelector("#next_button").addEventListener("click", (event) => {
                this._isRunning = false;
                navigateTo("/normal_game");
            })
        }
    }

    update(time) {
        if (this._socket.onopen && !this._isPaused) {
            this._perspectiveLineEdges.position.z = this._ball.position.z;
            this._ball.rotation.x += this._rotVec.x;
            this._ball.rotation.y += this._rotVec.y;
            this._ball.rotation.x += this._rotVec.z;
        }
    }

    handleSocketMessage(event) {
        const received = JSON.parse(event.data); // ball 좌표, panel1 좌표, panel2 좌표가 순서대로 들어온다고 가정
        // console.log(received);

        if (received.type === "state"){
            this._ball.position.set(received.ball_pos[0], received.ball_pos[1], received.ball_pos[2]);
            this._panel1.position.set(received.panel1[0], received.panel1[1], received.panel1[2]);
            this._panel2.position.set(received.panel2[0], received.panel2[1], received.panel2[2]);
            this._rotVec.set(received.ball_rot[0], received.ball_rot[1], received.ball_rot[2])
            this._perspectiveLineEdges.position.z = this._ball.position.z;
        }
        else if (received.type === "score"){
            this._player1.Score = received.left_score;
            this._player2.Score = received.right_score;
            document.querySelector("#player1_score").innerHTML = this._player1.Score;
            document.querySelector("#player2_score").innerHTML = this._player2.Score;
            // this._socket.send("pause");
            // let countdownValue = 4;
        
            // let countdownInterval = setInterval(() => {
            //     countdownValue--;
            //     if (countdownValue === 0) {
            //         clearInterval(countdownInterval);
            //         this._socket.send("resume");
            //         console.log("send resume");
            //         return ;
            //     }
            // })
        }
        else if (received.type === "game_end") {
            this._isRunning == false;
            this._socket.close();
            this.removeEventListener(); 
            if (this._player1.Score > this._player2.Score) {
                this.player1Win();
            }
            else {
                this.player2Win();
            }
        }
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
        else if (event.code === 'Escape'){
            event.preventDefault();
            this._isRunning = false;
            this._socket.close();
            this.removeEventListener();
            navigateTo("/main");
        }
    }

    keyup(event){
        if (event.code in this._keyState){
            this._keyState[event.code] = false;
            this._socket.send(JSON.stringify(this._keyState));
        }
    }

    countdown() {
        let countdownElement = document.querySelector("#countDown");
        let countdownValue = 4;
    
        let countdownInterval = setInterval(() => {
            countdownElement.innerText =  --countdownValue;
    
            if (countdownValue === 0) {
                countdownElement.innerText = "START";
            }
            else if (countdownValue === -1) {
                clearInterval(countdownInterval);
                countdownElement.innerText = "";
                this._socket.send("start");
                return ;
            }
        }, 1000);
    }

    mainButtonEvent() {
        // 기본값설정
        this._Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");
	
		this._Top_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                this._isRunning = false;
                this._socket.close();
                this.removeEventListener();
                navigateTo("/main");
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
        this._socket.close();
        console.log("gameRoute occured: isRunning = false, socket is closed");
        this.removeEventListener();
        router();
    }

    removeEventListener() {
        window.removeEventListener('keydown', this._bindKeydown);
        window.removeEventListener('keyup', this._bindKeyup);
        // window.removeEventListener('keydown', this.keydown.bind(this));
        // window.removeEventListener('keyup', this.keyup.bind(this));
        // window.removeEventListener('popstate', this.keydown.bind(this));
        console.log("Event listeners removed.");
    }
}



