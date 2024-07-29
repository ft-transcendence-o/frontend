import AbstractView from "./AbstractView.js";
import { navigateTo } from "../../router.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Main");
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
			<div id="top_item" class="PS2P_font" style="position: relative; z-index: 2; margin-top: 50px; font-size: 30px; margin-top: 50px;">

				<!-- Intra ID -->
				<span id="user_name" class="PS2P_font" style="position: absolute; z-index: 3; font-size: 30px; margin-top: 4px; margin-left: 70px;">INTRA_ID</span>
				
				<!-- nav menu buttons -->
				<ul class="nav justify-content-end">
					<li>
						<a class="btn btn-primary" href="/match_record">>MATCH-RECORD</a>
					</li>
					<li style="margin-left: 20px;">
						<a class="btn btn-primary" href="/LANGUAGE">>LANGUAGE</a>
					</li>
					<li style="margin-left: 20px; margin-right: 40px;">
						<a class="btn btn-primary" href="/LOGOUT">>LOGOUT</a>
					</li>
				</ul>

			</div>

			<!-- game mode button -->
			<div id="game_mode_button" class="col-12" style="display: flex; justify-content: center; padding-top: 200px;">

				<!-- 1 ON 1 Button -->
				<!-- data- 접두사를 통해 Custom Attribute 사용 -->
				<button class="PS2P_font blue_outline" data-href="/1ON1" style="background-color: black; position: relative; z-index: 2; font-size: 30px; width: 369px; height: 393px;">

					<!-- PacMans && VS text -->
					<div style="padding-top: 80px; padding-bottom: 110px;">
						<img src="./image/pacman.png" alt="" style="transform: scaleX(-1); width: 100px; height: 107.18px;">
						<span style="color: white; text-shadow: none;">VS</span>
						<img src="./image/pacman.png" alt="" style="width: 100px; height: 107.18px;">
					</div>

					<!-- 1 ON 1 text -->
					<div style="padding-top: 10px; padding-bottom: 10px;">
						1 ON 1
					</div>

				</button>

				<!-- TOURNAMENT Button -->
				<button class="PS2P_font blue_outline" data-href="/TOURNAMENT" style="background-color: black; position: relative; z-index: 2; font-size: 30px; width: 369px; height: 393px; margin-left: 120px;">

					<!-- ghost -->
					<div style="padding-top: 35px; padding-bottom: 30px;">
						<!-- first row ghosts -->
						<div style="padding-bottom: 30px;">
							<img src="./image/ghost_red.png" alt="" style="width: 100px; height: 97.8px;">
							<img src="./image/ghost_blue.png" alt="" style="width: 100px; height: 97.8px; margin-left: 12px;">
						</div>

						<!-- second row ghosts -->
						<div>
							<img src="./image/ghost_orange.png" alt="" style="width: 100px; height: 97.8px;">
							<img src="./image/ghost_pink.png" alt="" style="width: 100px; height: 97.8px; margin-left: 12px;">
						</div>
					</div>

					<!-- TOURNAMENT -->
					<div style="padding-top: 20px; padding-bottom: 20px;">
						TOURNAMENT
					</div>
				</button>
			</div>

			<!-- text -->
			<div class="col-12" style="display: flex; justify-content: center; position: relative; z-index: 2; padding-top: 100px;">
				<p class="PS2P_font" style="font-size: 30px;">SELECT GAME MODE</p>
			</div>
		</div>
    </div>
    `;
    }

    async init() {
        // 클릭 가능한 요소들에 이벤트 리스너를 등록한다
		// button tag 들은 dataset 를 통해 Custom Attribute 를 받아온다
		const Mode_Buttons = document.querySelector("#game_mode_button").querySelectorAll("button");

		Mode_Buttons.forEach((Button) => {

			Button.addEventListener("click", (event) => {
				event.preventDefault();
				console.log(Button.dataset.href);
				// 라우팅 이벤트 추가
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

		const Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");

		Top_Buttons.forEach((Button) => {

			Button.addEventListener("click", (event) => {
				event.preventDefault();
				console.log(event.target.href);

				// 라우팅 이벤트 추가
				if (event.target.href == "http://127.0.0.1:5500/match_record") {
					localStorage.setItem("record_page", 1);
					navigateTo("/match_record");
				}
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

		// backend api를 통해 유저의 이름을 받아와서 요소에 집어넣는다
		const User_Name_Holder = document.querySelector("#top_item").querySelector("#user_name");

        const response = await fetch("http://10.19.218.225:8000/user-management/info", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log("success");
            console.log(response);
            console.log(jsonResponse);
            console.log(jsonResponse['login']); //await으로 해결
            User_Name_Holder.innerHTML = jsonResponse['login'];
        } else {
            const jsonResponse = await response.json();
            console.log("Fail");
            console.log(response);
            console.log(jsonResponse);
        }

    }
}