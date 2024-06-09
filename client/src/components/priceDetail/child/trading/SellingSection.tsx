import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, setIsSelling, setSellingPrice } from "../../../../redux/store";
import useFunction from "../../../useFuction";

export default function SellingSectioin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const cr_market_selected = useSelector((state: RootState) => state.cr_market_selected);
    const cr_name_selected = useSelector((state: RootState) => state.cr_name_selected);
    const user = useSelector((state: RootState) => state.user);
    const asking_data = useSelector((state: RootState) => state.asking_data);  // bid = 매수, ask = 매도
    const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);

    const [selectedPercentage, setSelectedPercentage] = useState<string>('');
    const [bidSort, setBidSort] = useState<string>('지정가');

    const sellingPrice = useSelector((state: RootState) => state.sellingPrice);
    const [sellTotal, setSellTotal] = useState<number>(0);
    const [sellQuantity, setSellQuantity] = useState<number>(0);

    const [quantityInputValue, setQuantityInputValue] = useState('0');
    const [totalInputValue, setTotalInputvalue] = useState('0');
    const [sellingInputValue, setSellingInputValue] = useState('0');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

    // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
    // eslint-disable-next-line
    const [tradeCategory, setTradeCategory] = useState<string>('매도');

    // 현재 시간을 저장하는 state
    // eslint-disable-next-line
    const [time, setTime] = useState(new Date());

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    const completeToggleModal = () => {
        setCompleteModalOpen(!completeModalOpen);
    }

    const { getBalance, getOwnedCrypto, addTradeHistory, getTradeHistory } = useFunction();

    // 매도가가 바뀌면 그에 따라 입력값도 변경
    useEffect(() => {
        setSellingInputValue(sellingPrice.toString());
    }, [sellingPrice])

    // 선택 화폐가 바뀔 때마다 주문 가능한 보유 화폐량을 변경하고, 주문 수량 및 총액을 초기화
    useEffect(() => {
        // 주문 수량
        setSellQuantity(0);
        setQuantityInputValue('0');

        // 주문 총액
        setSellTotal(0);
        setTotalInputvalue('0');
    }, [cr_name_selected])

    // 호가와 매도가가 일치할 때
    const sellCrypto = (email: string, cryptoName: string, cryptoQuantity: number, sellTotal: number) => {
        (async (email, cryptoName, cryptoQuantity, sellTotal) => {
            try {
                await axios.post("http://127.0.0.1:8000/sell_crypto/", {
                    email: email,
                    crypto_name: cryptoName,
                    crypto_quantity: cryptoQuantity,
                    sell_total: sellTotal,
                });
                // console.log("매도 화폐 전송 성공", response.data);
                getBalance(user.email);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
                getOwnedCrypto(user.email);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
                getTradeHistory(user.email);  // 매도했으니 업데이트 됐을 거래내역을 가져옴 
                completeToggleModal();
            } catch (error) {
                // console.log("매도 화폐 전송 실패: ", error);
            }
        })(email, cryptoName, cryptoQuantity, sellTotal);
    }

    const selectPercentage = (percentage: string) => {
        setSelectedPercentage(percentage)

        // 선택된 화폐의 보유 수량
        let availableQuantity = ownedCrypto.find((item) => item.crypto_name === cr_name_selected)?.quantity

        // 매수가격이 0이면 주문수량/주문총액은 의미가 없고, 보유 화폐량이 undefined이면 연산이 불가능 
        if (sellingInputValue !== '0' && availableQuantity !== undefined) {

            // 현재 화폐 보유량 기준 퍼센테이지를 '주문수량'에 할당하고, 주문수량이 매도 가격의 어느 정도 비율을 차지하는지를 계산하여 '주문총액'에 할당
            if (percentage === '10%') {
                let dividedQuantity = availableQuantity * 0.10;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                let dividedTotal = sellingPrice * dividedQuantity
                dividedTotal = Math.ceil(dividedTotal);

                // 주문 수량
                setSellQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());

                // 주문 총액
                setSellTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
            }
            if (percentage === '25%') {
                let dividedQuantity = availableQuantity * 0.25;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                let dividedTotal = sellingPrice * dividedQuantity
                dividedTotal = Math.ceil(dividedTotal);

                // 주문 수량
                setSellQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());

                // 주문 총액
                setSellTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
            }
            if (percentage === '50%') {
                let dividedQuantity = availableQuantity * 0.50;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                let dividedTotal = sellingPrice * dividedQuantity
                dividedTotal = Math.ceil(dividedTotal);

                // 주문 수량
                setSellQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());

                // 주문 총액
                setSellTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
            }
            if (percentage === '75%') {
                let dividedQuantity = availableQuantity * 0.75;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                let dividedTotal = sellingPrice * dividedQuantity
                dividedTotal = Math.ceil(dividedTotal);

                // 주문 수량
                setSellQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());

                // 주문 총액
                setSellTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
            }
            if (percentage === '100%') {
                let dividedQuantity = availableQuantity;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                let dividedTotal = sellingPrice * dividedQuantity
                dividedTotal = Math.ceil(dividedTotal);

                // 주문 수량
                setSellQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());

                // 주문 총액
                setSellTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
            }
        }
        else if (availableQuantity === undefined) {
            // 주문 수량
            setSellQuantity(0);
            setQuantityInputValue('0');

            // 주문 총액
            setSellTotal(0);
            setTotalInputvalue('0');
        }
    }

    return (
        <>
            {/* <ModalSumbit modalOpen={modalOpen} setModalOpen={setModalOpen} toggleModal={toggleModal} />
            <ModalComplete completeModalOpen={completeModalOpen} setCompleteModalOpen={setCompleteModalOpen} completeToggleModal={completeToggleModal} /> */}
            <table className="trading-headTable">
                <tr className="trading-choice">
                    <td className='radio'>
                        주문구분
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="radio">
                        <input type="radio" name="radio" id="radio1" className="radio-input" onClick={() => (setBidSort('지정가'))} checked={bidSort === '지정가'}></input>
                        <label className='radio-designate radio-label' htmlFor="radio1">
                            지정가
                        </label>
                    </td>
                    <td className="radio">
                        <input type="radio" name="radio" id="radio2" className="radio-input" onClick={() => (setBidSort('시장가'))} checked={bidSort === '시장가'}></input>
                        <label className='radio-market radio-label' htmlFor="radio2">
                            시장가
                        </label>
                    </td>
                    {/* <td className="radio">
              <input type="radio" name="radio" id="radio3" className="radio-input" onClick={() => (setBidSort('예약가'))} checked={bidSort === '예약가'}></input>
              <label className="radio-reserve radio-label" htmlFor="radio3">
                예약/지정가
              </label>
            </td> */}
                </tr>
            </table>
            {
                // 매도 - 지정가 영역
                bidSort === '지정가' ?
                    <>
                        <table className="trading-table">
                            <tr>
                                <td className='trading-category'>주문가능</td>
                                <td className="trading-availableTrade">
                                    {
                                        // 보유수량이 undefined 또는 null일 때 0 반환
                                        (Array.isArray(ownedCrypto) && ownedCrypto.find((item) => item.crypto_name === cr_name_selected)?.quantity) || '0'
                                    }
                                    <span>{(cr_market_selected).slice(4)}</span>
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>매도가격</td>
                                <td className="td-input">
                                    <div>
                                        <input type="text"
                                            value={sellingInputValue}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // 매도가격을 변경했음에도 매도 대기 여부가 true이면 의도치 않게 매도가 완료될 수 있으니, 매도가를 변경했을 때는 매도 대기 여부를 false로 처리
                                                setIsSelling(false);

                                                // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                                                if (value[0] === '0' && value.length > 1) {
                                                    if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                                                        value = value.substring(1);
                                                    }
                                                }

                                                // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                                                value = value.replace(/(\..*)\./g, "$1");

                                                // 숫자와 "." 외의 문자를 제거
                                                value = value.replace(/[^0-9.]/g, "");

                                                // "."이 맨 처음에 오지 않도록 함
                                                if (value[0] === '.') {
                                                    value = '0' + value;
                                                }

                                                // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                                                if (value === '') {
                                                    value = '0';
                                                }

                                                dispatch(setSellingPrice(Number(value)));
                                                setSellingInputValue(value);
                                                setSellTotal(Math.floor(parseFloat(value) * sellQuantity));
                                                setTotalInputvalue((Math.floor(parseFloat(value) * sellQuantity)).toString());
                                            }}
                                        />
                                        <span>KRW</span>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} />
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>주문수량</td>
                                <td className="td-input">
                                    <div>
                                        <input type="text"
                                            value={quantityInputValue}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                                                if (value[0] === '0' && value.length > 1) {
                                                    if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                                                        value = value.substring(1);
                                                    }
                                                }

                                                // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                                                value = value.replace(/(\..*)\./g, "$1");

                                                // 숫자와 "." 외의 문자를 제거
                                                value = value.replace(/[^0-9.]/g, "");

                                                // "."이 맨 처음에 오지 않도록 함
                                                if (value[0] === '.') {
                                                    value = '0' + value;
                                                }

                                                // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                                                if (value === '') {
                                                    value = '0';
                                                }

                                                const decimalPart = (value.split('.')[1] || '').length;

                                                // 소수점 자릿수가 8자리 이하인 경우만
                                                if (decimalPart <= 8) {
                                                    setQuantityInputValue(value);
                                                    setSellQuantity(parseFloat(value));
                                                }

                                                setSellTotal(Math.floor(sellingPrice * parseFloat(value)))
                                                setTotalInputvalue((Math.floor(sellingPrice * parseFloat(value))).toString())
                                            }}
                                        />
                                        <span>
                                            {
                                                selectedCrypto && selectedCrypto.market ?
                                                    (selectedCrypto.market).slice(4) :
                                                    null
                                            }
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className="count-percentage">
                                    <span className={
                                        selectedPercentage === '10%' ?
                                            'sell-percentage' :
                                            'nonSelected-percentage'
                                    } onClick={() => (selectPercentage('10%'))}>10%</span>
                                    <span className={
                                        selectedPercentage === '25%' ?
                                            'sell-percentage' :
                                            'nonSelected-percentage'
                                    } onClick={() => (selectPercentage('25%'))}>25%</span>
                                    <span className={
                                        selectedPercentage === '50%' ?
                                            'sell-percentage' :
                                            'nonSelected-percentage'
                                    } onClick={() => (selectPercentage('50%'))}>50%</span>
                                    <span className={
                                        selectedPercentage === '75%' ?
                                            'sell-percentage' :
                                            'nonSelected-percentage'
                                    } onClick={() => (selectPercentage('75%'))}>75%</span>
                                    <span className={
                                        selectedPercentage === '100%' ?
                                            'sell-percentage' :
                                            'nonSelected-percentage'
                                    } onClick={() => (selectPercentage('100%'))}>100%</span>
                                </td>
                            </tr>
                            <tr>
                                <td className='trading-category'>주문총액</td>
                                <td className="td-input">
                                    <div>
                                        <input type="text"
                                            value={totalInputValue}
                                            onChange={(e) => {
                                                let value = e.target.value;

                                                // 첫 번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                                                if (value[0] === '0' && value.length > 1) {
                                                    if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                                                        value = value.substring(1);
                                                    }
                                                }

                                                // 입력값이 숫자인지 확인하고, 숫자 이외의 문자가 포함되어 있는지 확인
                                                const isNumber = /^[0-9]*$/.test(value);

                                                if (value === '') {
                                                    value = '0';
                                                }

                                                if (sellingInputValue !== '0') {

                                                    if (isNumber) {
                                                        setTotalInputvalue(value);
                                                        setSellTotal(parseFloat(value));

                                                        let dividiedQuantity = Number(value) / sellingPrice;

                                                        // 소수점 아래 8자리로 제한
                                                        if ((dividiedQuantity.toString().split('.')[1] || '').length > 8) {
                                                            dividiedQuantity = parseFloat(dividiedQuantity.toFixed(8));
                                                        }

                                                        setSellQuantity(dividiedQuantity);
                                                        setQuantityInputValue(dividiedQuantity.toString());
                                                    }
                                                }

                                            }}
                                        />
                                        <span>KRW</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        {
                            user.email !== '' ?
                                <div className="trading-submit-sell designate">
                                    <span onClick={() => {
                                        // 호가와 매도가가 일치하는지 확인
                                        let item = asking_data.find(item => item.bid_price === sellingPrice);
                                        if (item !== undefined) {
                                            // 일치한다면 바로 매수 요청을 전송
                                            sellCrypto(user.email, selectedCrypto.name, sellQuantity, sellTotal);
                                            addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, sellingPrice, sellTotal, sellQuantity, true);
                                            // getTradeHistory(user.email);
                                        }
                                        else {
                                            // 선택한 화폐에 대한 매도 대기 여부를 true로 설정
                                            let temp = localStorage.getItem(`${user.email}_IsSelling`)
                                            if (temp !== null) {
                                                let localStorage_isSelling = JSON.parse(temp);
                                                localStorage_isSelling[cr_name_selected] = true;
                                                localStorage.setItem(`${user.email}_IsSelling`, JSON.stringify(localStorage_isSelling));

                                                dispatch(setIsSelling(localStorage_isSelling))
                                            }

                                            // 일치하지 않는다면 대기 모달 팝업
                                            toggleModal();
                                            setModalOpen(!modalOpen);

                                            addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, sellingPrice, sellTotal, sellQuantity, false);
                                            // getTradeHistory(user.email);
                                        }
                                    }}>매도</span>
                                </div> :
                                <div className="trading-submit-nonLogIn-sell designate">
                                    <span onClick={() => { navigate('/logIn') }}>로그인</span>
                                    <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                                </div>
                        }
                    </> :
                    (
                        // 매도 - 시장가 영역
                        bidSort === '시장가' ?
                            <>
                                <table className="trading-table">
                                    <tr>
                                        <td className='trading-category'>주문가능</td>
                                        <td className="trading-availableTrade">
                                            {
                                                // 보유수량이 undefined 또는 null일 때 0 반환
                                                (Array.isArray(ownedCrypto) && ownedCrypto.find((item) => item.crypto_name === cr_name_selected)?.quantity) || '0'
                                            }
                                            <span>
                                                {
                                                    selectedCrypto && selectedCrypto.market ?
                                                        (selectedCrypto.market).slice(4) :
                                                        null
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='trading-category'>주문수량</td>
                                        <td className="td-input">
                                            <div>
                                                <input type="text"
                                                    value={quantityInputValue}
                                                    onChange={(e) => {
                                                        let value = e.target.value;

                                                        // 00, 01, 02, ... 등등 첫번째 숫자가 0인데 그 뒤에 수가 온다면, 그 수로 0을 대체하거나 삭제
                                                        if (value[0] === '0' && value.length > 1) {
                                                            if (value[1] === '0' || (value[1] >= '1' && value[1] <= '9')) {
                                                                value = value.substring(1);
                                                            }
                                                        }

                                                        // 0..2, 0..4, ... 등등 "."이 두 번 이상 나오지 않도록 함
                                                        value = value.replace(/(\..*)\./g, "$1");

                                                        // 숫자와 "." 외의 문자를 제거
                                                        value = value.replace(/[^0-9.]/g, "");

                                                        // "."이 맨 처음에 오지 않도록 함
                                                        if (value[0] === '.') {
                                                            value = '0' + value;
                                                        }

                                                        // value값이 비게 되면 '0'으로 설정(NaN값 방지)
                                                        if (value === '') {
                                                            value = '0';
                                                        }

                                                        const decimalPart = (value.split('.')[1] || '').length;

                                                        // 소수점 자릿수가 8자리 이하인 경우만
                                                        if (decimalPart <= 8) {
                                                            setQuantityInputValue(value);
                                                            setSellQuantity(parseFloat(value));
                                                        }

                                                        setSellTotal(Math.floor(sellingPrice * parseFloat(value)))
                                                        setTotalInputvalue((Math.floor(sellingPrice * parseFloat(value))).toString())
                                                    }}
                                                />
                                                <span>
                                                    {
                                                        selectedCrypto && selectedCrypto.market ?
                                                            (selectedCrypto.market).slice(4) :
                                                            null
                                                    }
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="count-percentage">
                                            <span className={
                                                selectedPercentage === '10%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('10%'))}>10%</span>
                                            <span className={
                                                selectedPercentage === '25%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('25%'))}>25%</span>
                                            <span className={
                                                selectedPercentage === '50%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('50%'))}>50%</span>
                                            <span className={
                                                selectedPercentage === '75%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('75%'))}>75%</span>
                                            <span className={
                                                selectedPercentage === '100%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('100%'))}>100%</span>
                                        </td>
                                    </tr>
                                </table>
                                {
                                    user.email !== '' ?
                                        <div className="trading-submit-sell market">
                                            <span onClick={
                                                // 호가와의 일치 여부를 확인하지 않음
                                                () => {
                                                    sellCrypto(user.email, selectedCrypto.name, sellQuantity, sellTotal)
                                                    addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, sellingPrice, sellTotal, sellQuantity, true);
                                                }}>
                                                매도
                                            </span>
                                        </div> :
                                        <div className="trading-submit-nonLogIn-sell market">
                                            <span onClick={() => { navigate('/logIn') }}>로그인</span>
                                            <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                                        </div>
                                }
                            </> :
                            // 매도 - 예약가 영역
                            <>
                                <table className="trading-table">
                                    <tr>
                                        <td className="trading-category">주문가능</td>
                                        <td className="trading-availableTrade">0
                                            <span>
                                                {
                                                    selectedCrypto && selectedCrypto.market ?
                                                        (selectedCrypto.market).slice(4) :
                                                        null
                                                }</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="trading-category">감시가격</td>
                                        <td className="td-input">
                                            <input onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} value={sellingPrice}>
                                            </input>
                                            <span>KRW</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="trading-category">매도가격</td>
                                        <td className="td-input">
                                            <input onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} value={sellingPrice}>
                                            </input>
                                            <span>KRW</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="range" min="0" max="50000000" step={1} value={sellingPrice} className="slider sell" onChange={(e) => dispatch(setSellingPrice(Number(e.target.value)))} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="trading-category">주문수량</td>
                                        <td className="td-input">
                                            <input>
                                            </input>
                                            <span>
                                                {
                                                    selectedCrypto && selectedCrypto.market ?
                                                        (selectedCrypto.market).slice(4) :
                                                        null
                                                }</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="count-percentage">
                                            <span className={
                                                selectedPercentage === '10%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('10%'))}>10%</span>
                                            <span className={
                                                selectedPercentage === '25%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('25%'))}>25%</span>
                                            <span className={
                                                selectedPercentage === '50%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('50%'))}>50%</span>
                                            <span className={
                                                selectedPercentage === '75%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('75%'))}>75%</span>
                                            <span className={
                                                selectedPercentage === '100%' ?
                                                    'sell-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('100%'))}>100%</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="trading-category">주문총액</td>
                                        <td className="td-input">
                                            <input>
                                            </input>
                                            <span>KRW</span>
                                        </td>
                                    </tr>
                                </table>
                                {
                                    user.email !== '' ?
                                        <div className="trading-submit-sell reserve">
                                            <span>예약매도</span>
                                        </div> :
                                        <div className="trading-submit-nonLogIn-sell reserve">
                                            <span onClick={() => { navigate('/logIn') }}>로그인</span>
                                            <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                                        </div>
                                }
                            </>

                    )
            }
        </>
    )
}