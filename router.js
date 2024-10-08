import home from "./javascript/pages/home.js"
import QRcode from "./javascript/pages/QRcode.js"
import OTP from "./javascript/pages/OTP.js"
import main from "./javascript/pages/main.js"
import match_record from "./javascript/pages/match_record.js"
import nickname from "./javascript/pages/nickname.js"
import match_schedules from "./javascript/pages/match_schedules.js"
import normal_game from "./javascript/pages/normal_game.js"
import tournament_game from "./javascript/pages/tournament_game.js"
import Notfound from "./javascript/pages/404.js";

let currentView = null;     // 현재 화면을 추적하는 전역 변수 선언. 페이지가 변경될 때 destroy 메소드가 호출되는 것을 보장하기 위함이다. destroy메소드는 각 페이지에서 등록한 eventListener들을 한군데 모아 담은 cleanup을 삭제하는 일을 한다.

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('[data-link]')) {
            event.preventDefault();
            navigateTo(event.target.href);
        }
    });

    window.addEventListener('popstate', router);

    if (window.location.pathname === '/match_schedules' || window.location.pathname === '/tournament_game')
    {
        navigateTo("/");
        return ;
    }
    
    router();
})

export const baseUrl = "https://127.0.0.1";

export const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
}

export const router = async () => {
    const routes = [
        { path: "/", view: home },
        { path: "/QRcode", view: QRcode },
        { path: "/OTP" , view: OTP },
        { path: "/main", view: main },
        { path: "/match_record", view: match_record },
        { path: "/nickname", view: nickname },
        { path: "/match_schedules", view: match_schedules},
        { path: "/normal_game", view: normal_game},
        { path: "/tournament_game", view: tournament_game},
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: window.location.pathname === route.path,
        };
    });

    let match = potentialMatches.find((potentialMatche) => potentialMatche.isMatch);

    if (!match) {
        match = { route: { view: Notfound }, isMatch: true };
    }
    
    
    if (currentView && typeof currentView.destroy === 'function') {
            currentView.destroy();  // 현재 페이지 변경 시 이벤트리스너 모둠 제거 작업
    }

    const view = new match.route.view();
    document.querySelector('#app').innerHTML = await view.getHtml();
    await view.init();

    currentView = view;
};
