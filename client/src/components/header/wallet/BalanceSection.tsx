import { useAppSelector } from "../../../redux/hooks";
import '../../../styles/header/wallet/balance.css'

export default function BalanceSection() {
    const user = useAppSelector(state => state.user);
    return (
        <div className="wallet-content">
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
            <ul className="balance-notice">
                <li>
                    잔고에 보유할 수 있는 금액의 제한은 없습니다.
                </li>
                <li>
                    입금 및 출금 할 수 있는 금액의 상한선은 1회당
                    10,000,000원입니다.
                </li>
            </ul>
        </div>
    )
}