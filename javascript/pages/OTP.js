import { navigateTo, baseUrl } from "../../router.js";
import AbstractView from "./AbstractView.js";
import { get_translated_value } from "../../language.js"

// 소독 sanitize input
function sanitizeInput(input) {
	const element = document.createElement('div');
	element.textContent = input;	// The textContent property will convert the input into a text node, escaping the special characters.
	return element.innerHTML;
}

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("OTP");
    }

    /**
     * @returns app div에 그려낼 해당 view의 html을 반환합니다.
     */
    async getHtml() {
        return `
		<div class="container-fluid d-flex flex-column align-items-center">
        
        <!-- blue outline background -->
			<div class="row justify-content-center blue_outline" style="background-color: black; margin-top: 20px; position: absolute; width: 1408px; height: 992px; top: 0px; z-index: 1;">

        <!-- Start DEMO HTML (Use the following code into your project)-->
        <!-- <body class="container-fluid bg-body-tertiary d-block"> -->
    <div class="row justify-content-center">
        <div class="col-12">
        <div class="card bg-black" style="z-index: 4; margin-top: 200px;">
            <div class="card-body p-5 text-center">

				<div class="otp-field mb-4">
					<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" />

					<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
					
					<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />

					<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
					
					<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
					
					<input type="number" class="PS2P_font" style="width:150px; height:300px; border-color: #14FF00; border-width: 10px; background-color:black; color:white; font-size: 100px;" disabled />
				</div>

				<!-- invalid input -->
				<div id="invalid_input"></div>

            </div>
        </div>
        </div>
    </div>

        <!-- footer -->
        <div class="row" style="position:absolute; padding-top:824px; z-index: 3;">
            <div class="col-12">
                <p class="m-0 text-center text-white PS2P_font transItem" style="padding-bottom: 34px; font-size: 30px;" data-trans_id="OTP_text1">ENTER 6 DIGITS</p>
                <p class="m-0 text-center text-white PS2P_font transItem" style="padding-bottom: 0px; font-size: 30px;" data-trans_id="OTP_text2">FROM GOOGLE OTP/AUTHENTICATOR</p>
            </div>
        </div>
	</div>
    <!-- </body> -->
    
    <!-- Script JS -->
    <script type="module" src="./javascript/OTP.js"></script>

    <script src="./bootstrap-5.3.3-dist/js/bootstrap.min.js"></script>
    <!--$%analytics%$-->`;
    }

    async init() {

        try {
            const response = await fetch(baseUrl + "/api/user-management/auth-status", {
                method: "GET",
                credentials: 'include',
            });
            if (response.ok) {  // status === 200이고 이곳에서 response.json()을 까보고 분기
                console.log("api confirm");
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                if (jsonResponse.otp_authenticated)
                {
                    navigateTo('/main');
                    return;
                }
            } else if (response.status === 401) {
                console.log("response is 401!");
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                navigateTo('/');
            } else {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                console.log("error");
            }
        } catch (error) {
            console.log("Fetch error:", error);
        }

        const transItems = document.querySelectorAll(".transItem");
        transItems.forEach( (transItem) => {
            transItem.innerHTML = get_translated_value(transItem.dataset.trans_id);
        })

        const inputs = document.querySelectorAll(".otp-field > input");
        const invalid_input = document.querySelector("#invalid_input");

        requestAnimationFrame(() => inputs[0].focus());

        invalid_input.setAttribute("disabled", "disabled");
    
        inputs[0].addEventListener("paste", function (event) {
            event.preventDefault();
            const pastedValue = sanitizeInput((event.clipboardData || window.clipboardData).getData("text")); //입력된 값을 저장하는 변수
            const otpLength = inputs.length;
    
            for (let i = 0; i < otpLength; i++) {
                if (i < pastedValue.length) {
                    inputs[i].value = pastedValue[i];
                    inputs[i].removeAttribute("disabled");
                    inputs[i].focus();
                } else {
                    inputs[i].value = ""; // Clear any remaining inputs
                    inputs[i].focus();
                }
            }
        });
    
        inputs.forEach((input, index1) => {
            input.addEventListener("keyup", async (e) => {
                let currentInput = input;
                let nextInput = input.nextElementSibling;
                let prevInput = input.previousElementSibling;
    
                invalid_input.innerHTML = '';
                if (currentInput.value.length > 1) {
                    currentInput.value = "";
                    return;
                }
    
                if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
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
        
                const inputsNo = inputs.length;
                if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== "") {
                    // Clear all inputs and reset the form
                    let OTPNumber = "";
                    for (let i = 0; i < 6; i++) {
                        OTPNumber += inputs[i].value.toString();
                    }

                    try {
                        const response = await fetch(baseUrl + "/api/user-management/otp/verify", {
                            method: "POST",
                            credentials: 'include',
                            body: JSON.stringify({ "input_password": OTPNumber })
                        });

                        if (response.ok) {
                            navigateTo('/main');
                        } else {
                            if (response.status === 400) {
                                const jsonResponse = await response.json();
                                const attempts_number = sanitizeInput(jsonResponse['remain_attempts']);
                                invalid_input.innerHTML = `<p class="PS2P_font transItem" style="color: red; font-size: 30px; z-index:4" data-trans_id="OTP_wrong">Incorrect password. Remaining attempts: ${attempts_number}</p>`;
                                invalid_input.querySelector("p").innerHTML = get_translated_value(invalid_input.querySelector("p").dataset.trans_id) + ` ${attempts_number}`;
                            } else if (response.status === 403) {
                                invalid_input.innerHTML = `<p class="PS2P_font transItem" style="color: red; font-size: 30px; z-index:4" data-trans_id="OTP_lock">Account is locked for 15 minutes.<br>try later</p>`;
                                invalid_input.querySelector("p").innerHTML = get_translated_value(invalid_input.querySelector("p").dataset.trans_id);
                            } else {
                                // localStorage.removeItem('jwt');
                                navigateTo('/');
                            }

                            inputs.forEach(input => {
                                input.value = "";
                                input.setAttribute("disabled", "disabled");
                            });
                            inputs[0].removeAttribute("disabled");
                            inputs[0].focus();
                        }
                    } catch (error) {
                        console.error("Fetch error:", error);
                        navigateTo('/');
                    }
                }
            });
        });
    }
}
