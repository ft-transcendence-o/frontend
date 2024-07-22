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
	
			<!-- Next Button -->
			<button type="button" style=" z-index: 4; margin-top: 640px; font-size: 50px; width: 230px; height: 139px;" class="btn btn-outline-primary PS2P_font">NEXT </button>
	
	
			<!-- footer -->
			<div class="row" style="position:absolute; padding-top:824px; z-index: 3;">
				<div class="col-12">
					<p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 34px; font-size: 30px;">SCAN THE QR-CODE</p>
					<p class="m-0 text-center text-white PS2P_font" style="padding-bottom: 0px; font-size: 30px;">VIA GOOGLE OTP/AUTHENTICATOR</p>
				</div>
			</div>
				
		</div>
	
		`;
    }

    async init() {
		function next_click(event) {
            event.preventDefault(); // 기본 동작 방지
            // 사용자를 42 인증 페이지로 리다이렉트
            // query parameter(?다음) 부분을 환경변수로 대체해야 한다.
            navigateTo('/OTP');
        }
		
		const qr_button = document.querySelector("button");
		qr_button.addEventListener("click", next_click);

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

		// qr uri -> local storage에서 불러오기
		// generateQRcode(불러온 uri)
		};
		console.log(localStorage.getItem('jwt'));
		const response = await fetch("http://10.19.218.225:8000/user-management/otp/qrcode", {
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