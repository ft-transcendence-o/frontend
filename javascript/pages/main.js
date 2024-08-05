import { navigateTo, baseUrl } from "../../router.js";
import AbstractView from "./AbstractView.js";

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Utility function to delete a cookie by name
function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// 소독 Sanitize input
function sanitizeInput(input) {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
}

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Main");
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

                <!-- Intra ID -->
                <span id="user_name" class="PS2P_font" style="position: absolute; z-index: 3; font-size: 30px; margin-top: 7px; margin-left: 70px;">INTRA_ID</span>
                
                <!-- nav menu buttons -->
                <ul class="nav justify-content-end">
                    <li>
                        <a class="btn btn-primary" href="/match_record">>MATCH-RECORD</a>
                    </li>
                    <li style="margin-left: 20px;">
                        <a class="btn btn-primary" href="/LANGUAGE">>LANGUAGE</a>
                    </li>
                    <li style="margin-left: 20px; margin-right: 40px;">
                        <a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#logoutModal">>LOGOUT</a>
                    </li>
                </ul>

            </div>

            <!-- game mode button -->
            <div id="game_mode_button" class="col-12" style="display: flex; justify-content: center; padding-top: 200px;">

                <!-- 1 ON 1 Button -->
                <!-- data- 접두사를 통해 Custom Attribute 사용 -->
                <button class="PS2P_font blue_outline" data-href="/1ON1" style="background-color: black; position: relative; z-index: 2; font-size: 30px; width: 369px; height: 393px;">

                    <!-- PacMans && VS text -->
                    <div style="padding-top: 80px; padding-bottom: 110px;">
                        <img src="./image/pacman_right.gif" alt="" style="width: 100px; height: 107.18px;">
                        <span style="color: white; text-shadow: none;">VS</span>
                        <img src="./image/pacman_left.gif" alt="" style="width: 100px; height: 107.18px;">
                    </div>

                    <!-- 1 ON 1 text -->
                    <div style="padding-top: 10px; padding-bottom: 10px;">
                        1 ON 1
                    </div>

                </button>

                <!-- TOURNAMENT Button -->
                <button class="PS2P_font blue_outline" data-href="/TOURNAMENT" style="background-color: black; position: relative; z-index: 2; font-size: 30px; width: 369px; height: 393px; margin-left: 120px;">

                    <!-- ghost -->
                    <div style="padding-top: 35px; padding-bottom: 30px;">
                        <!-- first row ghosts -->
                        <div style="padding-bottom: 30px;">
                            <img src="./image/ghost_red.gif" alt="" style="width: 100px; height: 97.8px;">
                            <img src="./image/ghost_blue.gif" alt="" style="width: 100px; height: 97.8px; margin-left: 12px;">
                        </div>

                        <!-- second row ghosts -->
                        <div>
                            <img src="./image/ghost_orange.gif" alt="" style="width: 100px; height: 97.8px;">
                            <img src="./image/ghost_pink.gif" alt="" style="width: 100px; height: 97.8px; margin-left: 12px;">
                        </div>
                    </div>

                    <!-- TOURNAMENT -->
                    <div style="padding-top: 20px; padding-bottom: 20px;">
                        TOURNAMENT
                    </div>
                </button>
            </div>

            <!-- text -->
            <div class="col-12" style="display: flex; justify-content: center; position: relative; z-index: 2; padding-top: 100px;">
                <p class="PS2P_font" style="font-size: 30px;">SELECT GAME MODE</p>
            </div>
        </div>
    </div>

    <!-- Logout Modal -->
    <div class="modal fade PS2P_font custom-modal" id="logoutModal" tabindex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content blue_outline">
                <div class="modal-header custom-modal-header" style="border: none;">
                    <div class="modal-title custom-modal-title" id="logoutModalLabel">OH, <br><br> YOU ARE LEAVING...</div>
                    <button type="button" class="btn-close custom-btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body custom-modal-body" style="font-size: 30px;" style="border: none;">
                    ARE YOU SURE?
                </div>
                <div class="modal-footer custom-modal-footer" style="border: none;">

                    <button type="button" class="custom-btn-left blue_outline PS2P_font" style="margin: 20px 20px; width: 425px; height: 162px; font-size: 30px" data-bs-dismiss="modal">NO,<br> JUST KIDDING</button>

                    <button type="button" id="confirmLogout" class=" custom-btn-right blue_outline PS2P_font" style="margin: 20px 20px; width: 425px; height: 162px; font-size: 30px" data-bs-dismiss="modal">YES,<br> LOG ME OUT</button>

                </div>
            </div>
        </div>
    </div>
    `;
    }

    async init() {
        // 클릭 가능한 요소들에 이벤트 리스너를 등록한다
        // button tag 들은 dataset 를 통해 Custom Attribute 를 받아온다
        const Mode_Buttons = document.querySelector("#game_mode_button").querySelectorAll("button");

        Mode_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();
                console.log(Button.dataset.href);
                // 라우팅 이벤트 추가

                if (Button.dataset.href === "/TOURNAMENT")
                {
                    navigateTo("/nickname");
                }
                else if (Button.dataset.href === "/1ON1")
                {
                    navigateTo("/game");
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

        const Top_Buttons = document.querySelector("#top_item").querySelectorAll("a");

        Top_Buttons.forEach((Button) => {

            Button.addEventListener("click", (event) => {
                event.preventDefault();

                const url = new URL(event.currentTarget.href);
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

        // 로그아웃 Modal
        // 추후 세션 삭제 api 추가 예정
        document.getElementById("confirmLogout").addEventListener("click", async () => {
            try {
                const response = await fetch(baseUrl + "/api/user-management/token", {
                    method: "DELETE",
                    credentials: 'include',
                });
                if (response.ok) {
                    // Close the modal
                    const logoutModal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
                    logoutModal.hide();
                    navigateTo('/');
                } else if (response.status === 401) {
                    navigateTo('/');
                } else {
                    const jsonResponse = await response.json();
                    console.log(jsonResponse);
                    console.log("error");
                }
            } catch (error) {
                console.log("Fetch error:", error);
            }
        });

        // backend api를 통해 유저의 이름을 받아와서 요소에 집어넣는다
        const User_Name_Holder = document.querySelector("#top_item").querySelector("#user_name");

        const response = await fetch(baseUrl + "/api/user-management/info", {
            method: "GET",
            credentials: 'include',
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log("success");
            console.log(response);
            console.log(jsonResponse);
            User_Name_Holder.innerHTML = sanitizeInput(jsonResponse['login']);      // 이부분 추가
        } else {
            const jsonResponse = await response.json();
            console.log("Fail");
            console.log(response);
            console.log(jsonResponse);
        }
    }
}
