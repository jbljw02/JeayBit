

export default function ListTRow({ item, onClick, starClick, logInEmail, addCryptoToUser }: any) {

    return (
        <tr onClick={() => onClick(item)}>
            <td className="td-name lightMode">
                <span className="span-star">
                    {/* 별 클릭 이벤트 및 이미지 여기에 추가 */}
                </span>
            </td>
            {item.change === "RISE" ? (
                <td className="lightMode">
                    <span className="td-rise">
                        +{(item.change_rate * 100).toFixed(2)}% <br />
                        {item.change_price.toLocaleString()}
                    </span>
                </td>
            ) : item.change === "FALL" ? (
                <td className="lightMode">
                    <span className="td-fall">
                        -{(item.change_rate * 100).toFixed(2)}% <br />
                        {item.change_price.toLocaleString()}
                    </span>
                </td>
            ) : (
                <td className="lightMode">
                    <span>
                        {(item.change_rate * 100).toFixed(2)}% <br />
                        {item.change_price.toLocaleString()}
                    </span>
                </td>
            )}
            <td className="lightMode">
                <span className="td-volume">
                    {Number(String(Math.floor(item.trade_price)).slice(0, -6)).toLocaleString()}
                    백만
                </span>
            </td>
        </tr>
    );

}