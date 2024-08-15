import AbstractView from "./AbstractView.js";
import { navigateTo, baseUrl } from "../../router.js";
import { get_translated_value } from "../../language.js"

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Match Record");
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

                <!-- tables -->
                <!-- table의 아이템이 줄면 table도 함께 줄어든다 -->
                <!-- 같은 그리드 크기를 유지하기위해 div로 한번 감싸준다 -->
                <div style="height: 470px;">
                    <table class="table PS2P_font" style="position: relative; z-index: 1; font-size: 20px; margin: 0px 0px; margin-left: 120px; margin-top: 80px;">
                        <thead>
                            <th class="transItem" scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 240px;" data-trans_id="match_record_playerA_field">PLAYER A</th>
                            <th class="transItem" scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 250px" data-trans_id="match_record_playerB_field">PLAYER B</th>
                            <th class="transItem" scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 240px" data-trans_id="match_record_score_field">SCORE</th>
                            <th class="transItem" scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 260px" data-trans_id="match_record_mode_field">MODE</th>
                            <th class="transItem" scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px;" data-trans_id="match_record_date_field">DATE</th>
                        </thead>
                        <tbody id="record_table_body">
                            <!-- PLAYER A -->
                            <!-- PLAYER B -->
                            <!-- SCORE -->
                            <!-- MODE -->
                            <!-- DATE -->
                        </tbody>
                    </table>

                    <!-- table에 아이템이 아무것도 없을 떄 보여줄 메세지 -->
                    <div id="no_data_msg" class="PS2P_font transItem" style="position: relative; z-index: 3; color: white; top: 240px; text-align: center; display: none;" data-trans_id="match_record_empty">
                        There are no match data yet
                    </div>
                </div>

                <!-- 페이지 버튼 -->
                <nav class="PS2P_font justify-content-center" style="position: relative; z-index: 2; display: grid; margin: 120px 0px;">
                    <div class="pagination">
                        <li class="page-item">
                            <a id="record_backward_button" class="page-link disabled" href="backward"><</a>
                        </li>
                        <div id="page_button_body" class="pagination">
                            <!-- page idx buttons -->
                        </div>
                        <li class="page-item">
                            <a id="record_forward_button" class="page-link disabled" href="forward">></a>
                        </li>
                    </div>
                </nav>

            </div>
        </div>
    `;
    }

    async create_record_table_itmes(games) {
        if (games.length == 0)
        {
            document.querySelector("#no_data_msg").style.display = "block";
        }
        else
        {
            document.querySelector("#no_data_msg").style.display = "none";

            const record_table_body = document.querySelector("#record_table_body");
            let records = "";

            games.forEach((game) => {
                // 날짜 파싱
                const dateParse = game['created_at'].split('T')[0];
                let dateDisplay = '';
                dateDisplay += dateParse.split('-')[0];
                dateDisplay += ".";

                const month = dateParse.split('-')[1];
                dateDisplay += get_translated_value(`match_record_date_month_${month}`)

                dateDisplay += ".";
                dateDisplay += dateParse.split('-')[2];

                const record = `
                <tr>
                    <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${game['player1Nick']}</td>
                    <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${game['player2Nick']}</td>
                    <td style="background-color: transparent; color: white; border: none; padding: 5px 0px; display: flex;">
                        <span style="display: inline-block; width: 40px; text-align: right;">${game['player1Score']}</span>
                        <span>:</span>
                        <span style="display: inline-block; width: 40px; text-align: left;">${game['player2Score']}</span>
                    </td>
                    <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${get_translated_value("match_record_mode_" + game['mode'])}</td>
                    <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${dateDisplay}</td>
                </tr>
                `;

                records += record;
            })
            record_table_body.innerHTML = records;
        }
    }

    async create_page_buttons(page) {
        const page_button_body = document.querySelector("#page_button_body");
        let page_buttons = "";

        // current를 기준으로 5개를 어떻게 잘라내는가?
        // current를 기준으로 표시할 버튼의 범위를 구한다
        // 범위가 total_page를 넘어서면 클리핑한다
        // 범위에 따라서 backward forward 버튼을 추가한다
        // 아이템에 따른 정렬을 생각해보면 backward forward 는 미리 추가해놓고
        // 상황에따라 표시 및 이벤트리스너 등록을 하는게 더 좋을지도..
        let button_idx_start = Math.floor((page['current'] - 1) / 5) * 5 + 1;
        let button_idx_end = button_idx_start + 4;
        if (button_idx_end > page['total_pages'])
        {
            button_idx_end = page['total_pages'];
        }

        if (button_idx_start > 5)
        {
            document.querySelector("#record_backward_button").classList.remove("disabled");
        }
        if (button_idx_end != page['total_pages'])
        {
            document.querySelector("#record_forward_button").classList.remove("disabled");
        }

        // idx_start ~ idx_end 까지 backward, forward 사이에 버튼 추가
        while (button_idx_start <= button_idx_end)
        {
            let is_active = "";
            if (button_idx_start === page['current'])
            {
                is_active += " active";
            }
            const page_button = `
                <li class="page-item">
                    <a class="page-link page-link-button${is_active}" href="${button_idx_start}">${button_idx_start}</a>
                </li>
            `
            page_buttons += page_button;
            button_idx_start++;
        }
        page_button_body.innerHTML = page_buttons;
    }

    async init() {
        // translate 적용 테스트
        const transItems = document.querySelectorAll(".transItem");
        transItems.forEach( (transItem) => {
            transItem.innerHTML = get_translated_value(transItem.dataset.trans_id);
        } )

        // 클릭 가능한 요소들에 이벤트 리스너를 등록한다
        const mainButtons = document.querySelectorAll("#main_button");

        const handleMainButtonClick = (event) => {
            event.preventDefault();
            console.log(event.target.href);
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

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                mainButtons[0].click();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // 요청 할 페이지를 localStorage에서 관리하는식으로 시도
        // localStorage 변조에 대응하기 위해 미리 변수에 담아두고 리터럴 값을 이벤트 리스너로 넣어준다
        const response = await fetch(baseUrl + `/api/game-management/game?page=${localStorage.getItem("record_page")}`, {
            method: "GET",
            credentials: 'include',
        });
        if (response.ok) {
            // 대전기록들을 table에 채워넣는다
            const jsonResponse = await response.json();
            const games = jsonResponse['games'];
            const page = jsonResponse['page'];
            const button_idx_start = Math.floor((page['current'] - 1) / 5) * 5 + 1;
            const button_idx_end = button_idx_start + 4;
            console.log("success");
            console.log(response);
            console.log(jsonResponse);
            console.log("Games:", games.length, games)
            console.log("Page:", page)

            // 렌더링 요소들 함수화
            this.create_record_table_itmes(games);
            this.create_page_buttons(page);

            // 클릭 가능한 요소들에 이벤트 리스너를 등록한다

            // record 페이지 뒤로가기 버튼
            document.querySelector("#record_backward_button").addEventListener("click", (event) => {
                event.preventDefault();
                const page_num = button_idx_start - 5;
                localStorage.setItem("record_page", page_num);
                console.log("page_num", page_num);
                navigateTo("/match_record");
            })
            // record 페이지 앞으로가기 버튼
            document.querySelector("#record_forward_button").addEventListener("click", (event) => {
                event.preventDefault();
                const page_num = button_idx_start + 5;
                localStorage.setItem("record_page", page_num);
                console.log("page_num", page_num);
                navigateTo("/match_record");
            })

            const Page_Buttons = document.querySelectorAll(".page-link-button");

            console.log(Page_Buttons);

            Page_Buttons.forEach((Button) => {

                Button.addEventListener("click", (event) => {
                    event.preventDefault();
                    console.log(event.target.href);

                    // 라우팅 이벤트 추가

                    // page button 처리
                    const url = new URL(event.currentTarget.href);
                    const button_href = url.pathname;
                    const page_num = Number(button_href.split("/")[1]);

                    // 숫자가 아닌경우 예외처리
                    // scope를 벗어나서 page 객체를 볼 수 없다
                    // 인위적으로 backward, forward를 써줄수 있으니 id를 달아놓고 따로 이벤트 리스너를 등록한다

                    if (isNaN(page_num) === false)
                    {
                        // 페이지의 범위가 db의 범위를 벗어났다면? (개발자도구로 값을 변경시켰다면...)
                        // db에 저장되어있는 페이지값을 참고하여 보정한다
                        // 다시 생각해볼것...
                        // 현재 페이지의 범위가 있을것이다...

                        // 현재 페이지의 범위로 보정
                        if (page_num < button_idx_start)
                        {
                            page_num = button_idx_start;
                        }
                        else if (page_num > button_idx_end)
                        {
                            page_num = button_idx_end;
                        }

                        // 버튼에서 담고있는 페이지 값으로 localStorage의 값을 변경
                        localStorage.setItem("record_page", page_num);
    
                        // 1. 현재 페이지를 다시 라우팅한다
                        navigateTo("/match_record");
    
                        // 2. 테이블의 아이템 문자열을 반환하는 함수를 만들고 테이블의 innerHtml을 변경한다, 버튼도 동적으로 다시 만들어준다
                            // 테이블 아이템과 버튼을 만들어내는 함수들을 만들어야 한다
                        // this.create_record_table_itmes(games);
                        // this.create_page_buttons(page);
                        // 이벤트 리스너를 다시 등록해야 한다...보류...
                    }
                    
                });

                Button.addEventListener("mouseenter", (event) => {
                    // 
                });

                Button.addEventListener("mouseleave", (event) => {
                    // 
                });
            });
        } else if (response.status === 401) { // jwt가 없는 경우
            navigateTo("/");
            return ;
        } else { // otp 통과 안했을 경우
            const jsonResponse = await response.json();
            if (jsonResponse["otp_verified"] === false)
            {
                navigateTo("/");
                return ;
            }
        }

        this.cleanup = () => {
            mainButtons.forEach((button) => {
                button.removeEventListener("click", handleMainButtonClick);
                button.removeEventListener("mouseenter", handleMainMouseEnter);
                button.removeEventListener("mouseleave", handleMainMouseLeave);
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