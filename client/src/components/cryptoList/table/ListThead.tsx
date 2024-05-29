import { useDispatch, useSelector } from "react-redux";
import { RootState, setFilteredData, setSortedData } from "../../../redux/store";
import img_sort from "../../../assets/images/sort.png";
import img_sort_up from "../../../assets/images/sort-up.png";
import img_sort_down from "../../../assets/images/sort-down.png";
import { useState } from "react";
import { Crypto } from "../../../redux/store";

export default function ListThead() {
    const dispatch = useDispatch();
    const filteredData = useSelector((state: RootState) => state.filteredData);
    const listCategory = useSelector((state: RootState) => state.listCategory);

    const [sort_states, setSort_states] = useState<number[]>([0, 0, 0, 0]);
    const sort_images = [img_sort, img_sort_down, img_sort_up];

    // 정렬 이미지 클릭 이벤트
    const sortClick = (index: number) => {
        // 정렬 이미지 순환
        setSort_states((prevStates) => {
            const states_copy = [...prevStates];
            states_copy[index] = (states_copy[index] + 1) % sort_images.length;

            let sortedData = [...filteredData];

            // 화폐를 전일대비 상승/동결/하락 여부에 따라 구분
            // 값 자체에 양수, 음수 구분이 되어있는 것이 아니기 때문에 정렬하기 전에 구분을 지어줘야 함
            let rise_crypto: Crypto[] = [];
            let even_crypto: Crypto[] = [];
            let fall_crypto: Crypto[] = [];

            // 상승/동결/하락 여부에 따라 구분하여 새 배열 생성
            sortedData.forEach((item) => {
                rise_crypto = sortedData.filter((item) => item.change === "RISE");
                even_crypto = sortedData.filter((item) => item.change === "EVEN");
                fall_crypto = sortedData.filter((item) => item.change === "FALL");
            });

            switch (index) {
                // 화폐 이름순 정렬
                case 0:
                    if (states_copy[index] === 0) {
                        states_copy[index] = 1;
                    }
                    if (states_copy[index] === 1) {
                        sortedData.sort((a, b) => a.name.localeCompare(b.name));
                        // dispatch(setFilteredData(sortedData));

                        sort_states[1] = 0;
                        sort_states[2] = 0;
                        sort_states[3] = 0;
                    }
                    if (states_copy[index] === 2) {
                        sortedData.sort((a, b) => b.name.localeCompare(a.name));
                        // dispatch(setFilteredData(sortedData));

                        sort_states[1] = 0;
                        sort_states[2] = 0;
                        sort_states[3] = 0;
                    }
                    break;

                // 화폐 가격순 정렬
                case 1:
                    if (states_copy[index] === 0) {
                        states_copy[index] = 1;
                    }
                    if (states_copy[index] === 1) {
                        sortedData.sort((a, b) => b.price - a.price);
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[2] = 0;
                        sort_states[3] = 0;
                    }
                    if (states_copy[index] === 2) {
                        sortedData.sort((a, b) => a.price - b.price);
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[2] = 0;
                        sort_states[3] = 0;
                    }
                    break;

                // 화폐 전일대비 변화순 정렬
                case 2:
                    if (states_copy[index] === 0) {
                        states_copy[index] = 1;
                    }
                    if (states_copy[index] === 1) {
                        rise_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        even_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        fall_crypto.sort((a, b) => a.change_rate - b.change_rate);

                        // 새 배열을 원본 배열의 카피본에 병합 - 내림차순이기 때문에 상승, 동결, 하락순으로 병합
                        sortedData = [...rise_crypto, ...even_crypto, ...fall_crypto];
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[1] = 0;
                        sort_states[3] = 0;
                    }
                    if (states_copy[index] === 2) {
                        fall_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        even_crypto.sort((a, b) => b.change_rate - a.change_rate);
                        rise_crypto.sort((a, b) => a.change_rate - b.change_rate);

                        // 새 배열을 원본 배열의 카피본에 병합 - 오름차순이기 때문에 하락, 동결, 상승순으로 병합
                        sortedData = [...fall_crypto, ...even_crypto, ...rise_crypto];
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[1] = 0;
                        sort_states[3] = 0;
                    }
                    break;

                // 거래대금순 정렬
                case 3:
                    if (states_copy[index] === 0) {
                        states_copy[index] = 1;
                    }
                    if (states_copy[index] === 1) {
                        sortedData.sort((a, b) => b.trade_price - a.trade_price);
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[1] = 0;
                        sort_states[2] = 0;
                    }
                    if (states_copy[index] === 2) {
                        sortedData.sort((a, b) => a.trade_price - b.trade_price);
                        // dispatch(setFilteredData(sortedData));

                        sort_states[0] = 0;
                        sort_states[1] = 0;
                        sort_states[2] = 0;
                    }
                    break;
            }
            dispatch(setFilteredData(sortedData));
            dispatch(setSortedData(sortedData));

            return states_copy;
        });
    };

    return (
        <table className="list-table" id="listHead">
            <colgroup>
                <col width={150} />
                <col width={90} />
                <col width={90} />
                <col width={90} />
            </colgroup>
            <thead className="list-thead lightMode">
                <tr className="lightMode-title">
                    {
                        listCategory !== '보유' ?
                            <>
                                <th
                                    className="name"
                                    onClick={() => sortClick(0)}>
                                    화폐명
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[0]]}
                                        alt="화폐명" />
                                </th>
                                <th className="price" onClick={() => sortClick(1)}>
                                    현재가
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[1]]}
                                        alt="현재가" />
                                </th>
                                <th className="compare" onClick={() => sortClick(2)}>
                                    전일대비
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[2]]}
                                        alt="전일대비" />
                                </th>
                                <th className="volume" onClick={() => sortClick(3)}>
                                    거래대금
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[3]]}
                                        alt="거래대금" />
                                </th>
                            </> :
                            <>
                                <th className="name" id="owned-name" onClick={() => sortClick(0)}>
                                    화폐명
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[0]]}
                                        alt="화폐명" />
                                </th>
                                <th className="price" id="owned-price" onClick={() => sortClick(1)}>
                                    현재가
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[1]]}
                                        alt="현재가" />
                                </th>
                                <th className="compare" id="owned-compare" onClick={() => sortClick(2)}>
                                    전일대비
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[2]]}
                                        alt="전일대비" />
                                </th>
                                <th className="volume" id="owned-volume" onClick={() => sortClick(2)}>
                                    보유수량
                                    <img
                                        className="sort"
                                        src={sort_images[sort_states[2]]}
                                        alt="보유수량" />
                                </th>
                            </>
                    }
                </tr>
            </thead>
        </table>
    )
}