import example1 from "./javascript/pages/example1.js"
import example2 from "./javascript/pages/example2.js"

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('[data-link]')) {
            event.preventDefault();
            navigateTo(event.target.href);
        }
    });

    window.addEventListener('popstate', router);
    
    router();
})

const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
}

const router = async () => {
    const routes = [
        { path: "/example1", view: example1 },
        { path: "/example2", view: example2 },
    ];

    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: window.location.pathname === route.path,
        };
    });

    let match = potentialMatches.find((potentialMatche) => potentialMatche.isMatch);

    if (!match) {
        document.querySelector('#app').innerHTML = `<h1>404</h1>`
    } else {
        const view = new match.route.view();

        document.querySelector('#app').innerHTML = await view.getHtml();
    }
};
