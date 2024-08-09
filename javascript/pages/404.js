export default class {
    constructor() {
        this.cleanup = [];
    }

    async getHtml() {
        return `
    <div class="container-fluid d-flex flex-column align-items-center">
        <div class="container PS2P_font" style="position: absolute; margin-top: 50px;">
            <div class="d-flex align-items-center">
                <div>
                    <span style="font-size: 100px; line-height: 100px; color:#14FF00">404</span>
                    <span style="font-size: 30px; line-height: 30px; color:#14FF00"> PAGE NOT FOUND</span>
                </div>
            </div>
            <p id="typewriter-text-english" class="typewriter" style="margin-top: 16px; margin-bottom: 0; font-size: 20px;"></p>
            <p id="typewriter-text-korean" class="typewriter" style="margin-bottom: 10px; font-size: 30px;"></p>
            <p id="typewriter-text-japanese" class="typewriter" style="margin-bottom: 0px; font-size: 30px;"></p>
        </div>
        <div class="pacman-game" style="visibility: hidden; position: absolute; margin-top: 500px;">
            <iframe id="pacman-game" src="https://freepacman.org" width="1200" height="800" frameborder="0" sandbox="allow-scripts allow-same-origin"></iframe>
        </div>
    </div>
        `;
    }

    async init() {
        this.typewrite(
            "Not found the page. For you who have reached this 404 page, we'd like to offer the Pac-Man game with the Pac-Pong motif. We hope you have a pleasant time.",
            document.getElementById('typewriter-text-english'),
            () => {
                this.typewrite(
                    "페이지를 찾을 수 없습니다. 우리는 404에 닿은 당신에게 우리 팩퐁의 모티프가 된 팩맨 게임을 제공하기로 하였습니다. 즐거운 시간 되길 바랍니다.",
                    document.getElementById('typewriter-text-korean'),
                    () => {
                        this.typewrite(
                            "ページを見つけることができませんでした。ここまでこの404ページに辿り着いたあなたに、私たちはパックポンのモチーフとなったパックマンゲームを提供することにしました。楽しい時間をお過ごしください。",
                            document.getElementById('typewriter-text-japanese'),
                            () => {
                                // 타이핑 완료 후 팩맨게임 보이기
                                document.querySelector('.pacman-game').style.visibility = 'visible';
                                document.getElementById('pacman-game').focus();
                            }
                        );
                    }
                );
            }
        );
    }

    typewrite(text, element, callback) {
        let index = 0;
        const speed = 10; // Fastest typing speed in milliseconds

        function typeWriter() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeWriter, speed);
            } else if (callback) {
                callback();
            }
        }

        typeWriter();
    }

    destroy() {
        this.cleanup.forEach((cleanupFunc) => cleanupFunc());
        this.cleanup = [];
    }
}
