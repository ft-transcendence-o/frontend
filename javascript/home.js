function decodeJWTManually(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    return { header, payload };
  }

function login_click(event) {
    event.preventDefault(); // 기본 동작 방지
    // 사용자를 42 인증 페이지로 리다이렉트
    // query parameter(?다음) 부분을 환경변수로 대체해야 한다.
    window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-13da844ab09c30f81a4aac6f7f77bd34bfa89523fd00822876ca6c9ab86ac14f&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500&response_type=code";
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
            client_id: 'u-s4t2ud-13da844ab09c30f81a4aac6f7f77bd34bfa89523fd00822876ca6c9ab86ac14f',
            client_secret: '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',
            code: code,
            redirect_uri: 'http://127.0.0.1:5500'
        });

        // authorization code를 백엔드에 전송
        await fetch("https://localhost/user-management/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ "code": code })
          })
          .then(response => response.json())
          .then(data => {
            console.log(data['jwt']);
            // console.log(data.)
            const decodedToken = decodeJWTManually(data['jwt']);
            console.log(decodedToken);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        // await fetch("https://localhost/game/api/game/?page=1", {
        //     method: "GET",
        //     // body: {"code": code}
        // })
        // .then(response => {
        //     console.log(response.json());
        // })


          // 사용 예
        //   const decodedToken = decodeJWTManually('your.jwt.token');
        //   console.log(decodedToken);

        //   decodeJWTManually()
    }
})


