import axios from "axios";
import { useState } from "react";
import TransferInput from "./TransferInput";
import { ChangeInput } from "./ChangeInput";
import TransferWarning from "./TransferWarning";
import '../../styles/header/wallet.css'
import { setBalanceUpdate, setFailTransfer, setSuccessTransfer, setTransferCategory, setTransferSort } from "../../redux/features/walletSlice";
import { setWorkingSpinner } from "../../redux/features/placeholderSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { depositUserBalance, withdrawUserBalance } from "../../redux/features/userSlice";
import { showNoticeModal } from "../../redux/features/modalSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function Wallet() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const balanceUpdate = useAppSelector(state => state.balanceUpdate);
    const transferSort = useAppSelector(state => state.transferSort);

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

    const selectedCrypto = useAppSelector(state => state.selectedCrypto);

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

        // 1000만원을 초과하는 수가 입력될 경우 1000만원으로 대치
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
                setIsEmpty(false);
            }
            else {
                setIsEmpty(true);
            }
        }
    };

    // 입금량을 서버로 전송
    const addBalanceToUser = async (email: string, depositAmount: number) => {
        if (user.email && user.name) {
            try {
                await axios.post(`${API_URL}/add_balance_to_user/`, {
                    email: email,
                    depositAmount: depositAmount,
                });
                dispatch(setSuccessTransfer(true));
                dispatch(showNoticeModal('입금이 성공적으로 완료되었습니다.'));
                dispatch(setTransferCategory('deposit'));
            } catch (error) {
                dispatch(setFailTransfer(true));
                dispatch(setTransferCategory('deposit'));
                dispatch(showNoticeModal('입금에 실패했습니다. 잠시 후 다시 시도해주세요.'));
            }
        }
    };

    // 출금량을 서버로 전송
    const minusBalanceFromUser = async (email: string, withdrawAmount: number) => {
        if (user.email && user.name) {
            try {
                await axios.post(`${API_URL}/minus_balance_from_user/`, {
                    email: email,
                    withdrawAmount: withdrawAmount,
                });
                dispatch(setSuccessTransfer(true));
                dispatch(showNoticeModal('출금이 성공적으로 완료되었습니다.'));
                dispatch(setTransferCategory('withdraw'));
            } catch (error) {
                dispatch(setFailTransfer(true));
                dispatch(setTransferCategory('withdraw'));
                dispatch(showNoticeModal('출금에 실패했습니다. 잠시 후 다시 시도해주세요.'));
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
            dispatch(setWorkingSpinner(true));

            await addBalanceToUser(user.email, depositAmount);
            dispatch(depositUserBalance(depositAmount));

            dispatch(setWorkingSpinner(false));

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

        if (withdrawAmount > user.balance) {
            dispatch(showNoticeModal('출금량이 잔고를 초과했습니다.'));
            setWithdrawOverflow(true);
            return;
        }

        if (withdrawAmount && !withdrawOverflow && !withdrawLimit) {
            dispatch(setWorkingSpinner(true));

            await minusBalanceFromUser(user.email, withdrawAmount);
            dispatch(withdrawUserBalance(withdrawAmount));

            dispatch(setWorkingSpinner(false));

            dispatch(setBalanceUpdate(!balanceUpdate));
            setWithdrawSubmitted(false);
            setWithdrawEmpty(false);
        }
    }

    return (
        <>
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
                                    limitReached={withdrawLimit}
                                    amountEmpty={withdrawEmpty} />
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
                                            user.balance ?
                                                Number(user.balance).toLocaleString() :
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