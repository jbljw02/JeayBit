import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setFilteredData } from "../../redux/store";

export default function ListSearch() {
    const dispatch = useDispatch();

    const [search_cr, setSearch_cr] = useState<string>("");

    const cr_price = useSelector((state: RootState) => state.cr_price);
    const cr_name = useSelector((state: RootState) => state.cr_name);
    const cr_market = useSelector((state: RootState) => state.cr_market);
    const cr_change = useSelector((state: RootState) => state.cr_change);
    const cr_change_rate = useSelector((state: RootState) => state.cr_change_rate);
    const cr_change_price = useSelector((state: RootState) => state.cr_change_price);
    const cr_trade_price = useSelector((state: RootState) => state.cr_trade_price);
    const cr_trade_volume = useSelector((state: RootState) => state.cr_trade_volume);
    const cr_open_price = useSelector((state: RootState) => state.cr_open_price);
    const cr_high_price = useSelector((state: RootState) => state.cr_high_price);
    const cr_low_price = useSelector((state: RootState) => state.cr_low_price);
    const star = useSelector((state: RootState) => state.star);


    useEffect(() => {
        dispatch(setFilteredData(updatedData));
    }, [search_cr, cr_price]);

    
    const updatedData = cr_name.map((name, i) => ({
        name,
        price: cr_price[i],
        market: cr_market[i],
        change: cr_change[i],
        change_rate: cr_change_rate[i],
        change_price: cr_change_price[i],
        trade_price: cr_trade_price[i],
        trade_volume: cr_trade_volume[i],
        open_price: cr_open_price[i],
        high_price: cr_high_price[i],
        low_price: cr_low_price[i],
        star: star[i],
        // 검색어에 해당하는 데이터를 비교하여 배열을 재생성
    })).filter((item) =>
        item.name.toLowerCase().includes(search_cr.toLowerCase())
    );
    
    return (
        <div className="list-search lightMode">
            {/* <img className="img-search" src={search}></img> */}
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
                onChange={(e) => setSearch_cr(e.target.value)}
            ></input>
        </div>
    )
}