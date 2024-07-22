
// async function generateQRCode(otpauthUri) {
//     const qrCodeDiv = document.getElementById('qrcode');
//     // qrCodeDiv.innerHTML = '';
//     new QRCode(qrCodeDiv, {
//         text: "https://naver.com",
//         width: 128, // QR 코드의 너비
//         height: 128, // QR 코드의 높이
//         colorDark: "#000000", // QR 코드의 색상
//         colorLight: "#ffffff", // QR 코드의 배경색
//         correctLevel: QRCode.CorrectLevel.H // 오류 수정 수준
//     });
//     console.log("generated");
// }

// generateQRCode("");

// document.addEventListener('DOMContentLoaded', () => {
//     const qrCodeDiv = document.getElementById('qrcode');
//     // qrCodeDiv.innerHTML = '';
//     new QRCode(qrCodeDiv, {
//         text: "otpauth://totp/pong_game:junssong%40student.42seoul.kr?secret=MY7BWA75VK3QURWCPM3PHGCMDPAHDNLC&issuer=pong_game",
//         width: 300, // QR 코드의 너비
//         height: 300, // QR 코드의 높이
//         colorDark: "#14FF00", // QR 코드의 색상
//         colorLight: "#000000", // QR 코드의 배경색
//         correctLevel: QRCode.CorrectLevel.H // 오류 수정 수준
//     });
//     console.log("generated");
// })

export function generateQRcode(otpUri) {
    const qrCodeDiv = document.getElementById('qrcode');
    // qrCodeDiv.innerHTML = '';
    new QRCode(qrCodeDiv, {
        text: otpUri,
        width: 300, // QR 코드의 너비
        height: 300, // QR 코드의 높이
        colorDark: "#14FF00", // QR 코드의 색상
        colorLight: "#000000", // QR 코드의 배경색
        correctLevel: QRCode.CorrectLevel.H // 오류 수정 수준
    });
    console.log("generated");
}