export default class {
    constructor(params) {
        this.params = params;
    }
    /**
     * @param {String} title 문서의 제목을 변경한다
     */
    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return '';
    }
}