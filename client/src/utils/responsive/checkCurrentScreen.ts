import { QUERIES } from "../../components/responsive/breakpoints";

interface ScreenInfo {
    device: 'mobile' | 'tablet' | 'laptop' | 'desktop';
    isMobile: boolean;
}

const isDeviceMobileOrTablet = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const hasTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // 모바일 체크
    const isMobile = (userAgent.includes('mobile') || 
                     userAgent.includes('android') || 
                     userAgent.includes('iphone'));
    
    // 태블릿 체크
    const isTablet = (userAgent.includes('ipad') || 
                     userAgent.includes('tablet') ||
                     (userAgent.includes('android') && !userAgent.includes('mobile')));
    
    return (isMobile || isTablet) && hasTouch;
}

const checkCurrentScreen = (): ScreenInfo => {
    // 화면 크기 체크
    const isMobileScreen = window.matchMedia(QUERIES.mobile).matches;
    const isTabletScreen = window.matchMedia(QUERIES.tablet).matches;
    const isLaptopScreen = window.matchMedia(QUERIES.laptop).matches;
    const isDesktopScreen = window.matchMedia(QUERIES.desktop).matches;

    if (isMobileScreen) {
        return { device: 'mobile', isMobile: isDeviceMobileOrTablet() };
    } else if (isTabletScreen) {
        return { device: 'tablet', isMobile: isDeviceMobileOrTablet() };
    } else if (isLaptopScreen) {
        return { device: 'laptop', isMobile: isDeviceMobileOrTablet() };
    } else if (isDesktopScreen) {
        return { device: 'desktop', isMobile: isDeviceMobileOrTablet() };
    }

    // 기본값 반환
    return { device: 'desktop', isMobile: isDeviceMobileOrTablet() };
};

export default checkCurrentScreen;