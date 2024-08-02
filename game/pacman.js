import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../build/GLTFLoader.js';
import { navigateTo, getCookie } from "../../router.js";

export class PongGame {
    // constructor : renderer, scene, 함수들 정의
    constructor() {
        const canvas1 = document.querySelector("#canvas1");
        const canvas2 = document.querySelector("#canvas2");
        this._divCanvas1 = canvas1;
        this._divCanvas2 = canvas2;
        this._canvasWidth = 712;
        this._canvasHeight = 700;

        // game_var
        this._gameVar = document.querySelector("#game_var");
        this._player1Nick = localStorage.getItem("match_1up");
        this._player2Nick = localStorage.getItem("match_2up");
        this._player1Score = 0;
        this._player2Score = 0;
        this._mode = localStorage.getItem('mode');
        document.querySelector("#player1_nick").innerHTML = this._player1Nick;
        document.querySelector("#player2_nick").innerHTML = this._player2Nick;

        //게임에 사용할 변수들
        this._vec = new THREE.Vector3(0, 0, 2); //공의 방향벡터 //0.5일때 터짐
        this._angularVec = new THREE.Vector3(0, 0, 0); //공의 각속도 회전 벡터
        this._flag = true; //공이 player1의 방향인지 player2의 방향인지 여부
        this._keyState = {}; // 키보드 입력 상태를 추적하는 변수
        this._panel1Vec = new THREE.Vector3(0, 0, 0);
        this._panel2Vec = new THREE.Vector3(0, 0, 0);
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
        window.addEventListener('keydown', this.keydown.bind(this));

        // keyup 이벤트 핸들러를 추가
        window.addEventListener('keyup', this.keyup.bind(this));

        // 게임시작시 카운트 다운
        this.countdown();
        this._renderer1.render(this._scene, this._camera1);
        this._renderer2.render(this._scene, this._camera2);
        setTimeout(() => {requestAnimationFrame(this.render.bind(this));}, 5000);

        // render 함수 정의 및 애니메이션 프레임 요청
        // requestAnimationFrame(this.render.bind(this));
    }

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

    _setupLight() {
        const PLight = new THREE.PointLight();
        const ALight = new THREE.AmbientLight();
        this._PLight = PLight;
        this._ALight = ALight;
        PLight.position.set(50, 50, 0);
        this._scene.add(PLight, ALight);
    }

