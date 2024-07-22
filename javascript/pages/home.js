import AbstractView from "./AbstractView.js";

function decodeJWTManually(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `
        <!-- background image -->
	
	<div class="container-fluid d-flex flex-column align-items-center">
		
		<img class="backimg" src="./image/background.png" alt="">

		<!-- title -->
        <div style="position:absolute; padding-top: 205px; z-index: 1;" class="row">
            <div class="col-12" style="text-align: center; border: solid; border-color: #A259FF; padding: 6px 5px; border-width: 5px;">
                <h1 style="width: 1200px; height: auto; padding: 36px 65px; border: solid; border-color: #FED940; border-width: 3px; font-size: 150px; margin-bottom: 0px;" class="display-1 PacPong_font">
                    <span style="color:#14FF00">Pa</span><span style="color:#FED940">c</span>
                    <span style="color:#14FF00">Pon</span><span style="color:#FED940">g</span>
                </h1>
            </div>
        </div>

		<!-- ghost -->
		<div class="row" style="position:absolute; padding-top:534px; z-index: 2;">
			<!-- <div class="col-12" style="padding-left: 31%;"> -->
			<div class="col-12">
				<img style="padding-left: 20px; width: 144px; height: auto; padding-right: 20px;" src="./image/ghost_red.png" alt="Red Ghost">
				<img style="padding-left: 20px; width: 144px; height: auto; padding-right: 20px;" src="./image/ghost_blue.png" alt="Blue Ghost">
				<img style="padding-left: 20px; width: 144px; height: auto; padding-right: 20px;" src="./image/ghost_orange.png" alt="Orange Ghost">
				<img style="padding-left: 20px; width: 144px; height: auto; padding-right: 20px;" src="./image/ghost_pink.png" alt="Pink Ghost">
			</div>
		</div>
		<!-- log in -->
		<div style="position:absolute; padding-top: 708px; z-index: 3;" class="row">
			<div class="col-12 login" style="cursor: pointer;">
				<!-- <button style="background-color: rgba(0, 0, 0, 0); border: 0;"> -->
				<img src="../image/pacman.png" style="transform: scaleX(-1); width: 100px; height: 107.18px;" alt="pacman">
				<span style="font-family: Arial, Helvetica, sans-serif; font-size: 70px; vertical-align: middle;" class="PS2P_font">►</span>
				<span style="padding-right: 160px; font-size: 70px; vertical-align: middle;" class="PS2P_font">LOG-IN</span>
			<!-- </button> -->
			</div>
		</div>

		<!-- QR Code -->
		

		<!-- footer -->
		<div class="row" style="position:absolute; padding-top:890px; z-index: 2;">
			<div class="col-12">
				<p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 44px; font-size: 30px;">© 2024 42SEOUL MFG. CO.</p>
			</div>
		</div>
	
		
    </div>

	<!-- QR Code -->
	<div id="qrcode"></div>
    `;
    }

    async init() {
        function login_click(event) {
            event.preventDefault(); // 기본 동작 방지
            // 사용자를 42 인증 페이지로 리다이렉트
            // query parameter(?다음) 부분을 환경변수로 대체해야 한다.
            window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-13da844ab09c30f81a4aac6f7f77bd34bfa89523fd00822876ca6c9ab86ac14f&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500&response_type=code";
        }
        

            const login_button = document.querySelector(".login");
            const login_arrow = login_button.querySelector("span");
            const login_text = login_button.querySelector("span:last-child");
            login_button.addEventListener("click", login_click);
            login_button.addEventListener("mouseenter", (event) => {
                login_text.classList.add("green_hover");
                login_text.classList.add("white_stroke_5px");
                login_arrow.classList.add("red_hover");
                console.log("hovering");
            });
            login_button.addEventListener("mouseleave", (event) => {
                login_text.classList.remove("green_hover");
                login_text.classList.remove("white_stroke_5px");
                login_arrow.classList.remove("red_hover");
                console.log("hover out");
            });
            // URL에서 코드 파라미터 확인
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            if (code) {
                console.log("Received authorization code:", code);
                // 여기서 백엔드로 코드를 보내 액세스 토큰을 얻는 로직을 구현할 수 있습니다.
        
                // 데이터 준비
                // const data = new URLSearchParams({
                //     grant_type: 'authorization_code',
                //     client_id: 'u-s4t2ud-13da844ab09c30f81a4aac6f7f77bd34bfa89523fd00822876ca6c9ab86ac14f',
                //     client_secret: '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',
                //     code: code,
                // });
        
                // authorization code를 백엔드에 전송하고 백엔드로부터 응답 받기
                const response = await fetch("http://10.19.218.225:8000/user-management/token", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // body: data
                    body: JSON.stringify({"code": code})
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log("success");
                    console.log(response);
                    console.log(jsonResponse);
                    console.log(jsonResponse['jwt']); //await으로 해결
                    const decodedToken = decodeJWTManually(jsonResponse['jwt']); //여기
                    console.log(decodedToken);

                }
                else {
                    console.log("error");
                }
                // .then(response => {
                //     if (!response.ok) {
                //         console.log(response);
                //         console.dir(response);
                //         console.log("error occur");
                //         return
                //     }
                //     else {
                //         const jsonResponse = response.json();
                //         console.log("success");
                //         console.log(response);
                //         console.log(jsonResponse);
                //         console.log(jsonResponse['jwt']); //이게 undefined 
                //         const decodedToken = decodeJWTManually(jsonResponse['jwt']);
                //         console.log(decodedToken);
                //     }
        
                // })  // <- 에러 지점 추정
                // .then(response => {
                //     // console.log(response.json());
                //     // // console.log(data.)
                //     // const decodedToken = decodeJWTManually(response.json()['jwt']);
                //     // console.log(decodedToken);
                // })
                // .catch(error => {
                //     console.error('Error:', error);
                // });
                
                // 백엔드로부터 받은 응답을 json으로 열어보기
                // const result = await response.;
                console.log(response);
        
                // uri 이미 받았음
                // 분기
                // qr uri -> 로컬 스토리지 -> home.js
                // 라우트 호출 -> home.js에서 수행하는데 route라는 함수는 다른 파일에 있음 import해와야함
                // 라우팅 된 페이지의 init에서 로컬스토리지에서 qr uri를 가져오기
                // 그리고 init에서 qr그리는 util 함수를 호출
        
                // if (result && result.otpauthUri) {
                //     generateQRcode(result.otpauthUri);
                //     // generateQRCode(result.otpauthUri);
                //     console.log("hi~");
                // }
        
        
        
                // await fetch("http://52.78.146.67/user-management/token", {
                //     method: "POST",
                //     body: {"code": code}
                // })
                // .then(response => {
                //     console.log(response.json());
                // })
            }
    }
}