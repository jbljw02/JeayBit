import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState, setBuyingPrice, setIsBuying } from "../../../../redux/store";
import useFunction from "../../../useFuction";

export default function BuyingSection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);
    const cr_name_selected = useSelector((state: RootState) => state.cr_name_selected);
    const user = useSelector((state: RootState) => state.user);
    const userWallet = useSelector((state: RootState) => state.userWallet);
    const asking_data = useSelector((state: RootState) => state.asking_data);  // bid = 매수, ask = 매도
    const theme = useSelector((state: RootState) => state.theme);
    const buyingPrice = useSelector((state: RootState) => state.buyingPrice);

    const [selectedPercentage, setSelectedPercentage] = useState<string>('');
    const [bidSort, setBidSort] = useState<string>('지정가');

    const [buyTotal, setBuyTotal] = useState<number>(0);
    const [buyQuantity, setBuyQuantity] = useState<number>(0);

    const [quantityInputValue, setQuantityInputValue] = useState('0');
    const [totalInputValue, setTotalInputvalue] = useState('0');
    const [buyingInputValue, setBuyingInputValue] = useState('0');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [completeModalOpen, setCompleteModalOpen] = useState<boolean>(false);

    // 화폐 거래내역에 '매수'로 저장할지 '매도'로 저장할지를 지정
    // eslint-disable-next-line
    const [tradeCategory, setTradeCategory] = useState<string>('매수');

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

    // 매수가가 바뀌면 그에 따라 입력값도 변경
    useEffect(() => {
        setBuyingInputValue(buyingPrice.toString())
    }, [buyingPrice]);

    // 선택 화폐가 바뀔 때마다 매수 가격을 해당 화폐의 가격으로 변경하고, 주문 수량 및 총액을 초기화
    useEffect(() => {
        // 주문 수량
        setBuyQuantity(0);
        setQuantityInputValue('0');

        // 주문 총액
        setBuyTotal(0);
        setTotalInputvalue('0');
    }, [cr_name_selected])

    // 호가와 구매가가 일치할 때
    const buyCrypto = (email: string, cryptoName: string, cryptoQuantity: number, buyTotal: number) => {
        (async (email, cryptoName, cryptoQuantity, buyTotal) => {
            try {
                await axios.post("http://127.0.0.1:8000/buy_crypto/", {
                    email: email,
                    crypto_name: cryptoName,
                    crypto_quantity: cryptoQuantity,
                    buy_total: buyTotal,
                });
                // console.log("구매 화폐 전송 성공", response.data);
                getBalance(email);  // 매수에 사용한 금액만큼 차감되기 때문에 잔고 업데이트
                getOwnedCrypto(email);  // 소유 화폐가 새로 추가될 수 있으니 업데이트
                getTradeHistory(email)  // 매수에 성공했으니 거래내역 업데이트
                completeToggleModal();
            } catch (error) {
                // console.log("구매 화폐 전송 실패: ", error)
            }
        })(email, cryptoName, cryptoQuantity, buyTotal);
    }

    const selectPercentage = (percentage: string) => {
        setSelectedPercentage(percentage)

        // 매수가격이 0이면 주문수량/주문총액은 의미가 없으므로 
        if (buyingInputValue !== '0') {

            // 현재 잔고 기준 퍼센테이지를 '주문총액'에 할당하고, 주문총액이 구매하려는 화폐 가격에 대해 어느 정도의 비율을 가지는지 계산
            if (percentage === '10%') {
                let dividedTotal = userWallet * 0.1;
                setBuyTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
                let dividedQuantity = dividedTotal / buyingPrice;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                setBuyQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());
            }
            if (percentage === '25%') {
                let dividedTotal = userWallet * 0.25;
                setBuyTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
                let dividedQuantity = dividedTotal / buyingPrice;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                setBuyQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());
            }
            if (percentage === '50%') {
                let dividedTotal = userWallet * 0.50;
                setBuyTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
                let dividedQuantity = dividedTotal / buyingPrice;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                setBuyQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());
            }
            if (percentage === '75%') {
                let dividedTotal = userWallet * 0.75;
                setBuyTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
                let dividedQuantity = dividedTotal / buyingPrice;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                setBuyQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());
            }
            if (percentage === '100%') {
                let dividedTotal = userWallet;
                setBuyTotal(Math.floor(dividedTotal));
                setTotalInputvalue((Math.floor(dividedTotal)).toString());
                let dividedQuantity = dividedTotal / buyingPrice;

                // 소수점 아래 8자리로 제한
                if ((dividedQuantity.toString().split('.')[1] || '').length > 8) {
                    dividedQuantity = parseFloat(dividedQuantity.toFixed(8));
                }

                setBuyQuantity(dividedQuantity);
                setQuantityInputValue(dividedQuantity.toString());
            }

        }
    }

    return (
        <>
            {/* <ModalSumbit modalOpen={modalOpen} setModalOpen={setModalOpen} toggleModal={toggleModal} />
            <ModalComplete completeModalOpen={completeModalOpen} setCompleteModalOpen={setCompleteModalOpen} completeToggleModal={completeToggleModal} /> */}
            <table className="trading-headTable">
                <tbody>
                    <tr className="trading-choice">
                        <td className={`radio ${theme ? 'darkMode-title' : 'lightMode-title'}`}>
                            주문구분
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="radio">
                            <input type="radio" name="radio" id="radio1" className="radio-input" onChange={() => (setBidSort('지정가'))} checked={bidSort === '지정가'}></input>
                            <label className={`radio-designate radio-label ${theme ? 'darkMode-title' : 'lightMode-title'}`} htmlFor="radio1">
                                지정가
                            </label>
                        </td>
                        <td className="radio">
                            <input type="radio" name="radio" id="radio2" className="radio-input" onChange={() => (setBidSort('시장가'))} checked={bidSort === '시장가'}></input>
                            <label className={`radio-market radio-label ${theme ? 'darkMode-title' : 'lightMode-title'}`} htmlFor="radio2">
                                시장가
                            </label>
                        </td>
                        {/* <td className="radio">
                <input type="radio" name="radio" id="radio3" className="radio-input" onChange={() => (setBidSort('예약가'))} checked={bidSort === '예약가'}></input>
                <label className="radio-reserve radio-label" htmlFor="radio3">
                  예약/지정가
                </label>
              </td> */}
                    </tr>
                </tbody>
            </table>
            {
                // 매수 - 지정가 영역
                bidSort === '지정가' ?
                    <>
                        <table className="trading-table">
                            <tbody>
                                <tr>
                                    <td className="trading-category">주문가능</td>
                                    <td className="trading-availableTrade">{(Number(userWallet).toLocaleString())}
                                        <span>KRW</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="trading-category">매수가격</td>
                                    <td className="td-input">
                                        <div>
                                            <input
                                                type="text"
                                                value={buyingInputValue}
                                                onChange={(e) => {
                                                    let value = e.target.value;

                                                    // 매수가격을 변경했음에도 구매 대기 여부가 true이면 의도치 않게 매수가 완료될 수 있으니, 매수가를 변경했을 때는 구매 대기 여부를 false로 처리
                                                    // let updatedIsBuying = { ...isBuying };
                                                    // updatedIsBuying[cr_name_selected] = false;
                                                    // dispatch(setIsBuying(updatedIsBuying));

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

                                                    dispatch(setBuyingPrice(Number(value)));
                                                    setBuyingInputValue(value);
                                                    setBuyTotal(Math.floor(parseFloat(value) * buyQuantity));
                                                    setTotalInputvalue((Math.floor(parseFloat(value) * buyQuantity)).toString());
                                                }} />
                                            <span>KRW</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="trading-category">주문수량</td>
                                    <td className="td-input">
                                        <div>
                                            <input
                                                type="text"
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
                                                        setBuyQuantity(parseFloat(value));
                                                    }
                                                    setBuyTotal(Math.floor(buyingPrice * parseFloat(value)));
                                                    setTotalInputvalue((Math.floor(buyingPrice * parseFloat(value))).toString());
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
                                                'buy-percentage' :
                                                'nonSelected-percentage'
                                        } onClick={() => (selectPercentage('10%'))}>10%</span>
                                        <span className={
                                            selectedPercentage === '25%' ?
                                                'buy-percentage' :
                                                'nonSelected-percentage'
                                        } onClick={() => (selectPercentage('25%'))}>25%</span>
                                        <span className={
                                            selectedPercentage === '50%' ?
                                                'buy-percentage' :
                                                'nonSelected-percentage'
                                        } onClick={() => (selectPercentage('50%'))}>50%</span>
                                        <span className={
                                            selectedPercentage === '75%' ?
                                                'buy-percentage' :
                                                'nonSelected-percentage'
                                        } onClick={() => (selectPercentage('75%'))}>75%</span>
                                        <span className={
                                            selectedPercentage === '100%' ?
                                                'buy-percentage' :
                                                'nonSelected-percentage'
                                        } onClick={() => (selectPercentage('100%'))}>100%</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={`trading-category ${theme ? 'darkMode-title' : 'lightMode-title'}`}>주문총액</td>
                                    <td className="td-input">
                                        <div>
                                            <input
                                                type="text"
                                                className={`${theme ? 'darkMode-title' : 'lightMode-title'}`}
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

                                                    if (buyingInputValue !== '0') {

                                                        if (isNumber) {
                                                            setTotalInputvalue(value);
                                                            setBuyTotal(parseFloat(value));

                                                            let dividiedQuantity = Number(value) / buyingPrice;

                                                            // 소수점 아래 8자리로 제한
                                                            if ((dividiedQuantity.toString().split('.')[1] || '').length > 8) {
                                                                dividiedQuantity = parseFloat(dividiedQuantity.toFixed(8));
                                                            }

                                                            setBuyQuantity(dividiedQuantity);
                                                            setQuantityInputValue(dividiedQuantity.toString());
                                                        }
                                                    }
                                                }} />
                                            <span>KRW</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {
                            user.email !== '' ?
                                <div className="trading-submit-buy designate">
                                    <span onClick={() => {
                                        // 호가와 구매가가 일치하는지 확인
                                        let item = asking_data.find(item => item.ask_price === buyingPrice);
                                        if (item !== undefined) {
                                            // 일치한다면 바로 매수 요청을 전송
                                            buyCrypto(user.email, selectedCrypto.name, buyQuantity, buyTotal);
                                            addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, buyingPrice, buyTotal, buyQuantity, true);
                                            // getTradeHistory(user.email);
                                        }
                                        else {
                                            // 선택한 화폐에 대한 구매 대기 여부를 true로 설정
                                            let temp = localStorage.getItem(`${user.email}_IsBuying`)
                                            if (temp !== null) {
                                                let localStorage_isBuying = JSON.parse(temp);
                                                localStorage_isBuying[cr_name_selected] = true;
                                                localStorage.setItem(`${user.email}_IsBuying`, JSON.stringify(localStorage_isBuying));

                                                dispatch(setIsBuying(localStorage_isBuying))
                                            }

                                            // 일치하지 않는다면 대기 모달 팝업
                                            toggleModal();
                                            setModalOpen(!modalOpen);

                                            addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, buyingPrice, buyTotal, buyQuantity, false);
                                            // getTradeHistory(user.email);
                                        }
                                    }}>매수</span>
                                </div> :
                                <div className="trading-submit-nonLogIn-buy designate">
                                    <span onClick={() => { navigate('/logIn') }}>로그인</span>
                                    <span onClick={() => { navigate('/signUp') }} >회원가입</span>
                                </div>
                        }
                    </> :
                    (
                        // 매수 - 시장가 영역
                        bidSort === '시장가' ?
                            <>
                                <table className="trading-table">
                                    <tr>
                                        <td className={`trading-category ${theme ? 'darkMode-title' : 'lightMode-title'}`}>주문가능</td>
                                        <td className="trading-availableTrade">{(Number(userWallet).toLocaleString())}
                                            <span>KRW</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={`trading-category ${theme ? 'darkMode-title' : 'lightMode-title'}`}>주문총액</td>
                                        <td className="td-input">
                                            <div>
                                                <input value={buyTotal}>
                                                </input>
                                                <span>KRW</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td className="count-percentage">
                                            <span className={
                                                selectedPercentage === '10%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('10%'))}>10%</span>
                                            <span className={
                                                selectedPercentage === '25%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('25%'))}>25%</span>
                                            <span className={
                                                selectedPercentage === '50%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('50%'))}>50%</span>
                                            <span className={
                                                selectedPercentage === '75%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('75%'))}>75%</span>
                                            <span className={
                                                selectedPercentage === '100%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('100%'))}>100%</span>
                                        </td>
                                    </tr>
                                </table>
                                {
                                    user.email !== '' ?
                                        <div className="trading-submit-buy market">
                                            <span onClick={
                                                // 호가와의 일치 여부를 확인하지 않음
                                                () => {
                                                    buyCrypto(user.email, selectedCrypto.name, buyQuantity, buyTotal)
                                                    addTradeHistory(user.email, selectedCrypto.name, tradeCategory, time, selectedCrypto.market, buyingPrice, buyTotal, buyQuantity, true);
                                                }
                                            }>
                                                매수
                                            </span>
                                        </div> :
                                        <div className="trading-submit-nonLogIn-buy market">
                                            <span onClick={() => { navigate('/logIn') }}>로그인</span>
                                            <span onClick={() => { navigate('/signUp') }}>회원가입</span>
                                        </div>
                                }
                            </> :
                            // 매수 - 예약가 영역
                            <>
                                <table className="trading-table">
                                    <tr>
                                        <td className="trading-category">주문가능</td>
                                        <td className="trading-availableTrade">{userWallet}
                                            <span>KRW</span>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="trading-category">감시가격</td>
                                        <td className="td-input">
                                            <input onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} value={buyingPrice}>
                                            </input>
                                            <span>KRW</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="trading-category">매수가격</td>
                                        <td className="td-input">
                                            <input onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} value={buyingPrice}>
                                            </input>
                                            <span>KRW</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <input type="range" min="0" max="50000000" step={1} value={buyingPrice} className="slider buy" onChange={(e) => dispatch(setBuyingPrice(Number(e.target.value)))} />
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
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('10%'))}>10%</span>
                                            <span className={
                                                selectedPercentage === '25%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('25%'))}>25%</span>
                                            <span className={
                                                selectedPercentage === '50%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('50%'))}>50%</span>
                                            <span className={
                                                selectedPercentage === '75%' ?
                                                    'buy-percentage' :
                                                    'nonSelected-percentage'
                                            } onClick={() => (selectPercentage('75%'))}>75%</span>
                                            <span className={
                                                selectedPercentage === '100%' ?
                                                    'buy-percentage' :
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
                                        <div className="trading-submit-buy reserve">
                                            <span>예약매수</span>
                                        </div> :
                                        <div className="trading-submit-nonLogIn-buy reserve">
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