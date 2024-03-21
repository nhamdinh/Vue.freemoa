import AVA49 from '@/assets/svg/AVA79.svg'

export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN ?? ''
export const SOCKET_DOMAIN = import.meta.env.VITE_SOCKET_DOMAIN ?? ''
export const AAA = 'AAA aaaa'
export const NAME_STORAGE = 'name'
export const ACCESSTOKEN_STORAGE = 'accessToken'
export const dataArticleIds_STORAGE = 'dataArticleIds'
export const fromPath_STORAGE = 'fromPath'
export const DATE_DOT = 'YYYY.MM.DD'
export const AM_PM = 'hh:mm A'
export const PAGESIZE_10 = 10
export const PAGESIZE_6 = 8
export const PAGESIZE_8 = 8
export const PAGESIZE_5 = 5
export const PAGESIZE_100 = 100
export const SLIDE_5000 = 5000
export const sizeMax = 10 * 1024 * 1024
export const IS_FILE = 'FiLeNaMe="'
export const IS_IMG = 'ImAGe"'

/* regex */
export const regexNotAllowNumber = /^([^0-9]*)$/;
export const regexNotAllowNumberAndSpecialCharecter = /^[a-zA-Z_ ]*$/g;
export const regexOnlyNumber = /^[0-9\b]+$/;
export const regexPassword = /^(?=.*[0-9])(?=.*[a-z]).{8,20}$/
export const regexUsername = /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/g
export const REGEX_CURRENCY = /(\d)(?=(\d{3})+(?!\d))/g
/* regex */
export const COMMUNITY = 'COMMUNITY'
export const PRODUCT_REVIEW = 'PRODUCT_REVIEW'
export const NEWS = 'NEWS'
export const NOTIFICATION = 'NOTIFICATION'
// export const TO_LOGIN = 'MOVE TO LOGIN PAGE?'
export const TO_LOGIN = '로그인 페이지로 \n이동하시겠습니까?'
export const SUCCESS = '성공적인 조작.'
export const SAVE_SUCCESS = '저장완료'
export const COMPLETE_SUCCESS = '신고 완료'
export const FAIL = '발송 실패하였습니다.\n다시 시도해 주세요.'
export const CONNECT_FAIL = '정보 조회를 실패하였습니다.\n다시 시도해 주세요.'
export const WRONG_PHONE = '이미 가입된 휴대폰 번호 입니다.'
export const CORRECT_OTP = '휴대폰 인증에 성공하였습니다.'
export const INCORRECT_OTP = '인증번호가 틀렸습니다.'

export const UPTEM = 'https://media.licdn.com/dms/image/C560BAQH3WPHa5DuuSg/company-logo_100_100/0/1657699867432?e=2147483647&v=beta&t=Yg8kCUxBXApsnuEi1V8nNUKtKx5-lZ87SAdAT0cOP0A'
export const AVA = AVA49


