const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

const kakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    
    const isMobile = () => {
        // 화면 크기 체크
        const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;
        // 터치 기능 체크
        const hasTouchScreen = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        
        return isSmallScreen && hasTouchScreen;
    };
    
    if (isMobile()) {
        window.location.href = KAKAO_AUTH_URL;
    } else {
        window.open(KAKAO_AUTH_URL, '_blank', 'width=500,height=600');
    }
}

export default kakaoLogin;