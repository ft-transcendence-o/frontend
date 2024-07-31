import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Match Schedules");
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

                    <!-- nav menu buttons -->
                    <ul class="nav justify-content-end">
                        <li style="margin-right: 40px;">
                            <a class="btn btn-primary" href="/main">>MAIN
                                <p style="font-size: 20px; margin-top: -12px;">(ESC)</p>
                            </a>
                        </li>
                    </ul>

                </div>

                <!-- match schedules -->
                <div class="PS2P_font" style="position: relative; z-index: 1; top: -50px;">

                    <!-- TOURNAMENT text -->
                    <p style="text-align: center; font-size: 30px; margin-bottom: 0px;">TOURNAMENT</p>

                    <!-- trophy -->
                    <div style="margin-top: -23px;">
                        <img src="./image/trophy.png" alt="" class="mx-auto d-block">
                    </div>

                    <!-- 1. boder left right 노가다 -->

                    <!-- 2. svg 노가다 -->
                    <div style="height: 360px;">
                        <svg width="1040" height="360" class="mx-auto d-block">

                            <!-- 모두 가운데 정렬되어 있기 때문에 선의 위치도 크기 / 2 로 계산한다 -->

                            <!-- 1-1 -->
                            <line class="line_1-1" x1="7" y1="276" x2="7" y2="360" style="stroke: white; stroke-width: 8;"/>
                            <line class="line_1-1" x1="3" y1="276" x2="181" y2="276" style="stroke: white; stroke-width: 8;"/>
                            <!-- 1-2 -->
                            <line class="line_1-2" x1="360" y1="276" x2="360" y2="360" style="stroke: white; stroke-width: 8;"/>
                            <line class="line_1-2" x1="189" y1="276" x2="364" y2="276" style="stroke: white; stroke-width: 8;"/>
                            <!-- 1-common -->
                            <line class="line_1-common" x1="185" y1="76" x2="185" y2="280" style="stroke: white; stroke-width: 8;"/>

                            <!-- 2-1 -->
                            <line class="line_2-1" x1="666" y1="276" x2="666" y2="360" style="stroke: white; stroke-width: 8;"/>
                            <line class="line_2-1" x1="662" y1="276" x2="841" y2="276" style="stroke: white; stroke-width: 8;"/>
                            <!-- 2-2 -->
                            <line class="line_2-2" x1="1015" y1="276" x2="1015" y2="360" style="stroke: white; stroke-width: 8;"/>
                            <line class="line_2-2" x1="849" y1="276" x2="1019" y2="276" style="stroke: white; stroke-width: 8;"/>
                            <!-- 2-common -->
                            <line class="line_2-common" x1="845" y1="76" x2="845" y2="280" style="stroke: white; stroke-width: 8;"/>
                            
                            <!-- 3-1 -->
                            <line class="line_3-1" x1="189" y1="80" x2="516" y2="80" style="stroke: white; stroke-width: 8;"/>
                            <!-- 3-2 -->
                            <line class="line_3-1" x1="522" y1="80" x2="841" y2="80" style="stroke: white; stroke-width: 8;"/>

                            <!-- final -->
                            <line class="line_final" x1="519" y1="0" x2="519" y2="84" style="stroke: white; stroke-width: 8;"/>

                        </svg>

                        <span id="match_1" style="font-size: 30px; line-height: 30px; position: absolute; top: 650px; left: 310px; text-align: center;">
                            MATCH<br>
                            NO.1
                        </span>
                        <span id="match_2" style="font-size: 30px; line-height: 30px; position: absolute; top: 650px; left: 970px; text-align: center;">
                            MATCH<br>
                            NO.2
                        </span>
                        <span id="match_final" style="font-size: 30px; line-height: 30px; position: absolute; top: 334px; left: 646px; text-align: center; text-shadow:
                        -1px -1px 0 #000000,  
                        1px -1px 0 #000000,
                        -1px 1px 0 #000000,
                        1px 1px 0 #000000;">
                            FINAL<br>
                            MATCH
                        </span>
                    </div>

                    <!-- ghost -->
                    <div class="container" style="padding-top: 4px;">
                        <div class="row">
                            <div class="col-2" style="margin-left: 48px;">
                                <img id="img_player1" class="mx-auto d-block" src="./image/ghost_blue.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player1</p>
                            </div>
                            <div class="col-2" style="margin-left: 133px;">
                                <img id="img_player2" class="mx-auto d-block" src="./image/ghost_red.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player2</p>
                            </div>
                            <div class="col-2" style="margin-left: 86px;">
                                <img id="img_player3" class="mx-auto d-block" src="./image/ghost_pink.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player1</p>
                            </div>
                            <div class="col-2" style="margin-left: 129px;">
                                <img id="img_player4" class="mx-auto d-block" src="./image/ghost_orange.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player2</p>
                            </div>
                        </div>
                    </div>

                    <!-- center button -->
                    <div class="PS2P_font center_button blue_outline" style="position: absolute; width: 328px; height: 161.88px; max-width: 328px; max-height: 161.88px; top: 420px; left: 550px; display: flex; flex-direction: column; justify-content: center;">
                        <!-- 세로로 가운데 정렬 -->
                        <p style="font-size: 30px; margin-bottom: 0px; text-align: center; line-height: 34px;">START!</p>
                        <!-- <p style="font-size: 30px; margin-bottom: 0px; text-align: center; line-height: 34px;">TOURNAMENT<br>AGAIN?</p> -->
                        <p style="font-size: 20px; margin-bottom: 0px; text-align: center;">(ENTER)</p>
                    </div>

                    <!-- Champion -->
                    <!-- 모든 경기가 끝났을때만 조건부로 표시한다 -->
                    <div class="PS2P_font" style="position: absolute; display: none; top: 170px; left: 274px; font-size: 100px; text-shadow:
                    -1px -1px 0 #000000,  
                    1px -1px 0 #000000,
                    -1px 1px 0 #000000,
                    1px 1px 0 #000000;">
                        CHAMPION!
                    </div>

                </div>
            </div>
        </div>
        `;
    }

    async init() {
        // 임시로 line 의 색을 바꿔본다
        // const lines = document.querySelectorAll(".line_1-1");

        // lines.forEach( (line) => {
        //     line.style.stroke = "#14FF00";
        // })
        // document.querySelector(".line_1-common").style.stroke = "#14FF00";

        // 승 패에 따라 svg의 line 색을 바꾼다

        // 승 패에 따라 플레이어 이미지를 바꾼다
        // const img_player1 = document.querySelector("#img_player1");
        // img_player1.src = "./image/ghost_death.png";

        // 승 패에 따라 match 텍스트의 색을 바꾼다
        // const txt_match1 = document.querySelector("#match_1");
        // txt_match1.style.color = "gray";

        // const txt_match2 = document.querySelector("#match_2");
        // txt_match2.style.color = "#14FF00";

        // 현재 경기 상태에 따라 화면의 요소들을 갱신한다
        // 모든 요소들을 id로 찾아서 일일이 속성값을 바꿀것인지
        // 클래스를 추가할것인지... -> css도 깎아야함
        // img 태그를 제외하고 style 속성을 바꾸는 요소들은 css로 적용시킬수있다

		// 클릭 가능한 요소들에 이벤트 리스너를 등록한다
        const Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");

		Top_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(event.target.href);

                // 라우팅 이벤트 추가
                // 비동기 이슈?
                if (event.target.href === "http://127.0.0.1:5500/main") {
                    navigateTo("/main");
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

        const Center_Button = document.querySelector(".center_button");

        Center_Button.addEventListener("click", (event) => {
            event.preventDefault();
            console.log(event.target.href);

            // 라우팅 이벤트 추가
            // match_count 확인
            // match_1up, match_2up setitem
        });

        Center_Button.addEventListener("mouseenter", (event) => {
            Center_Button.classList.remove("blue_outline");
            Center_Button.classList.add("green_outline");
            Center_Button.classList.add("white_stroke_2_5px");
            Center_Button.classList.add("blue_hover");
        });

        Center_Button.addEventListener("mouseleave", (event) => {
            Center_Button.classList.add("blue_outline");
            Center_Button.classList.remove("green_outline");
            Center_Button.classList.remove("white_stroke_2_5px");
            Center_Button.classList.remove("blue_hover");
        });
    }
}