import AbstractView from "./AbstractView.js";
import { navigateTo } from "../../router.js";

function decodeJWTManually(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
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
		    <div style="background-color: black; position: absolute; width: 1440px; height: 1024px;">
                <!-- blue outline background -->
                <div class="row justify-content-center blue_outline" style="background-color: black; position: absolute; width: 1408px; height: 992px; top: 0px; z-index: 1;">

                    <!-- title -->
                    <div style="position:absolute; margin-top: 170px; z-index: 1;" class="row justify-content-center">
                        <!-- 바깥쪽 보라색 박스 -->
                        <div class="col-12 d-flex justify-content-center" style=" width: 1300px; height: 281px; border: solid; border-color: #A259FF; padding: 6px 5px; border-width: 5px;">
                            <!-- 안쪽 노란색 박스 -->
                            <div style="width: 1230px; height: 203px; text-align: center; text-align-last: center; padding: 36px 30px; border: solid; border-color: #FED940; border-width: 3px; font-size: 150px; line-height: 200px; margin-bottom: 0px;" class="display-1 PacPong_font">
                                <span style="color:#14FF00">Pa</span><span style="color:#FED940">c</span>
                                <span style="color:#14FF00">Pon</span><span style="color:#FED940">g</span>
                            </div>
                        </div>
                    </div>

                    <!-- ghost -->
                    <div class="row justify-content-center" style="position:absolute; margin-top: 534px; z-index: 2;">
                        <!-- <div class="col-12" style=";"> -->
                        <div class="col-12 d-flex justify-content-center">
                            <img style="padding-left: 20px; width: 100px; height: auto; padding-right: 20px;" src="./image/ghost_red.gif" alt="Red Ghost">
                            <img style="padding-left: 20px; width: 100px; height: auto; padding-right: 20px;" src="./image/ghost_blue.gif" alt="Blue Ghost">
                            <img style="padding-left: 20px; width: 100px; height: auto; padding-right: 20px;" src="./image/ghost_orange.gif" alt="Orange Ghost">
                            <img style="padding-left: 20px; width: 100px; height: auto; padding-right: 20px;" src="./image/ghost_pink.gif" alt="Pink Ghost">
                        </div>
                    </div>
                    <!-- log in -->
                    <div style="position:absolute; padding-top: 708px; z-index: 3;" class="row justify-content-center">
                        <div class="col-12 d-flex justify-content-center login" style="cursor: pointer;">
                            <!-- <button style="background-color: rgba(0, 0, 0, 0); border: 0;"> -->
                            <img src="../image/pacman_right.gif" style="width: 100px; height: 107.18px; padding-right: 23px;" alt="pacman">
                            <span style="font-family: Arial, Helvetica, sans-serif; font-size: 70px; vertical-align: middle;" class="PS2P_font">►</span>
                            <span style="padding-right: 160px; font-size: 70px; vertical-align: middle;" class="PS2P_font">LOG-IN</span>
                        <!-- </button> -->
                        </div>
                    </div>

                    <!-- spinner -->
                    <div id="spinner" class="spinner-container" style="display: none;">
                        <img src="../image/pacman_right.gif" alt="Loading..." class="custom-spinner" />
                        <div class="spinner-message PS2P_font">Loading...</div>
                    </div>
                    

                    <!-- footer -->
                    <div class="row justify-content-center" style="position:absolute; padding-top:890px; z-index: 2;">
                        <div class="col-12 d-flex justify-content-center">
                            <p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 44px; font-size: 30px;">© 2024 42SEOUL MFG. CO.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

	<!-- QR Code -->
	<div id="qrcode"></div>
    `;
    }

    async init() {
        //  쿠키에 `jwt` 즉, 토큰 유효성 확인. 유효성 확인은 home이 아니라 main 페이지에서 Intra_id를 받는 과정에서 쏘는 API에서 하므로 아래 코드 정도만 필요하고 api를 쏘는 행위는 하지 않아도 될 것 같다. (토큰은 현재 OTP페이지에서 로그인 완료 시 쿠키에 담고 있다)
        const cookie_jwt = getCookie('jwt');
        if (getCookie('jwt')) { //
            console.log(cookie_jwt);
            console.log("COOKIE CONFIRM");
            navigateTo('/main');
            return;
        }

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
                const spinner = document.getElementById("spinner");
                spinner.style.display = "flex"; // 뺑글이 범위 시작
                // 여기서 백엔드로 코드를 보내 액세스 토큰을 얻는 로직을 구현할 수 있습니다.
                // authorization code를 백엔드에 전송하고 백엔드로부터 응답 받기
                try {
                    const response = await fetch("http://localhost:8000/user-management/token", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({"code": code})
                    });
                    if (response.ok) {
                        const jsonResponse = await response.json();
                        console.log("success");
                        console.log(response);
                        console.log(jsonResponse);
                        console.log(jsonResponse['jwt']); //await으로 해결
    
                        localStorage.setItem('jwt', jsonResponse['jwt']);
                        console.log("JWT saved to local storage");
    
                        if (jsonResponse['show_otp_qr'] === false) {
                            navigateTo('/QRcode');
                        } else if (jsonResponse['otp_verified'] === false) {
                            navigateTo('/OTP');
                        } else {
                            navigateTo('/main');
                        }
                    } else {
                        console.log("error");
                    }
                } catch (error) {
                    console.log("Fetch error:", error);
                } finally {
                    spinner.style.display = "none"; // 뺑글이 범위 끝
                }
            }
    }
}
