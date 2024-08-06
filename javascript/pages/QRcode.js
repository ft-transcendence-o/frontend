import { navigateTo, baseUrl } from "../../router.js";
import AbstractView from "./AbstractView.js";

// 소독 sanitize input
function sanitizeInput(input) {
	const element = document.createElement('div');
	element.textContent = input;	// The textContent property will convert the input into a text node, escaping the special characters.
	return element.innerHTML;
}

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("QRcode");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `
		

		<!-- background image -->
	
		<div class="container-fluid d-flex flex-column align-items-center">
			
			<!-- blue outline background -->
			<div class="row justify-content-center blue_outline" style="background-color: black; margin-top: 20px; position: absolute; width: 1408px; height: 992px; top: 0px; z-index: 1;">
	
				<!-- QR Code -->
				<div id="qrcode" class="d-flex justify-content-center" style="position:absolute; top: 171px; z-index: 2;">
				</div>


				<!-- NEXT Button -->
				<button id="next_button" type="button" style="background-color: black; z-index: 4; margin-top: 600px; width: 280px; height: 139px;" class="blue_outline PS2P_font">
					<span style="font-size: 50px; line-height: 50px;">NEXT</span>
					<span style="font-size: 20px; line-height: 20px;">(ENTER)</span>
				</button>
		
		
				<!-- footer -->
				<div class="row" style="position:absolute; margin-top:824px; z-index: 3;">
					<div class="col-12">
						<p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 34px; font-size: 30px;">SCAN THE QR-CODE</p>
						<p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 0px; font-size: 30px;">VIA GOOGLE OTP/AUTHENTICATOR</p>
					</div>
				</div>
				
		</div>
		`;
    }

    async init() {

		/* 넥스트 Button */
        const Next_Button = document.querySelector("#next_button");

		const handleNextButtonClick = (event) => {
			event.preventDefault();
			console.log("next button clicked!");
			navigateTo('/OTP');
		};

		const handleMouseEnter = () => {
			Next_Button.classList.remove("blue_outline");
			Next_Button.classList.add("green_outline");
			Next_Button.classList.add("blue_font_white_stroke_3px");
		};

		const handleMouseLeave = () => {
			Next_Button.classList.add("blue_outline");
			Next_Button.classList.remove("green_outline");
			Next_Button.classList.remove("blue_font_white_stroke_3px");
		};

		const handleKeyDown = (event) => {
			if (event.key === "Enter") {
				Next_Button.click();
			}
		};

		Next_Button.addEventListener("click", handleNextButtonClick);
		Next_Button.addEventListener("mouseenter", handleMouseEnter);
		Next_Button.addEventListener("mouseleave", handleMouseLeave);
		document.addEventListener("keydown", handleKeyDown);

		function generateQRcode(otpUri) {
			const qrCodeDiv = document.getElementById('qrcode');
			new QRCode(qrCodeDiv, {
				text: sanitizeInput(otpUri),
				width: 300, // QR 코드의 너비
				height: 300, // QR 코드의 높이
				colorDark: "#14FF00", // QR 코드의 색상
				colorLight: "#000000", // QR 코드의 배경색
				correctLevel: QRCode.CorrectLevel.H // 오류 수정 수준
			});
			console.log("generated");
		};

        try {
            const response = await fetch(baseUrl + "/api/user-management/otp/qrcode", {
				method: "GET",
				credentials: 'include',
			});

            if (response.ok) {
                const jsonResponse = await response.json();
                console.log("success", jsonResponse);
                generateQRcode(jsonResponse['otpauth_uri']);
            } else {
                const jsonResponse = await response.json();
                console.log("Fail", jsonResponse);
                if (response.status === 401) {
                    navigateTo('/');
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            navigateTo('/');
        }

		// 제거할 이벤트 리스터들을 한곳에 저장
		this.cleanup = () => {
			Next_Button.removeEventListener("click", handleNextButtonClick);
			Next_Button.removeEventListener("mouseenter", handleMouseEnter);
			Next_Button.removeEventListener("mouseleave", handleMouseLeave);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}

	destroy() {
		if (this.cleanup) {
			this.cleanup();
		}
	}

}