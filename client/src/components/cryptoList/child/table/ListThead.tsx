import { useDispatch, useSelector } from "react-redux";
import { RootState, setFilteredData, setSortStates, setSortedData } from "../../../../redux/store";
import img_sort from "../../../../assets/images/sort.png";
import img_sort_up from "../../../../assets/images/sort-up.png";
import img_sort_down from "../../../../assets/images/sort-down.png";
import { useEffect, useState } from "react";
import { Crypto } from "../../../../redux/store";
import { sortByChangeRate, sortByName, sortByPrice, sortByTradeVolume } from "../../../../utils/sort/sortData";

export default function ListThead() {
    const dispatch = useDispatch();

    const filteredData = useSelector((state: RootState) => state.filteredData);
    const listCategory = useSelector((state: RootState) => state.listCategory);

    // 차례로 화폐명, 현재가, 전일대비, 거래대금의 정렬 상태를 관리
    const sort_images = [img_sort, img_sort_down, img_sort_up];

    const sortStates = useSelector((state: RootState) => state.sortStates);

    // 정렬 이미지 클릭 이벤트
    const sortClick = (index: number) => {
        const sortStatesCopy = [0, 0, 0, 0]; // 모든 인덱스를 0으로 초기화
        sortStatesCopy[index] = (sortStates[index] + 1) % 3; // 현재 클릭한 인덱스의 상태를 변경 (0 -> 1 -> 2 -> 0)

        let sortedData = [...filteredData];

        switch (index) {
            case 0:
                if (sortStatesCopy[index] === 0) {
                    sortStatesCopy[index] = 1;
                }
                sortedData = sortByName(sortedData, sortStatesCopy[index]);
                break;
            case 1:
                if (sortStatesCopy[index] === 0) {
                    sortStatesCopy[index] = 1;
                }
                sortedData = sortByPrice(sortedData, sortStatesCopy[index]);
                break;
            case 2:
                if (sortStatesCopy[index] === 0) {
                    sortStatesCopy[index] = 1;
                }
                sortedData = sortByChangeRate(sortedData, sortStatesCopy[index]);
                break;
            case 3:
                if (sortStatesCopy[index] === 0) {
                    sortStatesCopy[index] = 1;
                }
                sortedData = sortByTradeVolume(sortedData, sortStatesCopy[index]);
                break;
        }

        dispatch(setSortStates(sortStatesCopy));
        dispatch(setFilteredData(sortedData));
        dispatch(setSortedData(sortedData));
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
                                        src={sort_images[sortStates[0]]}
                                        alt="화폐명" />
                                </th>
                                <th className="price" onClick={() => sortClick(1)}>
                                    현재가
                                    <img
                                        className="sort"
                                        src={sort_images[sortStates[1]]}
                                        alt="현재가" />
                                </th>
                                <th className="compare" onClick={() => sortClick(2)}>
                                    전일대비
                                    <img
                                        className="sort"
                                        src={sort_images[sortStates[2]]}
                                        alt="전일대비" />
                                </th>
                                <th className="volume" onClick={() => sortClick(3)}>
                                    거래대금
                                    <img
                                        className="sort"
                                        src={sort_images[sortStates[3]]}
                                        alt="거래대금" />
                                </th>
                            </> :
                            <>
                                <th className="name" id="owned-name" onClick={() => sortClick(0)}>
                                    화폐명
                                    <img
                                        className="sort"
                                        src={sort_images[sortStates[0]]}
                                        alt="화폐명" />
                                </th>
                                <th className="price" id="owned-price" onClick={() => sortClick(1)}>
                                    현재가
                                    <img
                                        className="sort"
                                        src={sort_images[sortStates[1]]}
                                        alt="현재가" />
                                </th>
                                <th className="compare" id="owned-compare" onClick={() => sortClick(2)}>
                                    전일대비
                                    <img
                                        className="sort"
                                        src={sort_images[sortStates[2]]}
                                        alt="전일대비" />
                                </th>
                                <th className="volume" id="owned-volume" onClick={() => sortClick(2)}>
                                    보유수량
                                    <img
                                        className="sort"
                                        src={sort_images[sortStates[2]]}
                                        alt="보유수량" />
                                </th>
                            </>
                    }
                </tr>
            </thead>
        </table>
    )
}