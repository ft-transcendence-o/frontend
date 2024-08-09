// 언어별 dictionary 변수
// 매개변수에 따라 언어 반환

// data- 커스텀 속성을 사용해 번역id를 저장
// 클래스는 selector를 위해 모두 일괄적으로 적용
// 같은 클래스로 선택한 모든 element를 foreach내에서
// data- 커스텀 속성 안의 id값을 가지고 현재 로케일에 따른
// 번역된 문자열을 반환받고 그에 따라 innerText를 변경
// 어떤 언어 딕셔너리를 선택할지는 localStorage에 저장 -> 예외처리

// class - transItem
// data-trans_id

/*

MATCH-RECORD
LANGUAGE
LOGOUT
VS
1 ON 1
TOURNAMENT
SELECT GAME MODE

대전기록
언어
로그아웃
대
일 대 일
토너먼트
게임 방식을 선택하시오

対戦記録
げんご
ログアウト

*/

{
    var lang = {};

    lang.ko = {
        0: '자바스크립트 다국어 처리.',
        1: '안녕하세요',
        2: '오늘은 금요일 입니다.',
        3: '불금을 즐겨 보아요.'
    };

    lang.en = {
        0: 'Javascript Language Localization.',
        1: 'Hello.',
        2: 'Today is Friday',
        3: 'Fire~!!'
    };

    lang.ja = {
        0: 'JavaScriptの言語',
        1: 'こんにちは',
        2: '今日は金曜日です。',
        3: 'ガンバレ~!!'
    };
}

// ----

{
    const translations = {
        ko: {
            greeting: '안녕하세요',
            farewell: '안녕히 가세요'
        },
        en: {
            greeting: 'Hello',
            farewell: 'Goodbye'
        },
        ja: {
            greeting: 'こんにちは',
            farewell: 'さようなら'
        }
    };
}

// ----

export function get_translated_value(trans_id)
{
    let cur_locale = localStorage.getItem("locale");

    // locale 값이 훼손되었을 경우 기본값으로 복구
    if (translations[cur_locale] === null)
    {
        cur_locale = "en"
        localStorage.setItem("locale", cur_locale);
    }

    return translations[cur_locale][trans_id] || 'Invalid trans_id';
}

