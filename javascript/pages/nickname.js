import { navigateTo, baseUrl } from "../../router.js";
import AbstractView from "./AbstractView.js";
import { get_translated_value } from "../../language.js"

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
            <div id="main_button" class="PS2P_font" style="position: absolute; top: 50px; right: 50px; font-size: 30px; z-index: 2">
                
                <!-- nav menu buttons -->
                    <ul class="nav justify-content-end">
                        <li style="margin-right: 0px;">
                            <a class="btn btn-primary transItem" href="/main" data-trans_id="main_button">>MAIN
                                <p style="font-size: 20px; margin-top: -12px;">(ESC)</p>
                            </a>
                        </li>
                    </ul>
            </div>
        </div>

        <!-- 상단 안내문 -->
        <div class="PS2P_font transItem" style="position: relative; z-index: 3; margin-top: 136px; font-size: 30px; color: white; text-align: center;" data-trans_id="nickname_text">
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
            <div class="nickname-input d-flex	align-items-center">
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

        try {
            const response = await fetch(baseUrl + "/api/user-management/auth-status", {
                method: "GET",
                credentials: 'include',
            });
            if (response.ok) {  // status === 200이고 이곳에서 response.json()을 까보고 분기
                console.log("api confirm");
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                if (!(jsonResponse.otp_authenticated)) {
                    navigateTo('/');
                    return;
                }
            } else if (response.status === 401) {
                console.log("response is 401!");
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                navigateTo('/');
                return;
            } else {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                console.log("error");
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }

        // translate 적용 테스트
        const transItems = document.querySelectorAll(".transItem");
        transItems.forEach( (transItem) => {
            transItem.innerHTML = get_translated_value(transItem.dataset.trans_id);
        })

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

        const handleReadyButtonClick = async (event) => {
            event.preventDefault();
            console.log("ready button clicked!");

            const invalidInputElement = document.getElementById("invalid_input");
            invalidInputElement.innerHTML = "";

            const nicknames = [];
            let allFieldsFilled = true;

            document.querySelectorAll(".nickname-input-field").forEach(input => {
                const trimmedValue = sanitizeInput(input.value.trim()); // 입력값 소독
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
                invalidInputElement.innerHTML = `<p class="PS2P_font" style="color: red; font-size: 30px; z-index:4">NO EMPTY INPUT FIELD!</p>`;
                return;
            }

            const hasDuplicates = new Set(nicknames).size !== nicknames.length;
            if (hasDuplicates) {
                invalidInputElement.innerHTML = `<p class="PS2P_font" style="color: red; font-size: 30px; z-index:4">NICKNAME DUPLICATION NOT ALLOWED!</p>`;
                return;
            }

            try {
                const response = await fetch(baseUrl + "/api/game-management/session", {
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify({ players_name: nicknames })
                });

                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log(jsonResponse.message);
                    navigateTo('/match_schedules');
                } else {
                    console.error("Failed to set nicknames. Response status:", response.status);
                    invalidInputElement.innerHTML = `<p class="PS2P_font" style="color: red; font-size: 30px; z-index:4">FAILED TO SET NICKNAMES!</p>`;
                }
            } catch (error) {
                console.error("Error sending nicknames:", error);
                invalidInputElement.innerHTML = `<p class="PS2P_font" style="color: red; font-size: 30px; z-index:4">ERROR OCCURRED WHILE SENDING NICKNAMES!</p>`;
            }
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

        // chrome에서 한글입력 시 씹히거나 입력필드 두 칸씩 넘어가는 등 문제 해결법
        let isComposing = false;

        const handleCompositionStart = () => {
            isComposing = true;
        }

        const handleCompositionEnd = () => {
            isComposing = false;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Enter" && !isComposing) {
                const inputFields = Array.from(document.querySelectorAll(".nickname-input-field"));
                const currentInput = document.activeElement;

                if (currentInput.classList.contains("nickname-input-field")) {
                    const currentIndex = inputFields.indexOf(currentInput);
                    const nextInput = inputFields[currentIndex + 1];

                    if (nextInput) {
                        nextInput.focus();
                        console.log("goes next input filed!");
                    } else {
                        console.log("focus ready button!");
                        readyButton.focus();
                    }
                } else if (currentInput === readyButton) {
                    const allFieldsFilled = inputFields.every(input => input.value.trim() !== "");
                    if (allFieldsFilled) {
                        readyButton.click();
                    } else {
                        inputFields.find(input => input.value.trim() === "").focus();
                    }
                }
            } else if (event.key === "Escape") {
                event.preventDefault();
                navigateTo('/main');
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        document.querySelectorAll(".nickname-input-field").forEach((input) => {
            input.addEventListener("compositionstart", handleCompositionStart);
            input.addEventListener("compositionend", handleCompositionEnd);
        });

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
            document.querySelectorAll(".nickname-input-field").forEach((input) => {
                input.removeEventListener("compositionstart", handleCompositionStart);
                input.removeEventListener("compositionend", handleCompositionEnd);
            });
        };
    }

    destroy() {
        if (this.cleanup) {
            this.cleanup();
        }
    }
}
