import { navigateTo } from "../../router.js";
import AbstractView from "./AbstractView.js";

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
			
			<img class="backimg" src="./image/background_2.png" alt="">
	
			<!-- QR Code -->
			<div id="qrcode" style="position:absolute; top: 171px; z-index: 1;">
			</div>


			<!-- 넥스트 Button -->
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

        Next_Button.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("next button clicked!");
            navigateTo('/OTP');
        });

        Next_Button.addEventListener("mouseenter", () => {
            Next_Button.classList.remove("blue_outline");
            Next_Button.classList.add("green_outline");
            Next_Button.classList.add("blue_font_white_stroke_3px");
        });

        Next_Button.addEventListener("mouseleave", () => {
            Next_Button.classList.add("blue_outline");
            Next_Button.classList.remove("green_outline");
            Next_Button.classList.remove("blue_font_white_stroke_3px");
        });

		function generateQRcode(otpUri) {
			const qrCodeDiv = document.getElementById('qrcode');
			new QRCode(qrCodeDiv, {
				text: otpUri,
				width: 300, // QR 코드의 너비
				height: 300, // QR 코드의 높이
				colorDark: "#14FF00", // QR 코드의 색상
				colorLight: "#000000", // QR 코드의 배경색
				correctLevel: QRCode.CorrectLevel.H // 오류 수정 수준
			});
		console.log("generated");
		};

		console.log(localStorage.getItem('jwt'));
		// qr uri -> local storage에서 불러오기
		// generateQRcode(불러온 uri)
		const response = await fetch("http://localhost:8000/user-management/otp/qrcode", {
                    method: "GET",
                    headers: {
						'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const jsonResponse = await response.json();
                    console.log("success");
                    console.log(response);
                    console.log(jsonResponse);
                    console.log(jsonResponse['otpauth_uri']); //await으로 해결
					generateQRcode(jsonResponse['otpauth_uri']);
				} else {
                    const jsonResponse = await response.json();
					console.log("Fail");
					console.log(response);
					console.log(jsonResponse);
				}
	}
}