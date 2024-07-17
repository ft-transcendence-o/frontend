document.addEventListener('DOMContentLoaded', () => {
    const login_button = document.querySelector(".login");

	const login_text = login_button.querySelector("span:last-child");

	login_text.addEventListener("mouseenter", (event) => {
		login_text.classList.add("hover");
		console.log("hovering");
	});

	login_text.addEventListener("mouseleave", (event) => {
		login_text.classList.remove("hover");
		console.log("hover out");
	});
})