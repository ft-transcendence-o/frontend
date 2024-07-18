function login_click(event) {
	fetch('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0abe518907df9bbc76014c0d71310e3b0ed196727cec3f8d4e741103871a186d&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F&response_type=code') // 원하는 URL을 입력하세요
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // 데이터를 처리하는 로직을 여기에 작성하세요
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
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
})