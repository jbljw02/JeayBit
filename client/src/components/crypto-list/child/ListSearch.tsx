import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { useAppDispatch } from "../../../redux/hooks";
import { sortData } from "../../../utils/sort/sortData";
import { Crypto } from "../../../types/crypto.type";
import { setFilteredData } from "../../../redux/features/crypto/cryptoListSlice";

export default function ListSearch() {
    const dispatch = useAppDispatch();

    const allCrypto = useAppSelector(state => state.allCrypto);
    const listCategory = useAppSelector(state => state.listCategory);
    const favoriteCrypto = useAppSelector(state => state.favoriteCrypto);
    const ownedCrypto = useAppSelector(state => state.ownedCrypto);
    const sortStates = useAppSelector(state => state.sortStates);

    const [searchedInput, setSearchedInput] = useState<string>("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedInput(e.target.value)
    }

    // 카테고리에 따라 출력할 화폐를 달리하고, 그 화폐 내에서 검색 결과를 필터링
    useEffect(() => {
        // 카테고리에 따라 어떤 화폐를 저장할지 결정
        let dataToFilter: Crypto[] = [];
        if (listCategory === '원화') {
            dataToFilter = allCrypto;
        }
        else if (listCategory === '관심') {
            const isFavorites = allCrypto.filter(item => item.isFavorited);
            dataToFilter = isFavorites;
            // 관심 화폐의 무결성 유지
            if (dataToFilter !== favoriteCrypto) {
                dataToFilter = favoriteCrypto;
            }
        }
        else if (listCategory === '보유') {
            const isOwnes = allCrypto.filter(item => item.isOwned && item.ownedQuantity > 0.00);
            dataToFilter = isOwnes;
        }

        // 검색값이 있을 경우 필터링
        if (searchedInput) {
            dataToFilter = dataToFilter.filter(item =>
                item.name.toLowerCase().includes(searchedInput.toLowerCase())
            );
        }

        let sortedData = sortData(dataToFilter, sortStates);
        dispatch(setFilteredData(sortedData));
    }, [listCategory, favoriteCrypto, ownedCrypto, allCrypto, searchedInput, sortStates, dispatch]);

    return (
        <div className="list-search">
            <svg
                className="img-search"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                width="30"
                height="30">
                <path
                    fill="currentColor"
                    d="M3.5 8a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM8 2a6 6 0 1 0 3.65 10.76l3.58 3.58 1.06-1.06-3.57-3.57A6 6 0 0 0 8 2Z"></path>
            </svg>
            <input
                type="text"
                className="crypto-search"
                placeholder="검색"
                value={searchedInput}
                onChange={handleSearch} />
        </div>
    )
}