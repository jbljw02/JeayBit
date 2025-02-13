import axios from 'axios';
import applyConverters from 'axios-case-converter';

// axios의 기본 인스턴스에 converter 적용
const instance = applyConverters(axios);

export default instance;