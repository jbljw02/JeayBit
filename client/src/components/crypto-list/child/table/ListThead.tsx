import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { sortByChangeRate, sortByName, sortByPrice, sortByTradeVolume } from "../../../../utils/sort/sortData";
import img_sort from "../../../../assets/images/sort.png";
import img_sort_up from "../../../../assets/images/sort-up.png";
import img_sort_down from "../../../../assets/images/sort-down.png";
import { setSortStates, setFilteredData, setSortedData } from "../../../../redux/features/cryptoListSlice";

export default function ListThead() {
    const dispatch = useAppDispatch();

    const filteredData = useAppSelector(state => state.filteredData);
    const listCategory = useAppSelector(state => state.listCategory);

    // 차례로 화폐명, 현재가, 전일대비, 거래대금의 정렬 상태를 관리
    const sortImages = [img_sort, img_sort_down, img_sort_up];
    const sortStates = useAppSelector(state => state.sortStates);

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
        <table className="list-table">
            <colgroup>
                <col width="35%" />
                <col width="21%" />
                <col width="21%" />
                <col width="23%" />
            </colgroup>
            <thead className="list-thead no-drag">
                <tr className="list-title">
                    {
                        listCategory !== '보유' ?
                            <>
                                <th className="name">
                                    <div onClick={() => sortClick(0)}>
                                        화폐명
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[0]]}
                                            alt="화폐명" />
                                    </div>
                                </th>
                                <th className="price">
                                    <div onClick={() => sortClick(1)}>
                                        현재가
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[1]]}
                                            alt="현재가" />
                                    </div>
                                </th>
                                <th className="compare">
                                    <div onClick={() => sortClick(2)}>
                                        전일대비
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[2]]}
                                            alt="전일대비" />
                                    </div>
                                </th>
                                <th className="volume">
                                    <div onClick={() => sortClick(3)}>
                                        거래대금
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[3]]}
                                            alt="거래대금" />
                                    </div>
                                </th>
                            </> :
                            <>
                                <th className="name">
                                    <div onClick={() => sortClick(0)}>
                                        화폐명
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[0]]}
                                            alt="화폐명" />
                                    </div>
                                </th>
                                <th className="price">
                                    <div onClick={() => sortClick(1)}>
                                        현재가
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[1]]}
                                            alt="현재가" />
                                    </div>
                                </th>
                                <th className="compare">
                                    <div onClick={() => sortClick(2)}>
                                        전일대비
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[2]]}
                                            alt="전일대비" />
                                    </div>
                                </th>
                                <th className="volume">
                                    <div onClick={() => sortClick(2)}>
                                        보유수량
                                        <img
                                            className="sort"
                                            src={sortImages[sortStates[2]]}
                                            alt="보유수량" />
                                    </div>
                                </th>
                            </>
                    }
                </tr>
            </thead>
        </table >
    )
}