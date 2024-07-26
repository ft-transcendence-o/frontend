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
    <div class="container-fluid d-flex flex-column align-items-center">
		<div style="background-color: black; position: absolute; width: 1440px; height: 1024px;">

			<!-- backgound outline -->
			<div class="blue_outline" style="background-color: black; position: absolute; width: 1408px; height: 992px; top: 16px; left: 16px; z-index: 1;"></div>
			
			<!-- top item -->
			<div id="main_button" class="PS2P_font" style="position: relative; z-index: 2; margin-top: 50px; font-size: 30px; margin-top: 50px;">
				
				<!-- >MAIN 버튼 -->
				<ul class="nav justify-content-end">
					<li style="margin-left: 20px; margin-right: 40px;">
						<a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#logoutModal">>MAIN</a>
					</li>
				</ul>
			</div>
        </div>

        <!-- 닉네임 input fields -->
        <div class="nickname-container" style="position: relative; z-index: 3; margin-top: 150px; font-size: 30px;">
            <div class="nickname-input d-flex align-items-center mb-3">
                <img src="./image/ghost_blue.gif" alt="1UP" class="me-3">
                <input type="text" value="Nickname1" class="form-control" style="width: 300px; height: 40px; border: 3px solid green; color: white; background-color: black; padding-left: 10px; font-size: 24px;">
            </div>
            <div class="nickname-input d-flex align-items-center mb-3">
                <img src="./image/ghost_red.gif" alt="2UP" class="me-3">
                <input type="text" value="Nickname2" class="form-control" style="width: 300px; height: 40px; border: 3px solid green; color: white; background-color: black; padding-left: 10px; font-size: 24px;">
            </div>
            <div class="nickname-input d-flex align-items-center mb-3">
                <img src="./image/ghost_pink.gif" alt="3UP" class="me-3">
                <input type="text" value="Nickname3" class="form-control" style="width: 300px; height: 40px; border: 3px solid green; color: white; background-color: black; padding-left: 10px; font-size: 24px;">
            </div>
            <div class="nickname-input d-flex align-items-center mb-3">
                <img src="./image/ghost_orange.gif" alt="4UP" class="me-3">
                <input type="text" value="Nickname4" class="form-control" style="width: 300px; height: 40px; border: 3px solid green; color: white; background-color: black; padding-left: 10px; font-size: 24px;">
            </div>
        </div>

        <!-- 레디 Button -->
        <button type="button" id="ready_button" style="background-color: black; z-index: 4; margin-top: 0px; width: 232px; height: 131px;" class="blue_outline PS2P_font">
            <span style="font-size: 30px;">READY!</span>
            <br>
            <span style="font-size: 20px;">(ENTER)</span>
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