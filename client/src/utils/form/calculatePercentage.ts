// 화폐 거래시에 잔고에서 몇 %를 가져올 것인지 계산
export default function calculatePercentage(percentage: string) {
    switch (percentage) {
        case '10%':
            return 0.1;
        case '25%':
            return 0.25;
        case '50%':
            return 0.5;
        case '75%':
            return 0.75;
        case '100%':
            return 1;
        default:
            return 0; // 유효하지 않은 퍼센트 값에 대해 기본값 반환
    }
}