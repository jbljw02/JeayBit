export const BREAKPOINTS = {
    mobile: 767, // 모바일: ~767px
    tablet: 1023, // 태블릿: 768px ~ 1023px
    laptop: 1024, // 데스크톱: 1024px ~
    desktop: 1280, // 데스크톱: 1280px ~
} as const;

// 미디어 쿼리 헬퍼
export const QUERIES = {
    mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
    tablet: `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`,
    laptop: `(min-width: ${BREAKPOINTS.laptop}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
    desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
} as const;