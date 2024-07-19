function login_click(event) {
    event.preventDefault(); // 기본 동작 방지
    // 사용자를 42 인증 페이지로 리다이렉트
    // query parameter(?다음) 부분을 환경변수로 대체해야 한다.
    window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0abe518907df9bbc76014c0d71310e3b0ed196727cec3f8d4e741103871a186d&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F&response_type=code";
}
document.addEventListener("DOMContentLoaded", async () => {
    const login_button = document.querySelector(".login");
    const login_text = login_button.querySelector("span:last-child");
    login_button.addEventListener("click", login_click);
    login_text.addEventListener("mouseenter", (event) => {
        login_text.classList.add("hover");
        console.log("hovering");
    });
    login_text.addEventListener("mouseleave", (event) => {
        login_text.classList.remove("hover");
        console.log("hover out");
    });
    // URL에서 코드 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
        console.log("Received authorization code:", code);
        // 여기서 백엔드로 코드를 보내 액세스 토큰을 얻는 로직을 구현할 수 있습니다.

        // 데이터 준비
        const data = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-c8ed34a18722d3b06d337af57bfdb0d1508556b71f1df037d060f2d1a31e3314',
            client_secret: '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',
            code: code,
            redirect_uri: 'https://127.0.0.1:5500'
        });

        // authorization code를 백엔드에 전송
        await fetch("http://52.78.146.67/user-management/token", {
            method: "POST",
            body: {"code": code}
        })
        .then(response => {
            console.log(response.json());
        })
    }
})


