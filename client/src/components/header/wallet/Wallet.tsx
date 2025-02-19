import axios from "axios";
import { useState } from "react";
import TransferInput from "./TransferInput";
import { ChangeInput } from "./ChangeInput";
import TransferWarning from "./TransferWarning";
import '../../../styles/header/wallet/wallet.css'
import { showNoticeModal } from "../../../redux/features/ui/modalSlice";
import { setWorkingSpinner } from "../../../redux/features/ui/placeholderSlice";
import { depositUserBalance, withdrawUserBalance } from "../../../redux/features/user/userSlice";
import { setSuccessTransfer, setTransferCategory, setFailTransfer, setBalanceUpdate, setTransferSort } from "../../../redux/features/user/walletSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import NavBar from "../../common/NavBar";
import BalanceSection from "./BalanceSection";
import CommonButton from "../../common/CommonButton";
import { TransferSort } from "../../../types/user.type";

const API_URL = process.env.REACT_APP_API_URL;

const navItems = [
    { label: '입금', color: '#22ab94' },
    { label: '출금', color: '#f23645' },
    { label: '잔고', color: '#000000' },
];

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
    const balanceChange = (
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
            // 입금량이 비어있는 경우
            if (value) {
                setIsEmpty(false);
            } else {
                setIsEmpty(true);
            }

            // 출금량이 잔고를 초과하는 경우
            if (Number(value) > user.balance) {
                setWithdrawOverflow(true);
            } else {
                setWithdrawOverflow(false);
            }
        }
    };

    // 입금량을 서버로 전송
    const depositBalance = async (depositAmount: number) => {
        if (user.email && user.name) {
            try {
                await axios.post(`${API_URL}/api/user/balance/deposit/`, {
                    amount: depositAmount,
                }, {
                    withCredentials: true,
                });

                dispatch(setSuccessTransfer(true));
                dispatch(showNoticeModal({
                    content: '입금이 성공적으로 완료되었습니다.',
                }));
                dispatch(setTransferCategory('deposit'));
            } catch (error) {
                dispatch(setFailTransfer(true));
                dispatch(setTransferCategory('deposit'));
                dispatch(showNoticeModal({
                    content: '입금에 실패했습니다. 잠시 후 다시 시도해주세요.',
                }));
            }
        }
    };

    // 출금량을 서버로 전송
    const withdrawBalance = async (amount: number) => {
        if (user.email && user.name) {
            try {
                await axios.delete(`${API_URL}/api/user/balance/withdraw/`, {
                    data: {
                        amount: amount,
                    },
                    withCredentials: true,
                });
                dispatch(setSuccessTransfer(true));
                dispatch(showNoticeModal({
                    content: '출금이 성공적으로 완료되었습니다.',
                }));
                dispatch(setTransferCategory('withdraw'));
            } catch (error) {
                dispatch(setFailTransfer(true));
                dispatch(setTransferCategory('withdraw'));
                dispatch(showNoticeModal({
                    content: '출금에 실패했습니다. 잠시 후 다시 시도해주세요.',
                }));
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

            await depositBalance(depositAmount);
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
            setWithdrawOverflow(true);
            return;
        }

        if (withdrawAmount && !withdrawOverflow && !withdrawLimit) {
            dispatch(setWorkingSpinner(true));

            await withdrawBalance(withdrawAmount);
            dispatch(withdrawUserBalance(withdrawAmount));

            dispatch(setWorkingSpinner(false));

            dispatch(setBalanceUpdate(!balanceUpdate));
            setWithdrawSubmitted(false);
            setWithdrawEmpty(false);
        }
    }

    return (
        <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={transferSort === '입금' ? depositSubmit : withdrawSubmit}
            className={`wallet-container 
                ${transferSort === "잔고" ? "balance" : ""}`}>
            <NavBar
                items={navItems}
                activeItem={transferSort}
                onItemClick={(label) => dispatch(setTransferSort(label as TransferSort))}
                size="large" />
            {
                // 입금 영역
                transferSort === "입금" ?
                    <div className="wallet-content">
                        <div>
                            <TransferInput
                                label="입금금액"
                                amount={depositAmount}
                                onChange={(e) =>
                                    balanceChange(e, setDepositAmount, setDepositChangeAmount, setDepositLimit, setDepositEmpty, depositSubmitted, selectedCrypto.price)
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
                        </div>
                        <CommonButton
                            label="입금"
                            category="buy"
                            type="submit" />
                    </div> :
                    transferSort === "출금" ?
                        // 출금 영역
                        <div className="wallet-content">
                            <div>
                                <TransferInput
                                    label="출금금액"
                                    amount={withdrawAmount}
                                    onChange={(e) =>
                                        balanceChange(e, setWithdrawAmount, setWithdrawChangeAmount, setWithdrawLimit, setWithdrawEmpty, withdrawSubmitted, selectedCrypto.price)
                                    }
                                    limitReached={withdrawLimit}
                                    amountEmpty={withdrawEmpty}
                                    overflow={withdrawOverflow} />
                                <TransferWarning
                                    isWarning={withdrawLimit}
                                    label="출금은 1회당 1,000원 이상 10,000,000원 이하만 가능합니다" />
                                <TransferWarning
                                    isWarning={withdrawEmpty}
                                    isSubmitted={withdrawSubmitted}
                                    label="입금액을 입력해주세요" />
                                <TransferWarning
                                    isWarning={withdrawOverflow}
                                    isSubmitted={withdrawSubmitted}
                                    label="출금량이 잔고를 초과했습니다" />
                                <ChangeInput
                                    amount={withdrawChangeAmount}
                                    market={selectedCrypto.market.slice(4)} />
                            </div>
                            <CommonButton
                                label="출금"
                                category="sell"
                                type="submit" />
                        </div> :
                        // 잔고 영역
                        <BalanceSection />
            }
        </form>
    )
}