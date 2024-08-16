import AbstractView from "./AbstractView.js";
import { navigateTo, baseUrl } from "../../router.js";
import { get_translated_value } from "../../language.js"

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
        <!-- background -->
	
        <div class="container d-flex flex-column align-items-center">
                
            <!-- blue outline background -->
            <div class="row justify-content-center blue_outline" style="background-color: black; margin-top: 20px; position: absolute; width: 1408px; height: 992px; top: 0px; z-index: 1;">

                <!-- dot array top-->
                <image class="dot_array_up" src="./image/dot_array.png" style="position: absolute; top: 15px; width: 1354px; height: 20px; z-index: 4" alt="dot_array">
                
                <!-- dot array bottom-->
                <image class="dot_array_up" src="./image/dot_array.png" style="position: absolute; bottom: 15px; width: 1354px; height: 20px; z-index: 4" alt="dot_array">

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
                        <span style="padding-right: 160px; font-size: 70px; vertical-align: middle;" class="PS2P_font transItem" data-trans_id="home_login">LOG-IN</span>
                    <!-- </button> -->
                    </div>
                </div>

                <!-- spinner -->
                <div id="spinner" class="spinner-container" style="display: none;">
                    <img src="../image/pacman_right.gif" alt="Loading..." class="custom-spinner" />
                    <div class="spinner-message PS2P_font">LOADING...</div>
                </div>
                    

                <!-- footer -->
                <div class="row justify-content-center" style="position:absolute; padding-top:890px; z-index: 2;">
                    <div class="col-12 d-flex justify-content-center">
                        <p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 44px; font-size: 30px;">© 2024 42SEOUL MFG. CO.</p>
                    </div>
                </div>

            </div>
        </div>

	<!-- QR Code -->
	<div id="qrcode"></div>
    `;
    }

    async init() {
        const localeCheck = localStorage.getItem("locale");
        if (!localeCheck)
        {
            localStorage.setItem("locale", "en");
        }

        try {
            const response = await fetch(baseUrl + "/api/user-management/auth-status", {
                method: "GET",
                credentials: 'include',
            });
            if (response.ok) {  // status === 200이고 이곳에서 response.json()을 까보고 분기
                const jsonResponse = await response.json();
                if (jsonResponse.otp_authenticated)
                {
                    navigateTo('/main');
                    return;
                }
            } else if (response.status === 401) { // 401)(unauthorized)클라이언트가 인증되지 않았거나, 유효한 인증 정보가 부족하여 요청이 거부되었음을 의미하는 상태값 -> token이 없는사람 (사용자가 로그아웃을 한 경우 백엔드에서는 cookie를 삭제한다. 따라서 api를 쏘면 백엔드는 해당 사용자에 대한 인증 정보가 부족하다며 거부하는 의미로 status를 401로 응답한다.)
                const jsonResponse = await response.json();
            } else {
                const jsonResponse = await response.json();
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }

        // translate 적용 테스트
        const transItems = document.querySelectorAll(".transItem");
        transItems.forEach( (transItem) => {
            transItem.innerHTML = get_translated_value(transItem.dataset.trans_id);
        } )
        // 페이지 로드 할 때는 spinner 돌지 않도록 하기
        const spinner = document.getElementById("spinner");
        spinner.style.display = "none";

        // Hide spinner before page unload
        window.addEventListener("pageshow", () => {
            spinner.style.display = "none";
        });

        function login_click(event) {
            event.preventDefault();
            spinner.style.display = "flex"; // 뺑글이 시작
            window.location.href = `${baseUrl}/api/user-management/login`;
        }
            
        const login_button = document.querySelector(".login");
        const login_arrow = login_button.querySelector("span");
        const login_text = login_button.querySelector("span:last-child");

        login_button.addEventListener("click", login_click);
        
        login_button.addEventListener("mouseenter", (event) => {
            login_text.classList.add("green_hover");
            login_text.classList.add("white_stroke_5px");
            login_arrow.classList.add("red_hover");
        });
        login_button.addEventListener("mouseleave", (event) => {
            login_text.classList.remove("green_hover");
            login_text.classList.remove("white_stroke_5px");
            login_arrow.classList.remove("red_hover");
        });

        // URL에서 코드 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            // spinner.style.display = "flex"; 
            // 여기서 백엔드로 코드를 보내 액세스 토큰을 얻는 로직을 구현할 수 있습니다.
            // authorization code를 백엔드에 전송하고 백엔드로부터 응답 받기
            try {
                const response = await fetch(baseUrl + "/api/user-management/token", {
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify({"code": code})
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    if (jsonResponse['show_otp_qr'] === false) {
                        navigateTo('/QRcode');
                    } else if (jsonResponse['otp_verified'] === false) {
                        navigateTo('/OTP');
                    } else {
                        navigateTo('/main');
                    }
                } else {
                    console.log(response.json());
                }
            } catch (error) {
                console.log("Fetch error:", error);
            } finally {
                spinner.style.display = "none"; // 뺑글이 범위 끝
            }
        }
    }
}