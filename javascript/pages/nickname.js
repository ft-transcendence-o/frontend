import { navigateTo } from "../../router.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Example1");
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
        <div class="PS2P_font nickname-container" style="position: relative; z-index: 4; margin-top: 99px; margin-right: 170px; font-size: 30px;">
            <div class="nickname-input d-flex align-items-center mb-3">
                <span style="color: white; margin-right: 58px;">1UP</span>
                <img src="./image/ghost_blue.gif" style="width: 100px; height: auto; margin-right:32px;" alt="1UP">
                <input type="text" class="PS2P_font" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>
            <div class="nickname-input d-flex align-items-center mb-3">
                <span style="color: white; margin-right: 58px;">2UP</span>
                <img src="./image/ghost_red.gif" style="width: 100px; height: auto; margin-right: 32px;" alt="2UP">
                <input type="text" class="PS2P_font" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>
            <div class="nickname-input d-flex align-items-center mb-3">
                <span style="color: white; margin-right: 58px;">3UP</span>
                <img src="./image/ghost_pink.gif" style="width: 100px; height: auto; margin-right:32px;" alt="3UP">
                <input type="text" class="PS2P_font" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>
            <div class="nickname-input d-flex align-items-center">
                <span style="color: white; margin-right: 58px;">4UP</span>
                <img src="./image/ghost_orange.gif" style="width: 100px; height: auto; margin-right:32px;" alt="4UP">
                <input type="text" class="PS2P_font" style="width:600px; height:100px; border: solid; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 30px; outline: none; padding-left: 20px;" />
            </div>
        </div>

        <!-- 레디 Button -->
        <button type="button" style="background-color: black; z-index: 5; margin-top: 34px; width: 232px; height: 131px;" class="blue_outline PS2P_font">
            <span style="font-size: 30px; line-height: 30px;">READY!</span>
            <span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
        </button>

    </div>
        
    `;
    }

    async init() {

        /* MAIN 버튼 */
		const Main_Button = document.querySelector("#main_button").querySelectorAll("a");

		Main_Button.forEach((Button) => {

			Button.addEventListener("click", (event) => {
				event.preventDefault();
				console.log(event.target.href);
                navigateTo('/main');
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

        /* READY 버튼 */
        const Ready_Button = document.querySelector("#ready_button").querySelector("a");

        Ready_Button.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(event.target.href);
                // navigateTo('/tournament');
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


        })

    }
}