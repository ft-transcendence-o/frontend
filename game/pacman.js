import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../build/GLTFLoader.js';
import { navigateTo, baseUrl, router} from "../../router.js";
import { get_translated_value } from "../../language.js"

export class PongGame {
    constructor(sessionData, mode) {
        console.log("wss://127.0.0.1/api/pong-game/" + mode + sessionData.user_id)
        this._mode = mode;
        this._socket = new WebSocket("wss://127.0.0.1/api/pong-game/" + mode + sessionData.user_id);
        this._eventList = [];
        this._eventCnt = 0;

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
            this._player1.Nick = sessionData.players_name[sessionData.win_history[0]];
            this._player2.Nick = sessionData.players_name[sessionData.win_history[1]];
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

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color("black");

        this._setupCamera(); // 카메라 객체 설정
        this._setupLight(); // 광원을 설정
        this._setupModel(); // 3차원 모델을 설정

        // keydown 이벤트 핸들러를 추가
        this._bindKeydown = this.keydown.bind(this);
        document.addEventListener('keydown', this._bindKeydown);
        this._eventList[this._eventCnt++] = {
            function: this._bindKeydown,
            event: 'keydown',
            ref: document,
            title: 'keydown',
        }

        // keyup 이벤트 핸들러를 추가
        this._bindKeyup = this.keyup.bind(this);
        document.addEventListener('keyup', this._bindKeyup);
        this._eventList[this._eventCnt++] = {
            function: this._bindKeyup,
            event: 'keyup',
            ref: document,
            title: 'keyup',
        }

        // main 버튼 이벤트 핸들러를 추가
        this.mainButtonEvent();

        // 뒤로가기 앞으로가기 이벤트 핸들러를 추가
        this._bindgameRoute = this.gameRoute.bind(this);
        window.addEventListener('popstate', this._bindgameRoute);
        this._eventList[this._eventCnt++] = {
            function: this._bindgameRoute,
            event: 'popstate',
            ref: window,
            title: 'popstate',
        }

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
        this._renderer1.render(this._scene, this._camera1);
        this._renderer2.render(this._scene, this._camera2);
        this.countdown();
    }

    // 카메라 설정
    _setupCamera() {
        const width = this._canvasWidth;
        const height = this._canvasHeight;
        this._camera1 = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000
        );
        this._camera1.position.set(0, 4, 80);
        this._camera1.lookAt(0, 0, 0);

