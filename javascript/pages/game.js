import AbstractView from "./AbstractView.js";
import { navigateTo, baseUrl } from "../../router.js";
import { PongGame } from "../../game/pacman.js";
import { get_translated_value } from "../../language.js"

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("game");
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
		new PongGame();

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