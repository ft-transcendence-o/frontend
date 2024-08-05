import { navigateTo } from "../../router.js";
import AbstractView from "./AbstractView.js";

// 소독 Sanitize input
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

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
        <div class="PS2P_font nickname-container" style="position: relative; z-index: 4; margin-top: 60px; margin-right: 170px; font-size: 30px;">

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
        <div id="invalid_input" style="z-index: 5; position: absolute; margin-top: 790px; text-align: center"></div>

        <!-- 레디 Button -->
        <button id="ready_button" type="button" style="background-color: black; z-index: 6; margin-top: 80px; width: 232px; height: 110px;" class="blue_outline PS2P_font">
            <span style="font-size: 30px; line-height: 30px;">READY!</span>
            <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
        </button>

    </div>
        
    `;
    }

    async init() {
        const mainButtons = document.querySelectorAll("#main_button a");
        const readyButton = document.querySelector("#ready_button");

        const handleMainButtonClick = (event) => {
            event.preventDefault();
            console.log(event.target.href);
            navigateTo('/main');
        };

        const handleMainMouseEnter = (event) => {
            event.target.classList.remove("blue_outline");
            event.target.classList.add("green_outline");
            event.target.classList.add("white_stroke_2_5px");
        };

        const handleMainMouseLeave = (event) => {
            event.target.classList.add("blue_outline");
            event.target.classList.remove("green_outline");
            event.target.classList.remove("white_stroke_2_5px");
        };

        const handleReadyButtonClick = (event) => {
            event.preventDefault();
            console.log("ready button clicked!");

            const invalidInputElement = document.getElementById("invalid_input");
            invalidInputElement.innerHTML = "";

            const nicknames = [];
            let allFieldsFilled = true;

            document.querySelectorAll(".nickname-input-field").forEach(input => {
                const trimmedValue = sanitizeInput(input.value.trim());
                if (trimmedValue.length === 0) {
                    allFieldsFilled = false;
                    input.focus();
                    return;
                }
                if (trimmedValue && trimmedValue.length <= 10) {
                    nicknames.push(trimmedValue);
                }
            });

            if (!allFieldsFilled) {
                invalidInputElement.innerHTML = sanitizeInput(`<p class="PS2P_font" style="color: red; font-size: 30px; z-index:4">NO EMPTY INPUT FIELD!</p>`);
                return;
            }

            const hasDuplicates = new Set(nicknames).size !== nicknames.length;
            if (hasDuplicates) {
                invalidInputElement.innerHTML = sanitizeInput(`<p class="PS2P_font" style="color: red; font-size: 30px; z-index:4">NICKNAME DUPLICATION NOT ALLOWED!</p>`);
                return;
            }

            let storedNicknames = JSON.parse(localStorage.getItem('nicknames')) || [];

            storedNicknames = [...storedNicknames, ...nicknames].slice(-10);

            localStorage.setItem('nicknames', JSON.stringify(storedNicknames));
            localStorage.setItem('match_count', 1);
            localStorage.setItem('match_mode', 'TOURNAMENT');

            navigateTo('/match_schedules');
        };

        const handleReadyMouseEnter = (event) => {
            event.target.classList.remove("blue_outline");
            event.target.classList.add("green_outline");
            event.target.classList.add("blue_font_white_stroke_3px");
        };

        const handleReadyMouseLeave = (event) => {
            event.target.classList.add("blue_outline");
            event.target.classList.remove("green_outline");
            event.target.classList.remove("blue_font_white_stroke_3px");
        };

        mainButtons.forEach((button) => {
            button.addEventListener("click", handleMainButtonClick);
            button.addEventListener("mouseenter", handleMainMouseEnter);
            button.addEventListener("mouseleave", handleMainMouseLeave);
        });

        readyButton.addEventListener("click", handleReadyButtonClick);
        readyButton.addEventListener("mouseenter", handleReadyMouseEnter);
        readyButton.addEventListener("mouseleave", handleReadyMouseLeave);

        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                const currentInput = document.activeElement;
                if (currentInput.classList.contains("nickname-input-field")) {
                    const inputFields = Array.from(document.querySelectorAll(".nickname-input-field"));
                    const currentIndex = inputFields.indexOf(currentInput);
                    const nextInput = inputFields[currentIndex + 1];
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        const allFieldsFilled = inputFields.every(input => input.value.trim() !== "");
                        if (allFieldsFilled) {
                            readyButton.click();
                        } else {
                            event.preventDefault();
                        }
                    }
                }
            } else if (event.key === "Escape") {
                event.preventDefault();
                navigateTo('/main');
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        requestAnimationFrame(() => {
            const inputFields = document.querySelectorAll(".nickname-input-field");
            inputFields[0].focus();
        });

        this.cleanup = () => {
            mainButtons.forEach((button) => {
                button.removeEventListener("click", handleMainButtonClick);
                button.removeEventListener("mouseenter", handleMainMouseEnter);
                button.removeEventListener("mouseleave", handleMainMouseLeave);
            });
            readyButton.removeEventListener("click", handleReadyButtonClick);
            readyButton.removeEventListener("mouseenter", handleReadyMouseEnter);
            readyButton.removeEventListener("mouseleave", handleReadyMouseLeave);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }

    destroy() {
        if (this.cleanup) {
            this.cleanup();
        }
    }
}