        this._camera2 = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            1000
        );
        this._camera2.position.set(0, 4, -80);
        this._camera2.lookAt(0, 0, 0);
    }

    // 조명 설정 | 전체조명사용하도록 수정예정
    _setupLight() {
        this._PLight = new THREE.PointLight();
        this._ALight = new THREE.AmbientLight();
        this._PLight.position.set(50, 50, 0);
        this._scene.add(this._PLight, this._ALight);
    }

    // 렌더링할 Mesh들을 정의하고 생성하는 함수
    _setupModel() {
        this._loader = new GLTFLoader();

        //Mesh: pacman ball
        this._loader.load("./game/pac/scene.gltf", (gltf) => {
            this._ball = gltf.scene;
            this._ball.position.x = 0;
            this._ball.position.y = 0;
            this._ball.position.z = 0;
            this._ball.rotation.x = 0;
            this._ball.rotation.y = 0;
            this._ball.rotation.z = 0;
            this._scene.add(this._ball);
        });

        const edgeThickness = 0.1; // 선의 두께 설정
        //Mesh: 원근감을 위한 사각테두리라인
        const positions = [10, 10, 0, 10, -10, 0, -10, -10, 0, -10, 10, 0, 10, 10, 0];
        this._perspectiveLineEdgesMaterial = new THREE.MeshBasicMaterial({ color: 0x14ff00 });
        this._perspectiveLineEdges = new THREE.Group();
        
        for (let i = 0; i < positions.length - 3; i += 3) {
            let start = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
            let end = new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
        
            const cylinderGeometry = new THREE.CylinderGeometry(edgeThickness, edgeThickness, start.distanceTo(end), 8); // 8각형으로 원통 구성
            const edge = new THREE.Mesh(cylinderGeometry, this._perspectiveLineEdgesMaterial);
        
            let midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            edge.position.copy(midPoint);
        
            edge.lookAt(end);
            edge.rotateX(Math.PI / 2);
        
            this._perspectiveLineEdges.add(edge);
            start = null;
            end = null;
            midPoint = null;
        }
        this._perspectiveLineEdges.position.x = 0;
        this._perspectiveLineEdges.position.y = 0;
        this._perspectiveLineEdges.position.z = 0;
        this._scene.add(this._perspectiveLineEdges);

        //Mesh: 경기장
        this._stadiumGeometry = new THREE.BoxGeometry(20, 20, 100);
        this._stadiumMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
        });
        this._stadium = new THREE.Mesh(this._stadiumGeometry, this._stadiumMaterial);

        this._scene.add(this._stadium);

        // BoxGeometry의 4개 면 정의
        this._planes = [
            new THREE.Plane(new THREE.Vector3(1, 0, 0), this._stadium.geometry.parameters.width / 2),  // Left
            new THREE.Plane(new THREE.Vector3(-1, 0, 0), this._stadium.geometry.parameters.width / 2), // Right
            new THREE.Plane(new THREE.Vector3(0, 1, 0), this._stadium.geometry.parameters.height / 2), // Bottom
            new THREE.Plane(new THREE.Vector3(0, -1, 0), this._stadium.geometry.parameters.height / 2), // Top
        ];

        //Mesh: 경기장 테두리
        this._stadiumEdges = new THREE.EdgesGeometry(this._stadiumGeometry);
        this._edgesMaterial = new THREE.MeshBasicMaterial({ color: 0x1e30f5 });

        const stadiumPositions = this._stadiumEdges.attributes.position.array;
        this._stadiumEdges = new THREE.Group();
        for (let i = 0; i < stadiumPositions.length - 3; i += 6) {
            const start = new THREE.Vector3(stadiumPositions[i], stadiumPositions[i + 1], stadiumPositions[i + 2]);
            const end = new THREE.Vector3(stadiumPositions[i + 3], stadiumPositions[i + 4], stadiumPositions[i + 5]);
        
            const cylinderGeometry = new THREE.CylinderGeometry(edgeThickness, edgeThickness, start.distanceTo(end), 8); // 8각형으로 원통 구성
            const edge = new THREE.Mesh(cylinderGeometry, this._edgesMaterial);
        
            const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            edge.position.copy(midPoint);
        
            edge.lookAt(end);
            edge.rotateX(Math.PI / 2);
        
            this._stadiumEdges.add(edge);
        }
        this._scene.add(this._stadiumEdges);

        //Mesh: 패널
        this._panelGeomtery = new THREE.PlaneGeometry(6, 6);
        this._panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1e30f5,
            transparent: true,
            opacity: 0.5
        });
        this._panel1 = new THREE.Mesh(this._panelGeomtery, this._panelMaterial);
        this._panel1.position.set(0, 0, 50);
        this._panel1.lookAt(0, 0, 100);
        this._panel1Plane = new THREE.Plane(new THREE.Vector3(0, 0, -1), this._stadium.geometry.parameters.depth / 2);
        this._scene.add(this._panel1);

        this._panel2 = new THREE.Mesh(this._panelGeomtery, this._panelMaterial);
        this._panel2.position.set(0, 0, -50);
        this._panel2.lookAt(0, 0, -100);
        this._panel2Plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), this._stadium.geometry.parameters.depth / 2);
        this._scene.add(this._panel2);
    }

    // 렌더링함수
    render(time) { // 렌더링이 시작된 이후 경과된 밀리초를 받는다
        if (this._isRunning === false) {
            console.log("rendering finish");
            return ;
        }
        // 렌더러가 scenen을 카메라의 시점을 기준으로 렌더링하는작업을 한다
        this._renderer1.render(this._scene, this._camera1);
        this._renderer2.render(this._scene, this._camera2);
        this.update(time); // 시간에 따라 애니메이션 효과를 발생시킨다
        requestAnimationFrame(this.render.bind(this));
    }

    player1Win() {
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
            this._nextButtonClick = this.nextButtonClick.bind(this);
            document.querySelector("#next_button").addEventListener("click", this._nextButtonClick);
            this._eventList[this._eventCnt++] = {
                function: this._nextButtonClick,
                event: 'click',
                ref: document.querySelector("#next_button"),
                title: 'next_button_click',
            }

            document.querySelector("#next_button").focus();
            // this._nextButtonEnter = this.nextButtonEnter.bind(this);
            // document.querySelector("#next_button").addEventListener("keydown", this._nextButtonEnter);
            // document.querySelector("#next_button").focus();
            // this._eventList[this._eventCnt++] = {
            //     function: this._nextButtonEnter,
            //     event: 'keydown',
            //     ref: document.querySelector("#next_button"),
            //     title: 'next_button_en',
            // }

            this._ButtonBlur = this.ButtonBlur.bind(this);
            document.querySelector("#next_button").addEventListener('blur', this.ButtonBlur);
            this._eventList[this._eventCnt++] = {
                function: this._nextButtonEnter,
                event: 'blur',
                ref: document.querySelector("#next_button"),
                title: 'next_button_blur',
            }
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
            this._playAgainButtonClick = this.playAgainButtonClick.bind(this);
            document.querySelector("#next_button").addEventListener("click", this._playAgainButtonClick);
            this._eventList[this._eventCnt++] = {
                function: this._playAgainButtonClick,
                event: 'click',
                ref: document.querySelector("#next_button"),
                title: 'next_button_click',
            }

            document.querySelector("#next_button").focus();
            // this._playAgainButtonEnter = this.playAgainButtonEnter.bind(this);
            // document.querySelector("#next_button").addEventListener("keydown", this._playAgainButtonEnter);
            // document.querySelector("#next_button").focus();
            // this._eventList[this._eventCnt++] = {
            //     function: this._playAgainButtonEnter,
            //     event: 'keydown',
            //     ref: document.querySelector("#next_button"),
            //     title: 'next_button_enter',
            // }

            this._ButtonBlur = this.ButtonBlur.bind(this);
            document.querySelector("#next_button").addEventListener('blur', this.ButtonBlur);
            this._eventList[this._eventCnt++] = {
                function: this._nextButtonEnter,
                event: 'blur',
                ref: document.querySelector("#next_button"),
                title: 'next_button_blur',
            }
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
            this._nextButtonClick = this.nextButtonClick.bind(this);
            document.querySelector("#next_button").addEventListener("click", this._nextButtonClick);
            this._eventList[this._eventCnt++] = {
                function: this._nextButtonClick,
                event: 'click',
                ref: document.querySelector("#next_button"),
                title: 'next_button_click',
            }

            document.querySelector("#next_button").focus();
            // this._nextButtonEnter = this.nextButtonEnter.bind(this);
            // document.querySelector("#next_button").addEventListener("keydown", this._nextButtonEnter);
            // document.querySelector("#next_button").focus();
            // this._eventList[this._eventCnt++] = {
            //     function: this._nextButtonEnter,
            //     event: 'keydown',
            //     ref: document.querySelector("#next_button"),
            //     title: 'next_button_enter',
            // }

            this._ButtonBlur = this.ButtonBlur.bind(this);
            document.querySelector("#next_button").addEventListener('blur', this.ButtonBlur);
            this._eventList[this._eventCnt++] = {
                function: this._nextButtonEnter,
                event: 'blur',
                ref: document.querySelector("#next_button"),
                title: 'next_button_blur',
            }
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
            document.querySelector("#next_button")
            this._playAgainButtonClick = this.playAgainButtonClick.bind(this);
            document.querySelector("#next_button").addEventListener("click", this._playAgainButtonClick);
            this._eventList[this._eventCnt++] = {
                function: this._playAgainButtonClick,
                event: 'click',
                ref: document.querySelector("#next_button"),
                title: 'next_button_click',
            }

            document.querySelector("#next_button").focus();
            // this._playAgainButtonEnter = this.playAgainButtonEnter.bind(this);
            // document.querySelector("#next_button").addEventListener("keydown", this._playAgainButtonEnter);
            // document.querySelector("#next_button").focus();
            // this._eventList[this._eventCnt++] = {
            //     function: this._playAgainButtonEnter,
            //     event: 'keydown',
            //     ref: document.querySelector("#next_button"),
            //     title: 'next_button_enter',
            // }

            this._ButtonBlur = this.ButtonBlur.bind(this);
            document.querySelector("#next_button").addEventListener('blur', this.ButtonBlur);
            this._eventList[this._eventCnt++] = {
                function: this._nextButtonEnter,
                event: 'blur',
                ref: document.querySelector("#next_button"),
                title: 'next_button_blur',
            }
        }
    }

    update(time) {
        if (this._socket.onopen && !this._isPaused) {
            this._perspectiveLineEdges.position.z = this._ball.position.z;
            this._ball.rotation.x += this._rotVec.x;
            this._ball.rotation.y += this._rotVec.y;
            this._ball.rotation.z += this._rotVec.z;
        }
    }

    handleSocketMessage(event) {
        const received = JSON.parse(event.data); // ball 좌표, panel1 좌표, panel2 좌표가 순서대로 들어온다고 가정

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
            this._isRunning = false;
            if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
                this._socket.close();
                this._socket = null;
                console.log("WebSocket closed.");
            }
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
            if (this._isRunning === false) {
            }
            event.preventDefault();
            this._isRunning = false;
            if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
                this._socket.close();
                this._socket = null;
                console.log("WebSocket closed.");
            }
            this.removeEventListener();
            navigateTo("/main");
        }
    }

    keyup(event){
        if (event.code in this._keyState) {
            this._keyState[event.code] = false;
            this._socket.send(JSON.stringify(this._keyState));
        }
    }

    countdown() {
        let countdownElement = document.querySelector("#countDown");
        let countdownValue = 40;
    
        let countdownInterval = setInterval(() => {
            --countdownValue;
            if (countdownValue % 10 === 0) {
                countdownElement.innerText = countdownValue / 10;
            }
            if (this._isRunning === false) {
                clearInterval(countdownInterval);
                this.removeEventListener();
                navigateTo("main");
                return ;
            }
            else if (countdownValue === 0) {
                requestAnimationFrame(this.render.bind(this))
                countdownElement.innerText = "START";
                return ;
            }
            else if (countdownValue === -1) {
                if (this._socket === null) {
                    clearInterval(countdownInterval);
                    this.removeEventListener();
                    navigateTo("main");
                    return ;
                }
                else if (this._socket.readyState === 1) {
                    clearInterval(countdownInterval);
                    countdownElement.innerText = "";
                    this._socket.send("start");
                    return ;
                }
                else { //순수하게 카운트가 -1인 경우
                    clearInterval(countdownInterval);
                    this.removeEventListener();
                    navigateTo("main");
                    return ;
                }
            }
        }, 100);
    }

    mainButtonEvent() {
        this._Top_Button = document.querySelector("#top_item").querySelector("a");
        this._mainButtonClick = this.mainButtonClick.bind(this);
        this._Top_Button.addEventListener('click', this._mainButtonClick);
        this._eventList[this._eventCnt++] = {
            function: this._mainButtonClick,
            event: 'click',
            ref: this._Top_Button,
            title: 'main_click',
        }

        this._mainButtonMouseEnter = this.mainButtonMouseEnter.bind(this);
        this._Top_Button.addEventListener('mouseenter', this._mainButtonMouseEnter);
        this._eventList[this._eventCnt++] = {
            function: this._mainButtonMouseEnter,
            event: 'mouseenter',
            ref: this._Top_Button,
            title: 'main_mouse_enter',
        }

        this._mainButtonMouseLeave = this.mainButtonMouseLeave.bind(this);
        this._Top_Button.addEventListener('mouseleave', this._mainButtonMouseLeave);
        this._eventList[this._eventCnt++] = {
            function: this._mainButtonMouseLeave,
            event: 'mouseleave',
            ref: this._Top_Button,
            title: 'main mouse leave',
        }
    }

    mainButtonClick(event) {
        console.log("main click");
        event.preventDefault();
        this._isRunning = false;
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close();
            this._socket = null;
            console.log("WebSocket closed.");
        }
        this.removeEventListener();
        navigateTo("/main");
    }

    mainButtonMouseEnter(event) {
        this._Top_Button.classList.remove("blue_outline");
        this._Top_Button.classList.add("green_outline");
        this._Top_Button.classList.add("white_stroke_2_5px");
    }

    mainButtonMouseLeave(event) {
        this._Top_Button.classList.add("blue_outline");
        this._Top_Button.classList.remove("green_outline");
        this._Top_Button.classList.remove("white_stroke_2_5px");
    }

    nextButtonClick(event) {
        this._isRunning = false;
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close();
            this._socket = null;
            console.log("WebSocket closed.");
        }
        console.log("next Button Click");
        this.removeEventListener();
        navigateTo("/match_schedules");
    }

    nextButtonEnter(event) {
        if (event.code === 'Enter') {
            this._isRunning = false;
            if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
                this._socket.close();
                this._socket = null;
                console.log("WebSocket closed.");
            }
            console.log("next Button Enter");
            this.removeEventListener();
            navigateTo("/match_schedules");
        }
    }

    playAgainButtonClick(event) {
        this._isRunning = false;
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close();
            this._socket = null;
            console.log("WebSocket closed.");
        }
        console.log("paly Again Button Click");
        this.removeEventListener();
        navigateTo("/normal_game");
    }

    playAgainButtonEnter(event) {
        if (event.code === 'Enter'){
            this._isRunning = false;
            if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
                this._socket.close();
                this._socket = null;
                console.log("WebSocket closed.");
            }
            console.log("play Again Button Enter");
            this.removeEventListener();
            navigateTo("/normal_game"); //여기로 이동할때 게임이 안꺼지고 나간다
        }
    }
    
    ButtonBlur(event) {
        event.preventDefault();
        const nextButton = document.querySelector("#next_button");
        if (nextButton)// next_button이 존재하는지 확인
            nextButton.focus(); // 포커스가 벗어났다면 다시 포커스를 설정
        console.log('blur');
    }

    gameRoute() {
        this._isRunning = false;
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close();
            this._socket = null;
            console.log("WebSocket closed.");
        }
        console.log("gameRoute occured: isRunning = false, socket is closed");

        // 여기에서 모든 이벤트를 제거
        this.removeEventListener();
        document.querySelector('#app').innerHTML = '';
        // 페이지를 실제로 변경
        router();
    }

    //14개중에서 7개가 지워짐
    removeEventListener() {
        console.log("Removing all event listeners...");
        
        for (let i = 0; i < this._eventCnt; i++) {
            const eventInfo = this._eventList[i];
            if (eventInfo.ref && eventInfo.ref.removeEventListener) {
                eventInfo.ref.removeEventListener(eventInfo.event, eventInfo.function);
                console.log(`Removed listener for event: ${eventInfo.title}`);
            }
        }
        
        // 추가로 WebSocket이 열려있다면 닫기
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close();
            this._socket = null;
            console.log("WebSocket closed.");
        }
    
        // 필요시 타이머도 해제
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
            console.log("Countdown interval cleared.");
        }
        
        console.log("All event listeners removed.");
        this.disposeThree();
    }

    disposeThree() {
        if (this._renderer1) { 
            this._renderer1.dispose();
            this._renderer1 = null;
        }
        if (this._renderer2) {
            this._renderer2.dispose();
            this._renderer2 = null;
        }
        if (this._socket)
            this._socket = null;
        if (this._scene) {
            if (this._scene.background)
                this._scene.background = null;
            this._scene = null;
        }
        if (this._camera1)
            this._camera1 = null;
        if (this._camera2)
            this._camera2 = null;
        if (this._PLight) {
            this._PLight.dispose();
            this._PLight = null;
        }
        if (this._ALight) {
            this._ALight.dispose();
            this._ALight = null;
        }
        if (this._loader)
            this._loader = null;
        if (this._perspectiveLineEdgesMaterial) {
            this._perspectiveLineEdgesMaterial.dispose();
            this._perspectiveLineEdgesMaterial = null;
        }
        if (this._perspectiveLineEdges) {
            this.disposePerpectiveEdges();
            this._perspectiveLineEdges = null;
        }
        if (this._stadiumGeometry) {
            this._stadiumGeometry.dispose();
            this._stadiumGeometry = null;
        }
        if (this._stadiumMaterial) {
            this._stadiumMaterial.dispose();
            this._stadiumMaterial = null;
        }
        if (this._stadium)
            this._stadium = null;
        if (this._planes) 
            this._planes = null;
        if (this._stadiumEdges)
            this._stadiumEdges = null;
        if (this._edgesMaterial) {
            this._edgesMaterial.dispose();
            this._edgesMaterial = null;
        }
        if (this._stadiumEdges)
            this.disposeStadiumEdges();
        if (this._panel1)
            this.disposePanel1();
        if (this._panel2)
            this.disposePanel2();
    }

    disposePanel2() {
        if (this._panel2Plane)
            this._panel2Plane = null;
        this._panel2 = null;
    }

    disposePanel1() {
        if (this._panelGeomtery) {
            this._panelGeomtery.dispose();
            this._panelGeomtery = null;
        }
        if (this._panelMaterial) {
            this._panelMaterial.dispose();
            this._panelMaterial = null;
        }
        if (this._panel1Plane)
            this._panel1Plane = null;
        this._panel1 = null;
    }

    disposeStadiumEdges() {
        this._stadiumEdges.traverse((object) => {
            // object가 Mesh인 경우에만 처리
            if (object.isMesh) {
                // 기하구조 해제
                if (object.geometry) {
                    object.geometry.dispose();
                    object.geometry = null;
                }
                // 재질 해제
                if (object.material) {
                    // 재질이 배열인 경우 처리
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => {
                            if (material && material.dispose) {
                                material.dispose();
                                material = null;
                            }
                        });
                    } else {
                        // 단일 재질인 경우 처리
                        if (object.material.dispose) {
                            object.material.dispose();
                            object.material = null;
                        }
                    }
                }
            }
        });
    }

    disposePerpectiveEdges() {
        this._perspectiveLineEdges.children.forEach(edge => {
            // 기하구조 해제
            if (edge.geometry) {
                edge.geometry.dispose();
                edge.geometry = null;
            }
            
            // 재질이 따로 있다면 해제 (공유 재질이 아니면)
            if (edge.material && edge.material.dispose) {
                edge.material.dispose();
                edge.material = null;
            }
        });
    
        // 모든 메쉬를 씬에서 제거
        this._perspectiveLineEdges.clear();
    }
}



