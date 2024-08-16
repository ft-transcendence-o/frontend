import { navigateTo, baseUrl } from "../../router.js";
import AbstractView from "./AbstractView.js";
import { get_translated_value } from "../../language.js"

// 소독 sanitize input
function sanitizeInput(input) {
	const element = document.createElement('div');
	element.textContent = input;	// The textContent property 가 특수문자를 escaping하면서 입력값을 text node로 변환.
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
					<p class="transItem" style="font-size: 50px; line-height: 50px; padding-top: 15px;" data-trans_id="QR_next">NEXT</p>
					<p style="font-size: 20px; line-height: 20px;">(ENTER)</p>
				</button>
		
		
				<!-- footer -->
				<div class="row" style="position:absolute; margin-top:824px; z-index: 3;">
					<div class="col-12">
						<p class="m-0 text-center text-white PS2P_font transItem" style="padding-bottom: 34px; font-size: 30px;" data-trans_id="QR_text1">SCAN THE QR-CODE</p>
						<p class="m-0 text-center text-white PS2P_font transItem" style="padding-bottom: 0px; font-size: 30px;" data-trans_id="QR_text2">VIA GOOGLE OTP/AUTHENTICATOR</p>
					</div>
				</div>
				
		</div>
		`;
    }

    async init() {
		const transItems = document.querySelectorAll(".transItem");
        transItems.forEach( (transItem) => {
            transItem.innerHTML = get_translated_value(transItem.dataset.trans_id);
        })

		/* 넥스트 Button */
        const Next_Button = document.querySelector("#next_button");

		const handleNextButtonClick = (event) => {
			event.preventDefault();
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
		};

        try {
            const response = await fetch(baseUrl + "/api/user-management/otp/qrcode", {
				method: "GET",
				credentials: 'include',
			});

            if (response.ok) {
                const jsonResponse = await response.json();
                generateQRcode(jsonResponse['otpauth_uri']);
            } else {
                const jsonResponse = await response.json();
				if (response.status === 400) { // 400(Bad request) 문법상 오류가 있어서 서버가 요청사항을 이해하지 못하는 경우로 잘못 입력한 url인 경우가 대부분! -> token은 유효 OTP를 이전에 한 번 통과한 사람이 bad request를 한 경우
                    navigateTo('/OTP');
				}
				else if (response.status === 403) { // 403(Forbidden) 로그인하여 인증되었지만 접근 권한이 없는 무언가를 요청하는 경우이다. (예: 정책상 인증 후 갈 필요가 없는 페이지로의 이동 요청) 예를 들어 어떤 쇼핑몰에 접속하여 로그인까지 하였지만, 다른 사용자의 결제 내역을 달라고 하면 403(Forbidden)을 반환 -> token 유효, OTP도 통과한 사람
					navigateTo('/main')
				}
                else if (response.status === 401) { // 401)(unauthorized)클라이언트가 인증되지 않았거나, 유효한 인증 정보가 부족하여 요청이 거부되었음을 의미하는 상태값 -> token이 없는사람
                    navigateTo('/');
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            navigateTo('/');
        }

		// 제거할 이벤트 리스너들을 한곳에 저장
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