    _setupModel() {
        const loader = new GLTFLoader();

        //Mesh: pacman ball
        loader.load("./game/pac/scene.gltf", (gltf) => {
            this._ball = gltf.scene;
            this._scene.add(this._ball);
        
            // Ball의 BoundingBox 설정 및 크기 계산
            let box = new THREE.Box3().setFromObject(this._ball);
            let size = new THREE.Vector3();
            box.getSize(size);
            console.log("size: ", size);
            this._radius = Math.max(size.x, size.y, size.z) / 2; // 반지름 계산
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

        // BoxGeometry의 6개 면 정의
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

    render(time) { // 렌더링이 시작된 이후 경과된 밀리초를 받는다
        // 렌더러가 scenen을 카메라의 시점을 기준으로 렌더링하는작업을 한다
        this._renderer1.render(this._scene, this._camera1);
        this._renderer2.render(this._scene, this._camera2);
        this.update(time); // 시간에 따라 애니메이션 효과를 발생시킨다
        requestAnimationFrame(this.render.bind(this));
        // 생성자의 코드와 동일: 계속 렌더 메소드가 무한히 반복되어 호출되도록 만든다
    }

    collisionWithSide() { //충돌이 발생한 plane을 반환한다
        for (const plane of this._planes){
            const collisionPoint = this.getCollisionPointWithPlane(plane);
            if (collisionPoint) {
                this._ball.position.copy(collisionPoint);
                this._ball.position.add(plane.normal.clone().multiplyScalar(this._radius));
                return plane;
            }
        }
        return null;
    }

    // collisionWithPanel() { 
    //     const collisionPoint1 = this.getCollisionPointWithPlane(this._panel1Plane);
    //     const collisionPoint2 = this.getCollisionPointWithPlane(this._panel2Plane);
    
    //     if (collisionPoint1) {
    //         if (Math.abs(collisionPoint1.x - this._panel1.position.x) < 4 && Math.abs(collisionPoint1.y - this._panel1.position.y) < 4 && this._flag == true) {
    //             this._flag = false;
    //             console.log('panel1 충돌 발생');
    
    //             this._ball.position.copy(collisionPoint1);
    //             this._ball.position.add(this._panel1Plane.normal.clone().multiplyScalar(2));
    
    //             this._angularVec.sub(this._panel1Vec.multiplyScalar(0.01));
    //             this.updateVector(this._panel1Plane);
    //             if (collisionPoint1.x < this._panel1.x) {
    //                 this._vec.x += 1;
    //             }
    //             if (collisionPoint1.x > this._panel1.x) {
    //                 this._vec.x -= 1;
    //             }
    //             if (collisionPoint1.y < this._panel1.y) {
    //                 this._vec.y += 1;
    //             }
    //             if (collisionPoint1.y > this._panel1.y) {
    //                 this._vec.y -= 1;
    //             }
    //             this._vec.x *= 1.1;
    //             this._vec.y *= 1.1;
    //             console.log('충돌 지점:', collisionPoint1);
    //         } else {
    //             console.log("player2 win");
    //             document.querySelector("#player2_score").innerHTML = ++this._player2Score;
    //             if (this._player2Score === 1){
    //                 this._vec.set(0, 0, 0);
    //                 this._angularVec.set(0, 0, 0.1);
    //                 if (this._mode === "TOURNAMENT") {
    //                     document.querySelector("#winner2").innerHTML = `
    //                     <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
    //                     <button id="next_button" type="button" style="
    //                         background-color: black;
    //                         width: 328px; height: 199px;
    //                         margin-left: 20px;" 
    //                         class="blue_outline">
    //                         <span style="font-size: 50px; line-height: 50px;">
    //                             >>NEXT
    //                         </span>
    //                         <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
    //                     </button>`;
    //                     this._result = {
    //                         "player1Nick": this._player1Nick,
    //                         "player2Nick": this._player2Nick,
    //                         "player1Score" : this._player1Score,
    //                         "player2Score" : this._player2Score,
    //                         "mode": "TOURNAMENT"
    //                     }  
    //                     localStorage.setItem(`game${localStorage.getItem("match_count")}`, JSON.stringify(this._result));
    //                     localStorage.setItem("match_count", localStorage.getItem("match_count") + 1);
    //                     this._nextButton = document.querySelector("#next_button");
    //                     this._nextButton.addEventListener("click", (event) => {
    //                         navigateTo("/match_schedules");
    //                     })
    //                 } else { // 1vs1
    //                     document.querySelector("#winner2").innerHTML = `
    //                     <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
    //                     <button id="next_button" type="button" style="
    //                         background-color: black;
    //                         width: 328px; height: 199px;
    //                         margin-left: 20px;" 
    //                         class="blue_outline">
    //                         <span style="font-size: 50px; line-height: 50px;">
    //                             1 ON 1
    //                             AGAIN?
    //                         </span>
    //                         <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
    //                     </button>`;
    //                     const result = JSON.stringify({
    //                         "player1Nick": "1up",
    //                         "player2Nick": "2up",
    //                         "player1Score" : this._player1Score,
    //                         "player2Score" : this._player2Score,
    //                         "mode": "1VS1"
    //                     });
    //                     console.log(result);
    //                     this._nextButton = document.querySelector("#next_button");
    //                     this._nextButton.addEventListener("click", async (event) => {
    //                         const response = await fetch("http://localhost:8000/game-management/game", {
    //                             method: "POST",
    //                             headers: {
    //                                 "Content-Type": "application/json",
    //                                 "Authorization": `Bearer ${getCookie('jwt')}`,
    //                             },
    //                             body: result
    //                         });
    
    //                         if (response.ok) {
    //                             console.log("success");
    //                         } else {
    //                             console.log("response", response);
    //                             const errorData = await response.json();
    //                             console.log("errorData", errorData);
    //                         }
    //                         navigateTo("/match_schedules");
    //                     });
    //                 }
    //             }
    //             console.log(this._player2Score);
    //             this._ball.position.x = 0;
    //             this._ball.position.y = 0;
    //             this._ball.position.z = 0;
    //             console.log("ball vec:", this._vec);
    //             this.pauseGame(1000);
    //         }
            
    //     } else if (collisionPoint2) {
    //         if (Math.abs(collisionPoint2.x - this._panel2.position.x) < 4 && Math.abs(collisionPoint2.y - this._panel2.position.y) < 4 && this._flag == false) {
    //             this._flag = true;
    //             console.log('panel2 충돌 발생');
    
    //             this._ball.position.copy(collisionPoint2);
    //             this._ball.position.add(this._panel2Plane.normal.clone().multiplyScalar(2)); //충돌시 반지름만큼 좌표를 더해준다
    
    //             this._angularVec.sub(this._panel2Vec.multiplyScalar(0.01));
    //             this.updateVector(this._panel2Plane);
    
    //             if (collisionPoint2.x < this._panel2.x) {
    //                 this._vec.x += 1;
    //             }
    //             if (collisionPoint2.x > this._panel2.x) {
    //                 this._vec.x -= 1;
    //             }
    //             if (collisionPoint2.y < this._panel2.y) {
    //                 this._vec.y += 1;
    //             }
    //             if (collisionPoint2.y > this._panel2.y) {
    //                 this._vec.y -= 1;
    //             }
    
    //             console.log('충돌 지점:', collisionPoint2);
    //         } else {
    //             console.log("player1 win");
    //             document.querySelector("#player1_score").innerHTML = ++this._player1Score;
    //             if (this._player1Score === 1){
    //                 this._vec.set(0, 0, 0);
    //                 this._angularVec.set(0, 0, 0.1);
    //                 if (this._mode === "TOURNAMENT") {
    //                     document.querySelector("#winner1").innerHTML = `
    //                     <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
    //                     <button id="next_button" type="button" style="
    //                         background-color: black;
    //                         width: 328px; height: 199px;
    //                         margin-left: 20px;" 
    //                         class="blue_outline">
    //                         <span style="font-size: 50px; line-height: 50px;">
    //                             >>NEXT
    //                         </span>
    //                         <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
    //                     </button>`;
    //                     const result = {
    //                         "player1Nick": this._player1Nick,
    //                         "player2Nick": this._player2Nick,
    //                         "player1Score" : this._player1Score,
    //                         "player2Score" : this._player2Score,
    //                         "mode": "TOURNAMENT"
    //                     }  
    //                     localStorage.setItem(`game${localStorage.getItem("match_count")}`, JSON.stringify(result));
    //                     localStorage.setItem("match_count", localStorage.getItem("match_count") + 1);
    //                     this._nextButton = document.querySelector("#next_button");
    //                     this._nextButton.addEventListener("click", (event) => {
    //                         console.log("test");
    //                         navigateTo("/match_schedules");
    //                     });
    //                 } else { // 1vs1
    //                     document.querySelector("#winner1").innerHTML = `
    //                     <div style="font-size: 100px; line-height: 100px; color: white;">WIN!</div>
    //                     <button id="next_button" type="button" style="
    //                         background-color: black;
    //                         width: 328px; height: 199px;
    //                         margin-left: 20px;" 
    //                         class="blue_outline">
    //                         <span style="font-size: 50px; line-height: 50px;">
    //                             1 ON 1
    //                             AGAIN?
    //                         </span>
    //                         <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
    //                     </button>`;
    //                     console.log(JSON.stringify({
    //                         "player1Nick": "1up",
    //                         "player2Nick": "2up",
    //                         "player1Score" : this._player1Score,
    //                         "player2Score" : this._player2Score,
    //                         "mode": "1VS1"
    //                     }));
    //                     this._nextButton = document.querySelector("#next_button");
    //                     this._nextButton.addEventListener("click", async (event) => {
    //                         const response = await fetch("http://localhost:8000/game-management/game", {
    //                             method: "POST",
    //                             headers: {
    //                                 "Content-Type": "application/json",
    //                                 "Authorization": `Bearer ${getCookie('jwt')}`,
    //                             },
    //                             body: JSON.stringify({
    //                                 "player1Nick": "1up",
    //                                 "player2Nick": "2up",
    //                                 "player1Score" : this._player1Score,
    //                                 "player2Score" : this._player2Score,
    //                                 "mode": "1VS1"
    //                             })
    //                         });
    
    //                         if (response.ok) {
    //                             console.log("success");
    //                         } else {
    //                             console.log("response", response);
    //                             const errorData = await response.json();
    //                             console.log("errorData", errorData);
    //                         }
    //                         navigateTo("/match_schedules");
    //                     });
    //                 }
    //             }
    //             console.log(this._player1Score);
    //             this._ball.position.x = 0;
    //             this._ball.position.y = 0;
    //             this._ball.position.z = 0;
    //             console.log("ball vec:", this._vec);
    //             this.pauseGame(1000);
    //         }
    //     }
    // }
    
    async fetchResult() {
        const response = await fetch("http://localhost:8000/game-management/game", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getCookie('jwt')}`,
            },
            body: JSON.stringify({
                "player1Nick": "1up",
                "player2Nick": "2up",
                "player1Score" : this._player1Score,
                "player2Score" : this._player2Score,
                "mode": "1VS1"
            })
            });
            if (response.ok) {
                console.log("success");
            }
            else {
                console.log(await response.json());
            }
    }

    collisionWithGoalArea() { //TODO: 문제발생지점
        const collisionPoint1 = this.getCollisionPointWithPlane(this._panel1Plane);
        const collisionPoint2 = this.getCollisionPointWithPlane(this._panel2Plane);

        if (collisionPoint1){
            if (Math.abs(collisionPoint1.x  - this._panel1.position.x) < 4 && Math.abs(collisionPoint1.y - this._panel1.position.y) < 4 && this._flag == true) {
                this._flag = false;
                console.log('panel1 충돌 발생');
                // 구체 중심과 PlaneMesh의 경계 상자 내에서의 최소 거리 계산

                this._ball.position.copy(collisionPoint1);
                this._ball.position.add(this._panel1Plane.normal.clone().multiplyScalar(2));

                this._angularVec.sub(this._panel1Vec.multiplyScalar(0.01));
                this.updateVector(this._panel1Plane);
                if (collisionPoint1.x < this._panel1.x) {
                    this._vec.x += 1;
                }
                if (collisionPoint1.x > this._panel1.x) {
                    this._vec.x -= 1;
                }
                if (collisionPoint1.y < this._panel1.y) {
                    this._vec.y += 1;
                }
                if (collisionPoint1.y > this._panel1.y) {
                    this._vec.y -= 1;
                }
                this._vec.x *= 1.1;
                this._vec.y *= 1.1;
                console.log('충돌 지점:', collisionPoint1);
            }
            else {
                console.log("player2 win");
                document.querySelector("#player2_score").innerHTML = ++this._player2Score;
                if (this._player2Score === 1){
                    this._vec.set(0, 0, 0);
                    this._angularVec.set(0, 0, 0.1);
                    if (this._mode === "TOURNAMENT") {
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
                        this._result = {
                            "player1Nick": this._player1Nick,
                            "player2Nick": this._player2Nick,
                            "player1Score" : this._player1Score,
                            "player2Score" : this._player2Score,
                            "mode": "TOURNAMENT"
                        }  
                        localStorage.setItem(`game${localStorage.getItem("match_count")}`, JSON.stringify(this._result));
                        localStorage.setItem("match_count", localStorage.getItem("match_count") + 1);
                        this._nextButton = document.querySelector("#next_button");
                        this._nextButton.addEventListener("click", (event) => {
                            navigateTo("/match_schedules");
                        })
                    }
                    else { //TODO: 1vs1
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
                        /////////////////////
                        this.fetchResult();
                        /////////////////////////////////////
                        this._nextButton = document.querySelector("#next_button");
                        this._nextButton.addEventListener("click", (event) => {
                            navigateTo("/main");
                        })
                    }
                }
                console.log(this._player2Score);
                this._ball.position.x = 0;
                this._ball.position.y = 0;
                this._ball.position.z = 0;
                console.log("ball vec:", this._vec);
                this.pauseGame(1000);
            }
            
        }
        else if (collisionPoint2){
            if (Math.abs(collisionPoint2.x  - this._panel2.position.x) < 4 && Math.abs(collisionPoint2.y - this._panel2.position.y) < 4 && this._flag == false) {
                this._flag = true;
                console.log('panel2 충돌 발생');

                this._ball.position.copy(collisionPoint2);
                this._ball.position.add(this._panel2Plane.normal.clone().multiplyScalar(2)); //충돌시 반지름만큼 좌표를 더해준다
            
                this._angularVec.sub(this._panel2Vec.multiplyScalar(0.01));
                this.updateVector(this._panel2Plane);

                if (collisionPoint2.x < this._panel2.x) {
                    this._vec.x += 1;
                }
                if (collisionPoint2.x > this._panel2.x) {
                    this._vec.x -= 1;
                }
                if (collisionPoint2.y < this._panel2.y) {
                    this._vec.y += 1;
                }
                if (collisionPoint2.y > this._panel2.y) {
                    this._vec.y -= 1;
                }

                console.log('충돌 지점:', collisionPoint2);
                // console.log('구체 중심과 충돌 지점 간의 거리:', distance);
            }
            else {
                console.log("player1 win");
                document.querySelector("#player1_score").innerHTML = ++this._player1Score;
                if (this._player1Score === 1){
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
                        const result = {
                            "player1Nick": this._player1Nick,
                            "player2Nick": this._player2Nick,
                            "player1Score" : this._player1Score,
                            "player2Score" : this._player2Score,
                            "mode": "TOURNAMENT"
                        }  
                        localStorage.setItem(`game${localStorage.getItem("match_count")}`, JSON.stringify(result));
                        localStorage.setItem("match_count", localStorage.getItem("match_count") + 1);
                        this._nextButton = document.querySelector("#next_button");
                        this._nextButton.addEventListener("click", (event) => {
                            console.log("test");
                            navigateTo("/match_schedules");
                        })
                    }
                    else { //TODO: 1vs1
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
                        /////////////////////
                        this.fetchResult();
                        /////////////////////////////////////
                        this._nextButton = document.querySelector("#next_button");
                        this._nextButton.addEventListener("click", (event) => { 
                            navigateTo("/main");
                        })
                    }
                }
                console.log(this._player1Score);
                this._ball.position.x = 0;
                this._ball.position.y = 0;
                this._ball.position.z = 0;
                console.log("ball vec:", this._vec);
                this.pauseGame(1000);
            }
        }
    }

    getCollisionPointWithPlane(plane) {
        const ballCenter = this._ball.position;
        const ballRadius = this._radius;

        const distanceToPlane = plane.distanceToPoint(ballCenter);

        if (Math.abs(distanceToPlane) <= ballRadius) {
            const collisionPoint = ballCenter.clone().sub(plane.normal.clone().multiplyScalar(distanceToPlane));
            return collisionPoint;
        }
        return null;
    }

    updateAngularVelocity(plane, radius) {
        const n = plane.normal.clone();
        const w = this._angularVec.clone();

        // 충격 모멘트 계산 (τ = r × F)
        const F = this._angularVec.clone().multiplyScalar(-0.1); //마찰력
        // console.log("F: ", F);
        const r = n.clone();
        const tau = r.clone().cross(F);
        // console.log("Torque (τ):", tau);
    
        // 관성 모멘트 텐서의 역행렬 계산
        const I_inv = new THREE.Matrix3().set(
            1 / (0.4 * radius * radius), 0, 0,
            0, 1 / (0.4 * radius * radius), 0,
            0, 0, 1 / (0.4 * radius * radius)
        );
    
        // 각속도 변화 계산 (Δω = I^(-1) * τ)
        const delta_w = new THREE.Vector3().copy(tau).applyMatrix3(I_inv);
        // console.log("Angular Velocity Change (Δω):", delta_w);
    
        // 최종 각속도 벡터 계산 (ω' = ω + Δω)
        const w_prime = w.clone().add(delta_w);
        console.log("Final Angular Velocity (ω'):", w_prime);
        
        const spinSpeed = w_prime.length();
        if (spinSpeed > 0.1)
            w_prime.multiplyScalar(spinSpeed / 2);
        // 각속도 벡터 업데이트
        this._angularVec.copy(w_prime);
    }

    updateVector(plane) {
        //초기벡터 임시저장
        const previousVec = this._vec.clone();

        // ball의 방향벡터
        // v = v - 2(v dot plane.normal)plane.normal + w cross (radius * plane.normal)
        const dotProduct = this._vec.dot(plane.normal);
        // console.log("Dot Product:", dotProduct);

        const reflection = plane.normal.clone().multiplyScalar(dotProduct * 2);
        // console.log("Reflection:", reflection);

        const angularComponent = this._angularVec.clone().cross(plane.normal.clone().multiplyScalar(this._radius));
        // console.log("angularComponent:", angularComponent);

        this._vec.sub(reflection).add(angularComponent);

        // ball의 각속도 벡터
        this.updateAngularVelocity(plane, this._radius, previousVec);
    }

    update(time) { // TODO: 앞으로 동작에 대해서 함수를 들어서 정의해야함
        if (this._ball && !this._isPaused) {
            // 공의 이동 업데이트를 작은 시간 간격으로 나누어 수행
            const steps = 10; // 충돌 체크 빈도
            for (let i = 0; i < steps; i++) {
                const movement = new THREE.Vector3().copy(this._vec).multiplyScalar(0.4 / steps); //이게 뭐였더라
                this._ball.position.add(movement);
                this._ball.rotation.x += this._angularVec.x;
                this._ball.rotation.y += this._angularVec.y;
                this._ball.rotation.z += this._angularVec.z;

                // 충돌 감지 및 처리
                const collisionPlane = this.collisionWithSide();
                if (collisionPlane) {
                    // console.log("collision plane return");
                    // console.log(collisionPlane.normal);
                    this.updateVector(collisionPlane);
                    break; // 충돌이 발생하면 반복문을 중지합니다.
                }
                this.collisionWithGoalArea();
            }
            this.updatePanel();
            this._perspectiveLineEdges.position.z = this._ball.position.z;
        }
    }

    pauseGame(duration) {
        this._isPaused = true;
        setTimeout(() => {
            this._isPaused = false;
        }, duration);
    }

    keydown(event) {
        this._keyState[event.code] = true;
    }

    keyup(event){
        // console.log("test");
        this._keyState[event.code] = false;
    }

    updatePanel(){
        if (this._keyState['KeyW']) {
            this._panel1.position.y += 0.6;
            this._panel1Vec.y = 0.6;
        }
        if (this._keyState['KeyS']) {
            this._panel1.position.y -= 0.6;
            this._panel1Vec.y = -0.6;
        }
        if (this._keyState['KeyA']) {
            this._panel1.position.x -= 0.6;
            this._panel2Vec.x = -0.6;
        }
        if (this._keyState['KeyD']) {
            this._panel1.position.x += 0.6;
            this._panel2Vec.x = 0.6;
        }
        if (this._keyState['ArrowUp']) {
            this._panel2Vec.y = 0.6;
            this._panel2.position.y += 0.6;
        }
        if (this._keyState['ArrowDown']) {
            this._panel2Vec.y = -0.6;
            this._panel2.position.y -= 0.6;
        }
        if (this._keyState['ArrowLeft']) {
            this._panel2Vec.x = 0.6;
            this._panel2.position.x += 0.6;
        }
        if (this._keyState['ArrowRight']) {
            this._panel2Vec.x = -0.6;
            this._panel2.position.x -= 0.6;
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
                return ;
            }
        }, 1000);
    }
}

// window.onload = function() {
//     new PongGame();
// }
