import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `<h1>Home Page</h1><p>Welcome to the Home Page!</p>`;
    }

    async init() {
        document.addEventListener("click", () => {
            console.log("home");
        })
    }
}