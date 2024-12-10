import { QUERIES } from "../../responsive/breakpoints";

const checkCurrentScreen = () => {
    // 화면 크기 체크
    const isMobileScreen = window.matchMedia(QUERIES.mobile).matches;
    const isTabletScreen = window.matchMedia(QUERIES.tablet).matches;
    const isDesktopScreen = window.matchMedia(QUERIES.desktop).matches;

    // 터치 기능 체크
    const hasTouchScreen = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isMobileScreen && hasTouchScreen) {
        return 'mobile';
    } else if (isTabletScreen && hasTouchScreen) {
        return 'tablet';
    } else if (isDesktopScreen) {
        return 'desktop';
    }
};

export default checkCurrentScreen;