import AbstractView from "./AbstractView.js";
import { navigateTo, getCookie } from "../../router.js";

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
                            <line class="line_3-2" x1="522" y1="80" x2="841" y2="80" style="stroke: white; stroke-width: 8;"/>

                            <!-- final -->
                            <line class="line_3-common" x1="519" y1="0" x2="519" y2="84" style="stroke: white; stroke-width: 8;"/>

                        </svg>

                        <span class="match_text" id="match_1" style="font-size: 30px; line-height: 30px; position: absolute; top: 650px; left: 310px; text-align: center; color: #14FF00;">
                            MATCH<br>
                            NO.1
                        </span>
                        <span class="match_text" id="match_2" style="font-size: 30px; line-height: 30px; position: absolute; top: 650px; left: 970px; text-align: center;">
                            MATCH<br>
                            NO.2
                        </span>
                        <span class="match_text" id="match_final" style="font-size: 30px; line-height: 30px; position: absolute; top: 334px; left: 646px; text-align: center; text-shadow:
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
                            <div class="col-2 player_info" style="margin-left: 48px;">
                                <img id="img_player1" class="mx-auto d-block" src="./image/ghost_blue.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player1</p>
                            </div>
                            <div class="col-2 player_info" style="margin-left: 133px;">
                                <img id="img_player2" class="mx-auto d-block" src="./image/ghost_red.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player2</p>
                            </div>
                            <div class="col-2 player_info" style="margin-left: 86px;">
                                <img id="img_player3" class="mx-auto d-block" src="./image/ghost_pink.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player3</p>
                            </div>
                            <div class="col-2 player_info" style="margin-left: 129px;">
                                <img id="img_player4" class="mx-auto d-block" src="./image/ghost_orange.png" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player4</p>
                            </div>
                        </div>
                    </div>

                    <!-- center button -->
                    <div class="PS2P_font center_button blue_outline" style="position: absolute; width: 328px; height: 161.88px; max-width: 328px; max-height: 161.88px; top: 420px; left: 550px; display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
                        <!-- 세로로 가운데 정렬 -->
                        <p style="font-size: 30px; margin-bottom: 0px; text-align: center; line-height: 34px;">START!</p>
                        <p style="font-size: 20px; margin-bottom: 0px; text-align: center;">(ENTER)</p>
                    </div>

                    <!-- Champion -->
                    <!-- 모든 경기가 끝났을때만 조건부로 표시한다 -->
                    <div id="champion_text" class="PS2P_font" style="position: absolute; display: none; top: 170px; left: 274px; font-size: 100px; text-shadow:
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
        // player nickname을 적용시킨다
        const player_infos = document.querySelectorAll(".player_info");
        const nicknames = JSON.parse(localStorage.getItem("nicknames"));
        console.log(nicknames);
        for (let idx = 0; idx < player_infos.length; idx++)
        {
            player_infos[idx].querySelector("p").innerText = nicknames[idx];
        }

        // match_count에 따라 match text의 색을 변경한다
        const match_textes = document.querySelectorAll(".match_text");
        const match_count = localStorage.getItem("match_count");

        let match1_winner;
        let match2_winner;

        if (match_count > 1)
        {
            match_textes[0].style.color = "gray";
            match_textes[1].style.color = "#14FF00";

            const game = JSON.parse(localStorage.getItem("game1"));

            if (game['player1Score'] > game['player2Score'])
            {
                const lines = document.querySelectorAll(".line_1-1")
                
                lines.forEach( (line) => {
                    line.style.stroke = "#14FF00";
                })
                player_infos[1].querySelector("img").src = "./image/ghost_death.png"
                match1_winner = 0;
            }
            else
            {
                const lines = document.querySelectorAll(".line_1-2")
                
                lines.forEach( (line) => {
                    line.style.stroke = "#14FF00";
                })
                player_infos[0].querySelector("img").src = "./image/ghost_death.png"
                match1_winner = 1;
            }
            const line = document.querySelector(".line_1-common");
            line.style.stroke = "#14FF00";
        }

        if (match_count > 2)
        {
            match_textes[1].style.color = "gray";
            match_textes[2].style.color = "#14FF00";

            const game = JSON.parse(localStorage.getItem("game2"));

            if (game['player1Score'] > game['player2Score'])
            {
                const lines = document.querySelectorAll(".line_2-1")
                
                lines.forEach( (line) => {
                    line.style.stroke = "#14FF00";
                })
                player_infos[3].querySelector("img").src = "./image/ghost_death.png"
                match2_winner = 2;
            }
            else
            {
                const lines = document.querySelectorAll(".line_2-2")
                
                lines.forEach( (line) => {
                    line.style.stroke = "#14FF00";
                })
                player_infos[2].querySelector("img").src = "./image/ghost_death.png"
                match2_winner = 3;
            }
            const line = document.querySelector(".line_2-common");
            line.style.stroke = "#14FF00";
        }

        if (match_count > 3)
        {
            match_textes[2].style.color = "gray";

            const game = JSON.parse(localStorage.getItem("game3"));

            if (game['player1Score'] > game['player2Score'])
            {
                const lines = document.querySelectorAll(".line_3-1")
                
                lines.forEach( (line) => {
                    line.style.stroke = "#14FF00";
                })
                player_infos[match2_winner].querySelector("img").src = "./image/ghost_death.png"
            }
            else
            {
                const lines = document.querySelectorAll(".line_3-2")
                
                lines.forEach( (line) => {
                    line.style.stroke = "#14FF00";
                })
                player_infos[match1_winner].querySelector("img").src = "./image/ghost_death.png"
            }
            const line = document.querySelector(".line_3-common");
            line.style.stroke = "#14FF00";

            document.querySelector("#champion_text").style.display = "block";
            document.querySelector(".center_button").querySelector("p").innerHTML = "TOURNAMENT<br>AGAIN?";

            // 여기서 백엔드로 게임기록 일괄 전송?
            // game_result 객체 만들기
            const game1 = JSON.parse(localStorage.getItem("game1"));
            const game2 = JSON.parse(localStorage.getItem("game2"));
            const game3 = JSON.parse(localStorage.getItem("game3"));
            let game_result = {
                "game1": {
                    "player1Nick": game1["player1Nick"],
                    "player2Nick": game1["player2Nick"],
                    "player1Score" : game1["player1Score"],
                    "player2Score" : game1["player2Score"],
                    "mode": "TOURNAMENT"
                },
                "game2": {
                    "player1Nick": game2["player1Nick"],
                    "player2Nick": game2["player2Nick"],
                    "player1Score" : game2["player1Score"],
                    "player2Score" : game2["player2Score"],
                    "mode": "TOURNAMENT"
                },
                "game3": {
                    "player1Nick": game3["player1Nick"],
                    "player2Nick": game3["player2Nick"],
                    "player1Score" : game3["player1Score"],
                    "player2Score" : game3["player2Score"],
                    "mode": "TOURNAMENT"
                },
            };
            
            const response = await fetch("http://localhost:8000/game-management/tournament", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${getCookie('jwt')}`,
                },
                body: JSON.stringify(game_result),
            });

            if (response.ok)
            {
                console.log("TOURNAMENT POST OK");
            }
            else
            {
                console.log("status:", response.status);
            }
        }

		// 클릭 가능한 요소들에 이벤트 리스너를 등록한다
        const Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");

		Top_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(event.target.href);

                // 라우팅 이벤트 추가
                // 비동기 이슈?
                if (event.target.href === "http://localhost:5500/main") {
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

            const match_count = localStorage.getItem("match_count");
            const nicknames = JSON.parse(localStorage.getItem("nicknames"));

            let match_1up;
            let match_2up;
            // 라우팅 이벤트 추가
            if (match_count > 3)
            {
                console.log("go to nickname page");
                navigateTo("/nickname");
            }
            else
            {
                console.log("go to game page");
                // match_1up, match_2up 에 적절한 닉네임 넣어주기

                // 첫번째 경기라면 1, 2번째 유저의 닉네임을 대입한다
                if (match_count == 1)
                {
                    match_1up = nicknames[0];
                    match_2up = nicknames[1];
                }
                // 두번째 경기라면 3, 4번째 유저의 닉네임을 대입한다
                else if (match_count == 2)
                {
                    match_1up = nicknames[2];
                    match_2up = nicknames[3];
                }
                // 마지막 경기라면
                else
                {
                    const game1 = JSON.parse(localStorage.getItem("game1"));
                    const game2 = JSON.parse(localStorage.getItem("game2"));

                    // 첫번째 경기 승자의 닉네임을 대입한다
                    if (game1['player1Score'] > game1['player2Score'])
                    {
                        match_1up = nicknames[0];
                    }
                    else
                    {
                        match_1up = nicknames[1];
                    }

                    // 두번째 경기 승자의 닉네임을 대입한다
                    if (game2['player1Score'] > game2['player2Score'])
                    {
                        match_2up = nicknames[2];
                    }
                    else
                    {
                        match_2up = nicknames[3];
                    }
                }

                localStorage.setItem("match_1up", match_1up);
                localStorage.setItem("match_2up", match_2up);
                navigateTo("/game");
            }
            
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