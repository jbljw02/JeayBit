import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setFilteredData } from "../../redux/store";

export default function ListSearch() {
    const dispatch = useDispatch();

    const allCrypto = useSelector((state: RootState) => state.allCrypto);

    const [search_cr, setSearch_cr] = useState<string>("");

    const searchedCrypto = allCrypto.map((item, i) => ({
        name: item.name,
        price: item.price,
        market: item.market,
        change: item.change,
        change_rate: item.change_rate,
        change_price: item.change_price,
        trade_price: item.trade_price,
        trade_volume: item.trade_volume,
        open_price: item.open_price,
        high_price: item.high_price,
        low_price: item.low_price,
        isFavorited: item.isFavorited,
        // 검색어에 해당하는 데이터를 비교하여 배열을 재생성
    })).filter((item) =>
        item.name.toLowerCase().includes(search_cr.toLowerCase())
    );

    useEffect(() => {
        dispatch(setFilteredData(searchedCrypto));
    }, [search_cr]);

    return (
        <div className="list-search lightMode">
            <svg
                className="img-search"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="30"
                height="30">
                <path
                    fill="currentColor"
                    d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"
                ></path>
            </svg>
            <input
                type="text"
                className="crypto-search lightMode"
                placeholder="검색"
                value={search_cr}
                onChange={(e) => setSearch_cr(e.target.value)} />
        </div>
    )
}