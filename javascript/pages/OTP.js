import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Example1");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `<div class="container-fluid d-flex flex-column align-items-center">
		
		<img class="backimg" src="./image/background_2.png" alt="">


		<!-- Start DEMO HTML (Use the following code into your project)-->
		<!-- <body class="container-fluid bg-body-tertiary d-block"> -->
	<div class="row justify-content-center">
		<div class="col-12">
		<div class="card bg-black" style="z-index: 4; margin-top: 262px;">
			<div class="card-body p-5 text-center">

			<div class="otp-field mb-4">
				<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;"  />
				<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
				<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
				<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
				<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
				<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
			</div>

			<button type="button" class="btn btn-primary">
				<span class="PS2P_font">
					VERIFY
				</span>
			</button>

			<!-- invalid input -->
			<div id="invalid_input"></div>

			</div>
		</div>
		</div>
	</div>

		<!-- footer -->
		<div class="row" style="position:absolute; padding-top:824px; z-index: 3;">
			<div class="col-12">
				<p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 34px; font-size: 30px;">ENTER 6 DIGITS</p>
				<p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 0px; font-size: 30px;">FROM GOOGLE OTP/AUTHENTICATOR</p>
			</div>
		</div>
	</div>
	<!-- </body> -->

		

	
    <script src="./bootstrap-5.3.3-dist/js/bootstrap.min.js"></script>
	<!-- Script JS -->
	<script type="module" src="./javascript/OTP.js"></script>
	<!--$%analytics%$-->`;
    }

    async init() {
        const inputs = document.querySelectorAll(".otp-field > input");
		const button = document.querySelector(".btn");
		const invalid_input = document.querySelector("#invalid_input");

		window.addEventListener("load", () => inputs[0].focus());
		button.setAttribute("disabled", "disabled");

		inputs[0].addEventListener("paste", function (event) {
		event.preventDefault();
		console.log("addEventListener called");

		const pastedValue = (event.clipboardData || window.clipboardData).getData(
			"text"
		); //입력된 값을 저장하는 변수
		copiedvalue = pastedValue;
		const otpLength = inputs.length;

		for (let i = 0; i < otpLength; i++) {
			if (i < pastedValue.length) {
			inputs[i].value = pastedValue[i];
			inputs[i].removeAttribute("disabled");
			inputs[i].focus;
			} else {
			inputs[i].value = ""; // Clear any remaining inputs
			inputs[i].focus;
			}
		}
		});

		inputs.forEach((input, index1) => {
		input.addEventListener("keyup", (e) => {
			let currentInput = input;
			let nextInput = input.nextElementSibling;
			let prevInput = input.previousElementSibling;

			invalid_input.innerHTML = '';
			if (currentInput.value.length > 1) {
			currentInput.value = "";
			return;
			}

			if (
			nextInput &&
			nextInput.hasAttribute("disabled") &&
			currentInput.value !== ""
			) {
			nextInput.removeAttribute("disabled");
			nextInput.focus();
			}

			if (e.key === "Backspace") {
			inputs.forEach((input, index2) => {
				if (index1 <= index2 && prevInput) {
				input.setAttribute("disabled", true);
				input.value = "";
				prevInput.focus();
				}
			});
			}

			button.classList.remove("active");
			button.setAttribute("disabled", "disabled");

			const inputsNo = inputs.length;
			if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
			button.classList.add("active");
			button.removeAttribute("disabled");

			// Clear all inputs and reset the form
			invalid_input.innerHTML = '<p class="PS2P_font" style="color: red; z-index:4">INVALID INPUT "INSERT COIN"</p>';
			const otpLength = inputs.length;
			for (let i = 0; i < otpLength; i++) {
			inputs[i].value = "";
			inputs[i].setAttribute("disabled", "disabled");
			}
			inputs[0].removeAttribute("disabled");
			inputs[0].focus();
			}
		});
		});

	}
}