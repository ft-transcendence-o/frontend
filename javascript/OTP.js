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
