import { useDispatch, useSelector } from "react-redux";
import { setListCategory } from "../../../redux/features/cryptoListSlice";
import { RootState } from "../../../redux/store";

export default function ListCategory() {
    const dispatch = useDispatch();

    const listCategory = useSelector((state: RootState) => state.listCategory);
    return (
        <>
            {/* 원화, 보유, 관심 선택란 */}
            <div className="list-category">
                <span
                    className={`${listCategory === "원화" ?
                        "list-category-clicked" :
                        ""
                        }`}
                    onClick={() => dispatch(setListCategory("원화"))}>
                    원화
                </span>
                <span
                    className={`${listCategory === "보유" ?
                        "list-category-clicked" :
                        ""
                        }`}
                    onClick={() => dispatch(setListCategory("보유"))}>
                    보유
                </span>
                <span
                    className={`${listCategory === "관심" ?
                        "list-category-clicked" :
                        ""
                        }`}
                    onClick={() => dispatch(setListCategory("관심"))}>
                    관심
                </span>
            </div>
        </>
    )
}