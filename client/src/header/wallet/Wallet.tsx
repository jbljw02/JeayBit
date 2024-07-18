import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useFunction from "../../components/useFuction";
import TransferInput from "./TransferInput";
import { ChangeInput } from "./ChangeInput";
import TransferWarning from "./TransferWarning";
import NoticeModal from "../../components/modal/common/NoticeModal";
import '../../styles/header/wallet.css'
import { setBalanceUpdate, setTransferSort } from "../../redux/features/walletSlice";
import { RootState } from "../../redux/store";

export default function Wallet() {
    const dispatch = useDispatch();

    const { getBalance } = useFunction();

    const user = useSelector((state: RootState) => state.user);
    const balanceUpdate = useSelector((state: RootState) => state.balanceUpdate);
    const transferSort = useSelector((state: RootState) => state.transferSort);

    // 입금량, 입금 -> 화폐 전환량
    const [depositAmount, setDepositAmount] = useState<number>();
    const [depositChangeAmount, setDepositChangeAmount] = useState<number>(0);
    const [depositLimit, setDepositLimit] = useState<boolean>(false);
    const [depositEmpty, setDepositEmpty] = useState<boolean>(false);

    // 출금량, 출금 -> 화폐 전환량
    const [withdrawAmount, setWithdrawAmount] = useState<number>();
    const [withdrawChangeAmount, setWithdrawChangeAmount] = useState<number>(0);
    const [withdrawLimit, setWithdrawLimit] = useState<boolean>(false);
    const [withdrawOverflow, setWithdrawOverflow] = useState<boolean>(false);
    const [withdrawEmpty, setWithdrawEmpty] = useState<boolean>(false);

    const [depositSubmitted, setDepositSubmitted] = useState<boolean>(false);
    const [withdrawSubmitted, setWithdrawSubmitted] = useState<boolean>(false);

    const [successTransfer, setSuccessTransfer] = useState<boolean>(false);
    const [failTransfer, setFailTransfer] = useState<boolean>(false);
    const [transferCategory, setTransferCategory] = useState<'deposit' | 'withdraw' | ''>('');

    // 로그인 중인 사용자의 잔고량
    const userWallet = useSelector((state: RootState) => state.userWallet);

    const selectedCrypto = useSelector((state: RootState) => state.selectedCrypto);

    // 화면 첫 랜더링 시, 사용자 변경 시, 입출금 할 때마다 잔고 데이터 받아옴
    useEffect(() => {
        if (user.email && user.name) {
            getBalance(user.email);
        }
    }, [user, balanceUpdate, getBalance])

    // 입금 및 출금량의 변화를 감지하고 한계량을 지정
    const handleBalanceChange = (
        event: { target: { value: string } },
        setAmount: React.Dispatch<React.SetStateAction<number | undefined>>,
        setChangeAmount: React.Dispatch<React.SetStateAction<number>>,
        setLimit: React.Dispatch<React.SetStateAction<boolean>>,
        setIsEmpty: React.Dispatch<React.SetStateAction<boolean>>,
        isSubmitted: boolean,
        selectedCryptoPrice: number) => {
        let value = event.target.value.replace(/,/g, "");
        let numberValue = Number(value);

        if (numberValue > 10000000) {
            numberValue = 10000000;
        }

        if (numberValue >= 1000) {
            setLimit(false);
            setAmount(numberValue);
            setChangeAmount(parseFloat((numberValue / selectedCryptoPrice).toFixed(7)));
        }
        else {
            setAmount(numberValue);
            setLimit(true);
        }

        if (isSubmitted) {
            if (value) {
                console.log('존재');
                setIsEmpty(false);
            }
            else {
                console.log("미존재");
                setIsEmpty(true);
            }
        }
    };

    // 입금량을 서버로 전송
    const addBalanceToUser = async (email: string, depositAmount: number) => {
        if (user.email && user.name) {
            try {
                await axios.post("http://127.0.0.1:8000/add_balance_to_user/", {
                    email: email,
                    depositAmount: depositAmount,
                });
                setSuccessTransfer(true);
                setTransferCategory('deposit');
            } catch (error) {
                setFailTransfer(true);
                setTransferCategory('deposit');
            }
        }
    };

    // 출금량을 서버로 전송
    const minusBalanceFromUser = async (email: string, withdrawAmount: number) => {
        if (user.email && user.name) {
            try {
                await axios.post(
                    "http://127.0.0.1:8000/minus_balance_from_user/",
                    {
                        email: email,
                        withdrawAmount: withdrawAmount,
                    }
                );
                setSuccessTransfer(true);
                setTransferCategory('withdraw');
            } catch (error) {
                setFailTransfer(true);
                setTransferCategory('withdraw');
            }
        }
    };

    const depositSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        setDepositSubmitted(true);
        if (!depositAmount) {
            setDepositEmpty(true);
            return;
        }

        if (depositAmount && !depositLimit) {
            await addBalanceToUser(user.email, depositAmount);
            dispatch(setBalanceUpdate(!balanceUpdate));
            setDepositSubmitted(false);
            setDepositEmpty(false);
        }
    }

    const withdrawSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        setWithdrawSubmitted(true);
        if (!withdrawAmount) {
            setWithdrawEmpty(true);
            return;
        }

        if (withdrawAmount && !withdrawOverflow && !withdrawLimit) {
            await minusBalanceFromUser(user.email, withdrawAmount);
            dispatch(setBalanceUpdate(!balanceUpdate));
            setWithdrawSubmitted(false);
            setWithdrawEmpty(false);
        }
    }

    // 입/출금 완료 시 띄울 모달 결정
    const renderNoticeModal = () => {
        if (successTransfer) {
            return (
                <NoticeModal
                    isModalOpen={successTransfer}
                    setIsModalOpen={setSuccessTransfer}
                    content={`${transferCategory === 'deposit' ? '입금' : '출금'}이 성공적으로 완료되었습니다.`}
                />
            );
        }
        if (failTransfer) {
            return (
                <NoticeModal
                    isModalOpen={failTransfer}
                    setIsModalOpen={setFailTransfer}
                    content={`${transferCategory === 'deposit' ? '입금' : '출금'}에 실패했습니다.`}
                />
            );
        }

        return null;
    };

    return (
        <>
            {renderNoticeModal()}
            <form
                onSubmit={transferSort === '입금' ? depositSubmit : withdrawSubmit}
                className={`wallet-hover 
                    ${transferSort === "잔고" ? "balance" : ""}`}>
                <div className="transfer-section">
                    <span
                        onClick={() => dispatch(setTransferSort("입금"))}
                        id={`${transferSort === "입금" ? "deposit-section" : ""}`}>
                        입금
                    </span>
                    <span
                        onClick={() => dispatch(setTransferSort("출금"))}
                        id={`${transferSort === "출금" ? "withdraw-section" : ""}`}>
                        출금
                    </span>
                    <span
                        onClick={() => {
                            dispatch(setTransferSort("잔고"));
                        }}
                        id={`${transferSort === "잔고" ? "balance-section" : ""}`}>
                        잔고
                    </span>
                </div>
                {
                    // 입금 영역
                    transferSort === "입금" ?
                        <>
                            <TransferInput
                                label="입금금액"
                                amount={depositAmount}
                                onChange={(e) =>
                                    handleBalanceChange(e, setDepositAmount, setDepositChangeAmount, setDepositLimit, setDepositEmpty, depositSubmitted, selectedCrypto.price)
                                }
                                limitReached={depositLimit}
                                amountEmpty={depositEmpty} />
                            <TransferWarning
                                isWarning={depositLimit}
                                label="입금은 1회당 1,000원 이상 10,000,000원 이하만 가능합니다" />
                            <TransferWarning
                                isWarning={depositEmpty}
                                isSubmitted={depositSubmitted}
                                label="입금액을 입력해주세요" />
                            <ChangeInput
                                amount={depositChangeAmount}
                                market={selectedCrypto.market.slice(4)} />
                            <button className="transfer-submit deposit">
                                <span>입금</span>
                            </button>
                        </> :
                        transferSort === "출금" ?
                            // 출금 영역
                            <>
                                <TransferInput
                                    label="출금금액"
                                    amount={withdrawAmount}
                                    onChange={(e) =>
                                        handleBalanceChange(e, setWithdrawAmount, setWithdrawChangeAmount, setWithdrawLimit, setWithdrawEmpty, withdrawSubmitted, selectedCrypto.price)
                                    }
                                    limitReached={withdrawLimit || withdrawOverflow}
                                    amountEmpty={withdrawEmpty} />
                                <TransferWarning
                                    isWarning={withdrawOverflow}
                                    label="출금량이 잔고보다 많습니다" />
                                <TransferWarning
                                    isWarning={withdrawLimit}
                                    label="출금은 1회당 1,000원 이상 10,000,000원 이하만 가능합니다" />
                                <TransferWarning
                                    isWarning={withdrawEmpty}
                                    isSubmitted={withdrawSubmitted}
                                    label="입금액을 입력해주세요" />
                                <ChangeInput
                                    amount={withdrawChangeAmount}
                                    market={selectedCrypto.market.slice(4)} />
                                <button className="transfer-submit withdraw">
                                    <span>출금</span>
                                </button>
                            </> :
                            // 잔고 영역
                            <div className="balance-section">
                                <div className="balance-content">
                                    <span className="balance-title">
                                        <span>{user.name}</span>님의 출금가능 금액
                                    </span>
                                    <span className="balance-amount">
                                        {
                                            userWallet ?
                                                Number(userWallet).toLocaleString() :
                                                0
                                        }
                                        <span>&nbsp;KRW</span>
                                    </span>
                                </div>
                                <div className="balance-notice">
                                    <ul>
                                        <li>
                                            잔고에 보유할 수 있는 금액의 제한은 없습니다.
                                        </li>
                                        <li>
                                            입금 및 출금 할 수 있는 금액의 상한선은 1회당
                                            10,000,000원입니다.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                }
            </form>
        </>
    )
}