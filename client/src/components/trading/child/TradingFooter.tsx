import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import CommonButton from "../../common/CommonButton";

type TradingFooterProps = {
    bidSort: string;
    designatedSubmit: () => void;
    marketSubmit: () => void;
    category: 'buy' | 'sell';
}

export default function TradingFooter({ bidSort, designatedSubmit, marketSubmit, category }: TradingFooterProps) {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.user);
    return (
        <div className="trading-footer">
            {
                user.email ?
                    <CommonButton
                        label={category === 'buy' ? '매수' : '매도'}
                        onClick={() => {
                            if (bidSort === '지정가') {
                                designatedSubmit();
                            } else {
                                marketSubmit();
                            }
                        }}
                        category={category} /> :
                    <div className="trading-submit-non-login">
                        <CommonButton
                            label="로그인"
                            onClick={() => { navigate('/login') }}
                            category={category} />
                        <CommonButton
                            label="회원가입"
                            onClick={() => { navigate('/signup') }}
                            category={category} />
                    </div>
            }
        </div>
    )
}