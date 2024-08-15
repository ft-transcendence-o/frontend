import AbstractView from "./AbstractView.js";
import { navigateTo, baseUrl, router } from "../../router.js";
import { get_translated_value } from "../../language.js"

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
                            <a class="btn btn-primary transItem" id="main_button" href="/main" data-trans_id="main_button">>MAIN
                                <p style="font-size: 20px; margin-top: -12px;">(ESC)</p>
                            </a>
                        </li>
                    </ul>

                </div>

                <!-- match schedules -->
                <div class="PS2P_font" style="position: relative; z-index: 1; top: -50px;">

                    <!-- TOURNAMENT text -->
                    <p class="transItem" style="text-align: center; font-size: 30px; margin-bottom: 0px;" data-trans_id="match_schedules_TOURNAMENT">TOURNAMENT</p>

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
                            <div class="col-2 player_info" style="margin-left: 46px;">
                                <img id="img_player1" class="mx-auto d-block" src="./image/ghost_blue.gif" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player1</p>
                            </div>
                            <div class="col-2 player_info" style="margin-left: 104px;">
                                <img id="img_player2" class="mx-auto d-block" src="./image/ghost_red.gif" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player2</p>
                            </div>
                            <div class="col-2 player_info" style="margin-left: 58px;">
                                <img id="img_player3" class="mx-auto d-block" src="./image/ghost_pink.gif" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player3</p>
                            </div>
                            <div class="col-2 player_info" style="margin-left: 102px;">
                                <img id="img_player4" class="mx-auto d-block" src="./image/ghost_orange.gif" style="width: 100px; height: 97.8px;" alt="">
                                <p style="font-size: 30px; text-align: center; margin-top: 30px; margin-bottom: 30px; max-width: 306px;">player4</p>
                            </div>
                        </div>
                    </div>

                    <!-- center button -->
                    <div class="PS2P_font center_button blue_outline" style="position: absolute; width: 300px; height: 133.88px; max-width: 328px; max-height: 161.88px; top: 420px; left: 550px; display: flex; flex-direction: column; justify-content: center; cursor: pointer;">
                        <!-- 세로로 가운데 정렬 -->
                        <p class="transItem" style="font-size: 30px; margin-bottom: 0px; text-align: center; line-height: 34px;" data-trans_id="match_schedules_start">START!</p>
                        <p style="font-size: 20px; margin-bottom: 0px; text-align: center;">(ENTER)</p>
                    </div>

                    <!-- Champion -->
                    <!-- 모든 경기가 끝났을때만 조건부로 표시한다 -->
                    <div id="champion_text" class="PS2P_font transItem" data-trans_id="match_schedules_champion" style="position: absolute; display: none; width: 100%; top: 170px; left: 5px; font-size: 100px; text-align: center; text-shadow:
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

        const response = await fetch(baseUrl + "/api/game-management/session?mode=tournament", {
            method: "GET",
            credentials: 'include',
        });
        const jsonResponse = await response.json();
        console.log("tournamet info:", jsonResponse);

        if (response.status === 401) { // jwt가 없는 경우
            navigateTo("/");
            return ;
        } else { // otp 통과 안했을 경우
            if (jsonResponse["otp_verified"] === false)
            {
                navigateTo("/");
                return ;
            }
        }

        // URL에 직접 쳐서 들어온경우 기본값을 비교하여 메인으로 보내버린다
        if (jsonResponse["players_name"][2] === jsonResponse["players_name"][3])
        {
            navigateTo("/main");
        }

        // 뒤로가기 시도시 메인으로 보내버린다
        // 이벤트 리스너는 덮어쓰여지지 않고 계속해서 생성된다(?)
        window.removeEventListener('popstate', router);
        window.addEventListener('popstate', async (event) => {
            navigateTo("/main");
            return ;
        });

        // translate 적용 테스트
        const transItems = document.querySelectorAll(".transItem");
        transItems.forEach( (transItem) => {
            transItem.innerHTML = get_translated_value(transItem.dataset.trans_id);
        } )

        // 서버쪽 정보가 어떻게 저장되는지에 따라 localStorage에서 사용하던 값을 fetch로 가져온다
        // 해당 response에 따라 401 핸들링을 한다
        /*

        else if (response.status === 401) {
            // 토큰이 만료되었을 경우 -> 백엔드에서 갱신하고 새로고침 해준다
            // 이 부분에 도달하려면 로그아웃하고 popstate로 이동하여야 한다
            // (오류에 대한 모달창을 띄워 정보를 제공한다)
            // 로그인 화면으로 보내버린다
            navigateTo("/");
        }

        */

        // localStorage 변조에 대응하기 위해 미리 변수에 담아두고 리터럴 값을 이벤트 리스너로 넣어준다

        // player nickname을 적용시킨다
        const player_infos = document.querySelectorAll(".player_info");
        const nicknames = JSON.parse(localStorage.getItem("nicknames"));

        // for (let idx = 0; idx < player_infos.length; idx++)
        // {
        //     player_infos[idx].querySelector("p").innerText = nicknames[idx];
        // }
        for (let idx = 0; idx < player_infos.length; idx++)
        {
            player_infos[idx].querySelector("p").innerText = jsonResponse["players_name"][idx];
        }

        // match_count에 따라 match text의 색을 변경한다
        const match_textes = document.querySelectorAll(".match_text");
        // const match_count = localStorage.getItem("match_count");
        const match_count = jsonResponse["current_match"];

        // nickname에서 넘어올때 game 기록 조작을 방지하기 위해 다 지워준다
        const game1 = JSON.parse(localStorage.getItem("game1"));
        const game2 = JSON.parse(localStorage.getItem("game2"));
        const game3 = JSON.parse(localStorage.getItem("game3"));

        let match1_winner;
        let match2_winner;

        if (match_count > 0)
        {
            match_textes[0].style.color = "gray";
            match_textes[1].style.color = "#14FF00";

            if (jsonResponse["win_history"][0] === 0)
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

        if (match_count > 1)
        {
            match_textes[1].style.color = "gray";
            match_textes[2].style.color = "#14FF00";

            if (jsonResponse["win_history"][1] === 2)
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

        if (match_count > 2)
        {
            match_textes[2].style.color = "gray";

            if (jsonResponse["win_history"][2] === match1_winner)
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
            document.querySelector(".center_button").querySelector("p").innerHTML = get_translated_value("again_TOURNAMENT");
        }

        // 클릭 가능한 요소들에 이벤트 리스너를 등록한다
        // mainButton
        const mainButtons = document.querySelectorAll("#main_button");

        const handleMainButtonClick = async (event) => {
            event.preventDefault();
            console.log(event.target.href);
            const response = await fetch(baseUrl + "/api/game-management/session", {
                method: "DELETE",
                credentials: 'include',
                body: JSON.stringify({"mode": "tournament"}),
            });
            const jsonResponse = await response.json();
            console.log("tournamet info:", jsonResponse);
    
            navigateTo('/main');
        };

        const handleMainMouseEnter = (event) => {
            event.target.classList.remove("blue_outline");
            event.target.classList.add("green_outline");
            event.target.classList.add("white_stroke_2_5px");
        };

        const handleMainMouseLeave = (event) => {
            event.target.classList.add("blue_outline");
            event.target.classList.remove("green_outline");
            event.target.classList.remove("white_stroke_2_5px");
        };

        mainButtons.forEach((button) => {
            button.addEventListener("click", handleMainButtonClick);
            button.addEventListener("mouseenter", handleMainMouseEnter);
            button.addEventListener("mouseleave", handleMainMouseLeave);
        });

        // centerButton
        const centerButtons = document.querySelectorAll(".center_button");

        const handleCenterButtonClick = (event) => {
            event.preventDefault();
            console.log(event.target.href);
            if (match_count > 2)
                navigateTo("/nickname");
            else
                navigateTo("/tournament_game");
            return ;
        };

        const handleCenterMouseEnter = (event) => {
            event.target.classList.remove("blue_outline");
            event.target.classList.add("green_outline");
            event.target.classList.add("white_stroke_2_5px");
            event.target.classList.add("blue_hover");
        };

        const handleCenterMouseLeave = (event) => {
            event.target.classList.add("blue_outline");
            event.target.classList.remove("green_outline");
            event.target.classList.remove("white_stroke_2_5px");
            event.target.classList.remove("blue_hover");
        };

        centerButtons.forEach((button) => {
            button.addEventListener("click", handleCenterButtonClick);
            button.addEventListener("mouseenter", handleCenterMouseEnter);
            button.addEventListener("mouseleave", handleCenterMouseLeave);
        });

        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                centerButtons[0].click();
            } else if (event.key === "Escape") {
                event.preventDefault();
                mainButtons[0].click();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        this.cleanup = () => {
            mainButtons.forEach((button) => {
                button.removeEventListener("click", handleMainButtonClick);
                button.removeEventListener("mouseenter", handleMainMouseEnter);
                button.removeEventListener("mouseleave", handleMainMouseLeave);
            });
            centerButtons.forEach((button) => {
                button.removeEventListener("click", handleCenterButtonClick);
                button.removeEventListener("mouseenter", handleCenterMouseEnter);
                button.removeEventListener("mouseleave", handleCenterMouseLeave);
            });
            document.removeEventListener("keydown", handleKeyDown);
        };
    }

    destroy() {
		if (this.cleanup) {
			this.cleanup();
		}
	}
}