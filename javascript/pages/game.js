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

				<!-- backgound outline -->
				<div class="blue_outline" style="background-color: black; position: absolute; width: 1408px; height: 992px; top: 16px; left: 16px; z-index: 1;"></div>
			
			
			</div>
		</div>
    `;
    }

    async init() {
		// 
    }
}