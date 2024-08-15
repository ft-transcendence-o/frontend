import AbstractView from "./AbstractView.js";
import { navigateTo, baseUrl } from "../../router.js";
import { PongGame } from "../../game/pacman.js";
import { get_translated_value } from "../../language.js"

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("tournament_game");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `<div style="position: relative;">
		<!-- top item -->
		<div id="top_item" class="PS2P_font" style="position: relative; z-index: 2; margin-top: 50px; font-size: 30px; line-height: 30px; margin-top: 50px; height: 40px;">
			<!-- nav menu buttons -->
			<ul class="nav justify-content-end">
				<li style="margin-right: 40px;">
					<a class="btn btn-primary transItem" href="/main" data-trans_id="main_button">>MAIN
						<p style="font-size: 20px;">(ESC)</p>
					</a>
				</li>
			</ul>
		</div>
		<!-- backgound outline -->
		<div id="game_var" class="blue_outline" style="
		background-color: black; 
		width: 1408px; height: 160px; 
		top: 16px; left: 16px;
		margin: 16px; margin-top: 58px;">
			<div class="container PS2P_font" style="width: 1408px; padding-top: 16px;">
				<div class="row">
					<div class="col-6" style="padding: 0px; text-align: center; font-size: 30px;">
						<div id="player1_nick" style="margin-bottom: 10px;">
							player1
						</div>
						<div id="player1_score">
							0
						</div>
					</div>
					
					<div class="col-6" style="padding: 0px; text-align: center; font-size: 30px;">
						<div id="player2_nick" style="margin-bottom: 10px;">
							player2
						</div>
						<div id="player2_score">
							0
						</div>
					</div>
				</div>
				
			</div>
		</div> <!-- game var -->
		<!-- game canvas -->
		<div id="game_canvas" style="display: inline-block;">
			<canvas id="canvas1" style="border-right: dashed; border-color: yellow; border-right-width: 11px;"></canvas>
			<canvas id="canvas2"></canvas>
		</div>
		<!-- after game -->
		<!-- 1p winner_Button -->
		<div id="winner1" class="winning PS2P_font" style="position: absolute; z-index: 2; left: 180px; top: 500px;">
		</div> <!-- 1p winning -->
		<!-- 2p winner Button -->
		<div id="winner2" class="winning PS2P_font" style="position: absolute; z-index: 2; left: 908px; top: 500px;">
		</div> <!-- 2p winning -->
		<div class="PS2P_font" style="position: absolute; left: 475px; text-align: center; width: 500px; text-shadow:
		-4px -4px 0 #000000,  
		4px -4px 0 #000000,
		-4px 4px 0 #000000,
		4px 4px 0 #000000;" id="countDown"></div>
	</div> <!-- position지정용 -->
    `;
    }

    async init() {
		// game session data
		try {
			const fetch_url = baseUrl + `/api/game-management/session?mode=tournament`;
			const response = await fetch(fetch_url, {
				method: "GET",
				credentials: 'include',
			});
			if (response.ok) {
				const sessionData = await response.json()
				if (sessionData.players_name[2] === sessionData.players_name[3]){
					navigateTo("main");
				}
				else {
					new PongGame(sessionData, "normal/");
				}
			} else if (response.status === 401) { // 401)(unauthorized)클라이언트가 인증되지 않았거나, 유효한 인증 정보가 부족하여 요청이 거부되었음을 의미하는 상태값 -> token이 없는사람 (사용자가 로그아웃을 한 경우 백엔드에서는 cookie를 삭제한다. 따라서 api를 쏘면 백엔드는 해당 사용자에 대한 인증 정보가 부족하다며 거부하는 의미로 status를 401로 응답한다.)
				navigateTo("/");
            } else if (response.status === 403) { // otp 통과 안했을 경우
				navigateTo("otp");
			} else {
				navigateTo("/");
			}
		} catch (error) {
			console.log("Fetch error:", error);
		}

		// translate 적용 테스트
        const transItems = document.querySelectorAll(".transItem");
        transItems.forEach( (transItem) => {
            transItem.innerHTML = get_translated_value(transItem.dataset.trans_id);
        } )

		// 클릭 가능한 요소들에 이벤트 리스너를 등록한다
        const Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");

        Top_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(event.currentTarget.href);

                // 라우팅 이벤트 추가
                // 비동기 이슈?
                const url = new URL(event.currentTarget.href);
                const pathname = url.pathname;

                navigateTo(pathname);
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
    }
}