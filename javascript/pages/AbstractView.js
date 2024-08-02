export default class {
    constructor(params) {
        this.params = params;
        this.cleanup = null;    // 이벤트 리스너 모둠 변수 선언, 각 페이지에서 등록한 이벤트 리스너를 모아 담는 전역변수
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

    destroy() {    // 변수 cleanup에 각 페이지에서 등록한 이벤트 리스너 모둠을 제거
        if (this.cleanup) {
            this.cleanup();
        }
    }
}