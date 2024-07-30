import AbstractView from "./AbstractView.js";
import { navigateTo } from "../../router.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Game");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `
		<div class="container-fluid d-flex flex-column align-items-center">
			<div style="background-color: black; position: absolute; width: 1440px; height: 1024px;">
				<!-- top item -->
				<div id="top_item" class="PS2P_font" style="position: relative; z-index: 2; margin-top: 50px; font-size: 30px; margin-top: 50px;">
				
				</div>
				<!-- backgound outline -->
				<div class="blue_outline" style="
				background-color: black; 
				width: 1408px; height: 222px; 
				top: 16px; left: 16px;
				margin: 16px;">
				<!-- 유저 닉네임 추가 -->
				</div>
				<div id="game_canvas" style="display: inline-block;">
					<canvas id="canvas1" style="border-right: dashed; border-color: yellow; border-right-width: 11px;"></canvas>
					<canvas id="canvas2"></canvas>
				</div>
			</div>
		</div>
    `;
    }

    async init() {
		// 
    }
}