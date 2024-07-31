import { navigateTo } from "../../router.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Nickname");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `
    <div class="container-fluid d-flex flex-column align-items-center" style="width: 1440px; height: 1024px; padding: 0;">
        <div style="background-color: black; position: absolute; width: 1440px; height: 1024px;">

            <!-- backgound outline -->
            <div class="blue_outline" style="background-color: black; position: absolute; width: 1405px; height: 984px; top: 20px; z-index: 1;"></div>
            
            <!-- top item -->
            <div id="main_button" class="PS2P_font" style="position: absolute; top: 63px; right: 50px; font-size: 30px; z-index: 2">
                
                <!-- >MAIN(ESC) 버튼 -->
                <ul class="nav justify-content-end" style="margin: 0; padding: 0;">
                    <li style="margin: 0; padding: 0;">
                        <a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#logoutModal" style="margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center;">
                            <span style="font-size: 30px; line-height: 30px;">>MAIN</span>
                            <span style="font-size: 20px; line-height: 20px;">(ESC)</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 상단 안내문 -->
        <div class="PS2P_font" style="position: relative; z-index: 3; margin-top: 136px; font-size: 30px; color: white; text-align: center;">
            ENTER A NICKNAME FOR EACH PLAYER
        </div>

        <!-- 닉네임 input fields -->
        <div class="PS2P_font nickname-container" style="position: relative; z-index: 4; margin-top: 70px; margin-right: 170px; font-size: 30px;">

            <div class="nickname-input d-flex align-items-center mb-3">
                <span style="color: white; margin-right: 58px;">1UP</span>
                <img src="./image/ghost_blue.gif" style="width: 100px; height: auto; margin-right:32px;" alt="1UP">
                <input type="text" class="PS2P_font nickname-input-field" maxlength="10" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>
            <div class="nickname-input d-flex align-items-center mb-3">
                <span style="color: white; margin-right: 58px;">2UP</span>
                <img src="./image/ghost_red.gif" style="width: 100px; height: auto; margin-right: 32px;" alt="2UP">
                <input type="text" class="PS2P_font nickname-input-field" maxlength="10" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>
            <div class="nickname-input d-flex align-items-center mb-3">
                <span style="color: white; margin-right: 58px;">3UP</span>
                <img src="./image/ghost_pink.gif" style="width: 100px; height: auto; margin-right:32px;" alt="3UP">
                <input type="text" class="PS2P_font nickname-input-field" maxlength="10" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>
            <div class="nickname-input d-flex align-items-center">
                <span style="color: white; margin-right: 58px;">4UP</span>
                <img src="./image/ghost_orange.gif" style="width: 100px; height: auto; margin-right:32px;" alt="4UP">
                <input type="text" class="PS2P_font nickname-input-field" maxlength="10" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>

        </div>

        <!-- invalid input -->
        <div id="invalid_input" style="z-index: 5; padding-top: 20px; text-align: center"></div>

        <!-- 레디 Button -->
        <button id="ready_button" type="button" style="background-color: black; z-index: 6; margin-top: 34px; width: 232px; height: 131px;" class="blue_outline PS2P_font">
            <span style="font-size: 30px; line-height: 30px;">READY!</span>
            <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
        </button>

    </div>
        
    `;
    }

    async init() {

        const mainButtons = document.querySelectorAll("#main_button a");

        mainButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(event.target.href);
                navigateTo('/main');
            });

            button.addEventListener("mouseenter", () => {
                button.classList.remove("blue_outline");
                button.classList.add("green_outline");
                button.classList.add("white_stroke_2_5px");
            });

            button.addEventListener("mouseleave", () => {
                button.classList.add("blue_outline");
                button.classList.remove("green_outline");
                button.classList.remove("white_stroke_2_5px");
            });
        });

        localStorage.removeItem('nicknames');

        /* READY 버튼 */
        const readyButton = document.querySelector("#ready_button");

        readyButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("ready button clicked!");

            const invalidInputElement = document.getElementById("invalid_input");
            invalidInputElement.innerHTML = "";

            // input filed에 입력된 닉네임을 변수 nicknames에 주워 담기
            const nicknames = [];
            let allFlieldsFilled = true;

            document.querySelectorAll(".nickname-input-field").forEach(input => {
                const trimmedValue = input.value.trim();
                if (trimmedValue.length === 0) {
                    allFlieldsFilled = false;
                    input.focus();
                    return;
                }
                if (trimmedValue && trimmedValue.length <= 10) {
                    nicknames.push(trimmedValue);
                }
            });

            if (!allFlieldsFilled) {
                invalidInputElement.innerHTML = `<p class="PS2P_font" style="color: red; font-size: 20px; z-index:4">NO EMPTY INPUT FIELD!</p>`;
                return;
            }

            // 중복 확인
            const hasDuplicates = new Set(nicknames).size !== nicknames.length;
            if (hasDuplicates) {
                invalid_input.innerHTML = `<p class="PS2P_font" style="color: red; font-size: 20px; z-index:4">NICKNAME DUPLICAION NOT ALLOWED!</p>`;
                return;
            }

            // 변수 storedNicknames를 선언하면서 localStorage에 저장
            let storedNicknames = [];

            // Add new nicknames and ensure no more than 10 entries
            storedNicknames = [...storedNicknames, ...nicknames].slice(-10);

            // 닉네임을 local storage에 저장
            localStorage.setItem('nicknames', JSON.stringify(storedNicknames));

            navigateTo('/');
        });

        readyButton.addEventListener("mouseenter", () => {
            readyButton.classList.remove("blue_outline");
            readyButton.classList.add("green_outline");
            readyButton.classList.add("blue_font_white_stroke_3px");
        });

        readyButton.addEventListener("focus", () => {
            readyButton.classList.remove("blue_outline");
            readyButton.classList.add("green_outline");
            readyButton.classList.add("blue_font_white_stroke_3px");
        });

        readyButton.addEventListener("mouseleave", () => {
            readyButton.classList.add("blue_outline");
            readyButton.classList.remove("green_outline");
            readyButton.classList.remove("blue_font_white_stroke_3px");
        });

        // input fileds 엔터키로 다음 입력필드 이동 이벤트
        const inputFields = document.querySelectorAll(".nickname-input-field");
        inputFields.forEach((input, index) => {
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    const nextInput = inputFields[index + 1];
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        // 마지막 입력필드에서 엔터 누르면 레디 버튼에 focus 활성
                        readyButton.focus();
                    }
                }
            });
        });
    }
}
