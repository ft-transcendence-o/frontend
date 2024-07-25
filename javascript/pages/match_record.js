import AbstractView from "./AbstractView.js";
import { navigateTo } from "../../router.js";

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
                <div id="no_data_msg" class="PS2P_font" style="position: relative; z-index: 3; color: white; top: 240px; text-align: center;">
                    There are no match data yet
                </div>
            </div>

            <!-- 페이지 버튼 -->
            <nav class="PS2P_font justify-content-center" style="position: relative; z-index: 2; display: grid; margin: 120px 0px;">
                <ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" href="backward"><</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link active" href="/1">1</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="/2">2</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="/3">3</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" href="forward">></a>
                    </li>
                </ul>
            </nav>

		</div>
    </div>
    `;
    }

    async init() {
        // 요청 할 페이지를 localStorage에서 관리하는식으로 시도
        const response = await fetch(`http://10.19.218.225:8000/game-management/game?page=${localStorage.getItem("record_page")}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json',
            },
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

            if (games.length > 0)
            {
                document.querySelector("#no_data_msg").remove;
            }
            else
            {
                const record_table_body = document.querySelector("#record_table_body");

                games.forEach((game) => {
                    // 점수 파싱
                    let scoreParse;
                    // 점수의 저장형태는 추후 논의에 따라 변할 수 있음
                    if (game['mode'] === "1vs1")
                    {
                        scoreParse = game['score'].split(':');
                    }
                    else
                    {
                        scoreParse = game['score'].split('-');
                    }

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
                        <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${game['player1']}</td>
                        <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${game['player2']}</td>
                        <td style="background-color: transparent; color: white; border: none; padding: 5px 0px; display: flex;">
                            <span style="display: inline-block; width: 40px; text-align: right;">${scoreParse[0]}</span>
                            <span>:</span>
                            <span style="display: inline-block; width: 40px; text-align: left;">${scoreParse[1]}</span>
                        </td>
                        <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${game['mode']}</td>
                        <td style="background-color: transparent; color: white; border: none; padding: 5px 0px;">${dateDisplay}</td>
                    </tr>
                    `;

                    record_table_body.innerHTML += record;
                })
            }
            // 페이지 수에 따라 페이지 버튼을 만들어준다
            // 기본적으로 1페이지 버튼은 반드시 존재한다
        } else {
            const jsonResponse = await response.json();
            console.log("Fail");
            console.log(response);
            console.log(jsonResponse);
        }

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

        const Page_Buttons = document.querySelectorAll(".page-link");

        console.log(Page_Buttons);

		Page_Buttons.forEach((Button) => {

			Button.addEventListener("click", (event) => {
				event.preventDefault();
				console.log(event.target.href);
				// 라우팅 이벤트 추가
			});

			Button.addEventListener("mouseenter", (event) => {
				// 
			});

			Button.addEventListener("mouseleave", (event) => {
                // 
			});
		});
    }
}