const translations = {
    en: {
        home_loading: 'LOADING...',
        home_login: 'LOG-IN',
        QR_text1: 'SCAN THE QR-CODE',
        QR_text2: 'VIA OTP/AUTHENTICATOR',
        QR_next: 'NEXT',
        OTP_text1: 'ENTER 6 DIGITS',
        OTP_text2: 'FROM OTP/AUTHENTICATOR',
        OTP_wrong: 'Incorrect password. Remaining attempts:',
        OTP_lock: 'Account is locked for 15 minutes.',
        main_button: '>MAIN<p style="font-size: 20px; margin-top: -12px;">(ESC)</p>',
        main_match_record: '>MATCH-RECORD',
        main_language: '>LANGUAGE',
        main_logout: '>LOGOUT',
        main_vs: 'VS',
        main_1ON1: '1 ON 1',
        main_TOURNAMENT: 'TOURNAMENT',
        main_select_mode: 'SELECT GAME MODE',
        logout_question1: 'OH, <br><br> YOU ARE LEAVING...',
        logout_question2: 'ARE YOU SURE?',
        logout_yes: 'YES,<br> LOG ME OUT',
        logout_no: 'NO,<br> JUST KIDDING',
        match_record_empty: 'There are no match data yet',
        match_record_playerA_field: 'PLAYER A',
        match_record_playerB_field: 'PLAYER B',
        match_record_score_field: 'SCORE',
        match_record_mode_field: 'MODE',
        match_record_mode_1ON1: '1 ON 1',
        match_record_mode_TOURNAMENT: 'TOURNAMENT',
        match_record_date_field: 'DATE',
        match_record_date_month_01: 'JAN',
        match_record_date_month_02: 'FEB',
        match_record_date_month_03: 'MAR',
        match_record_date_month_04: 'APR',
        match_record_date_month_05: 'MAY',
        match_record_date_month_06: 'JUN',
        match_record_date_month_07: 'JUL',
        match_record_date_month_08: 'AUG',
        match_record_date_month_09: 'SEP',
        match_record_date_month_10: 'OCT',
        match_record_date_month_11: 'NOV',
        match_record_date_month_12: 'DEC',
        nickname_text: 'ENTER A NICKNAME FOR EACH PLAYER',
        nickname_ready: 'READY!',
        match_schedules_TOURNAMENT: 'TOURNAMENT',
        match_schedules_start: 'START!',
        match_schedules_champion: 'CHAMPION!',
        again_1ON1: '1 ON 1<br>AGAIN?',
        again_TOURNAMENT: 'TOURNAMENT<br>AGAIN?',
        game_win: 'WIN',
    },
    ko: {
        home_loading: '로딩중...',
        home_login: '로그인',
        QR_text1: 'OTP/AUTHENTICATOR 앱으로',
        QR_text2: 'QR-CODE를 스캔해주세요',
        QR_next: '다음',
        OTP_text1: 'OTP/AUTHENTICATOR 앱의',
        OTP_text2: '숫자 6개를 입력해주세요',
        OTP_wrong: '잘못된 비밀번호입니다. 남은 시도횟수:',
        OTP_lock: '계정이 15분 동안 잠겼습니다.',
        main_button: '>메인<p style="font-size: 20px;">(ESC)</p>',
        main_match_record: '>대전기록',
        main_language: '>언어',
        main_logout: '>로그아웃',
        main_vs: '대',
        main_1ON1: '일 대 일',
        main_TOURNAMENT: '토너먼트',
        main_select_mode: '게임 방식을 선택하시오',
        logout_question1: '오, <br><br> 떠나시는군요...',
        logout_question2: '확실하신가요?',
        logout_yes: '네,<br> 로그아웃 시켜주세요',
        logout_no: '아니오,<br> 농담이였어요',
        match_record_empty: '아직 경기 데이터가 없습니다',
        match_record_playerA_field: '플레이어 A',
        match_record_playerB_field: '플레이어 B',
        match_record_score_field: '점수',
        match_record_mode_field: '모드',
        match_record_mode_1ON1: '1 대 1',
        match_record_mode_TOURNAMENT: '토너먼트',
        match_record_date_field: '날짜',
        match_record_date_month_01: '01월',
        match_record_date_month_02: '02월',
        match_record_date_month_03: '03월',
        match_record_date_month_04: '04월',
        match_record_date_month_05: '05월',
        match_record_date_month_06: '06월',
        match_record_date_month_07: '07월',
        match_record_date_month_08: '08월',
        match_record_date_month_09: '09월',
        match_record_date_month_10: '10월',
        match_record_date_month_11: '11월',
        match_record_date_month_12: '12월',
        nickname_text: '각 플레이어의 닉네임을 입력해주세요',
        nickname_ready: '준비!',
        match_schedules_TOURNAMENT: '토너먼트',
        match_schedules_start: '시작!',
        match_schedules_champion: '챔피언!',
        again_1ON1: '일 대 일<br>한판 더?',
        again_TOURNAMENT: '토너먼트<br>한판 더?',
        game_win: '승리',
    },
    jp: {
        home_loading: 'ローディング中...',
        home_login: 'ログイン',
        QR_text1: 'OTP/AUTHENTICATORで',
        QR_text2: 'QRコードをスキャンをお願いします',
        QR_next: '次へ',
        OTP_text1: 'OTP/AUTHENTICATORから',
        OTP_text2: '6桁の数字の入力をお願いします',
        OTP_wrong: 'パスワードが正しくありません。 残りの試行回数:',
        OTP_lock: 'アカウントは15分間ロックされています.',
        main_button: '>メイン<p style="font-size: 20px;">(ESC)</p>',
        main_match_record: '>対戦記録',
        main_language: '>げんご',
        main_logout: '>ログアウト',
        main_vs: '対',
        main_1ON1: '一 対 一',
        main_TOURNAMENT: 'トーナメント',
        main_select_mode: 'ゲーム方法を選択してください',
        logout_question1: 'ああ、 <br><br> あなたは去ります···',
        logout_question2: '本気ですか?',
        logout_yes: 'はい、<br> ログアウトします',
        logout_no: 'いいえ、<br> 冗談です',
        match_record_empty: 'まだ試合データがありません',
        match_record_playerA_field: 'プレーヤ A',
        match_record_playerB_field: 'プレーヤ B',
        match_record_score_field: 'スコア',
        match_record_mode_field: 'モード',
        match_record_mode_1ON1: '一 対 一',
        match_record_mode_TOURNAMENT: 'トーナメント',
        match_record_date_field: '日付',
        match_record_date_month_01: '01月',
        match_record_date_month_02: '02月',
        match_record_date_month_03: '03月',
        match_record_date_month_04: '04月',
        match_record_date_month_05: '05月',
        match_record_date_month_06: '06月',
        match_record_date_month_07: '07月',
        match_record_date_month_08: '08月',
        match_record_date_month_09: '09月',
        match_record_date_month_10: '10月',
        match_record_date_month_11: '11月',
        match_record_date_month_12: '12月',
        nickname_text: '各プレイヤーのニックネームを入力します',
        nickname_ready: 'レディー!',
        match_schedules_TOURNAMENT: 'トーナメント',
        match_schedules_start: 'スタート!',
        match_schedules_champion: 'チャンピオン!',
        again_1ON1: '一 対 一<br>もう一回?',
        again_TOURNAMENT: 'トーナメント<br>もう一回?',
        game_win: '勝利',
    },
};