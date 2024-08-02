import AbstractView from "./AbstractView.js";
import { navigateTo, baseUrl } from "../../router.js";

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
                            <a class="btn btn-primary" href="/main">>MAIN
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
                            <th scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 240px;">PLAYER A</th>
                            <th scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 250px">PLAYER B</th>
                            <th scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 240px">SCORE</th>
                            <th scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px; width: 260px">MODE</th>
                            <th scope="col" style="background-color: transparent; color: white; border: none; padding: 15px 0px; padding-bottom: 25px;">DATE</th>
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
                    <div id="no_data_msg" class="PS2P_font" style="position: relative; z-index: 3; color: white; top: 240px; text-align: center; display: none;">
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
                {
                    if (month === "01")
                    {
                        dateDisplay += "JAN"
                    }
                    else if (month === "02")
                    {
                        dateDisplay += "FEB"
                    }
                    else if (month === "03")
                    {
                        dateDisplay += "MAR"
                    }
                    else if (month === "04")
                    {
                        dateDisplay += "APR"
                    }
                    else if (month === "05")
                    {
                        dateDisplay += "MAY"
                    }
                    else if (month === "06")
                    {
                        dateDisplay += "JUN"
                    }
                    else if (month === "07")
                    {
                        dateDisplay += "JUL"
                    }
                    else if (month === "08")
                    {
                        dateDisplay += "AUG"
                    }
                    else if (month === "09")
                    {
                        dateDisplay += "SEP"
                    }
                    else if (month === "10")
                    {
                        dateDisplay += "OCT"
                    }
                    else if (month === "11")
                    {
                        dateDisplay += "NOV"
                    }
                    else if (month === "12")
                    {
                        dateDisplay += "DEC"
                    }
                    else
                    {
                        dateDisplay += "err"
                    }
                }

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
                    <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${game['mode']}</td>
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
                    <a class="page-link${is_active}" href="/${button_idx_start}">${button_idx_start}</a>
                </li>
            `
            page_buttons += page_button;
            button_idx_start++;
        }
        page_button_body.innerHTML = page_buttons;
    }

    async init() {
        // 클릭 가능한 요소들에 이벤트 리스너를 등록한다
        const Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");

        Top_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(event.target.href);

                // 라우팅 이벤트 추가
                // 비동기 이슈?
                const url = new URL(event.target.href);
                const pathname = url.pathname;

                navigateTo(pathname);
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
            console.log("success");
            console.log(response);
            console.log(jsonResponse);
            console.log("Games:", games.length, games)
            console.log("Page:", page)

            // 렌더링 요소들 함수화
            this.create_record_table_itmes(games);
            this.create_page_buttons(page);

            // 클릭 가능한 요소들에 이벤트 리스너를 등록한다
            const Page_Buttons = document.querySelectorAll(".page-link");

            console.log(Page_Buttons);

            Page_Buttons.forEach((Button) => {

                Button.addEventListener("click", (event) => {
                    event.preventDefault();
                    console.log(event.target.href);

                    // 라우팅 이벤트 추가

                    // page button 처리
                    const url = new URL(event.target.href);
                    const button_href = url.pathname;
                    const page_num = Number(button_href);
                    
                    // 숫자가 아닌경우 예외처리
                    // scope를 벗어나서 page 객체를 볼 수 없다
                    if (page_num === NaN)
                    {
                        if (button_href === "backward")
                        {
                            page_num = page['current'] - 1;
                        }
                        else if (button_href === "forward")
                        {
                            page_num = page['current'] + 1;
                        }
                        else
                        {
                            console.log("href error");
                        }
                    }
                    else
                    {
                        // 페이지의 범위가 db의 범위를 벗어났다면? (개발자도구로 값을 변경시켰다면...)
                        // db에 저장되어있는 페이지값을 참고하여 보정한다
                        if (page_num < 1)
                        {
                            page_num = 1;
                        }
                        else if (page_num > page['total_pages'])
                        {
                            page_num = page['total_pages'];
                        }
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
                });

                Button.addEventListener("mouseenter", (event) => {
                    // 
                });

                Button.addEventListener("mouseleave", (event) => {
                    // 
                });
            });
        } else {
            const jsonResponse = await response.json();
            console.log("Fail");
            console.log(response);
            console.log(jsonResponse);
        }
    }
}