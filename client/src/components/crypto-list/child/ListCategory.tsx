import { useAppSelector } from "../../../redux/hooks";
import { useAppDispatch } from "../../../redux/hooks";
import { setListCategory } from "../../../redux/features/cryptoListSlice";

export default function ListCategory() {
    const dispatch = useAppDispatch();

    const listCategory = useAppSelector(state => state.listCategory);
    return (
        <>
            <div className="list-category no-drag">
                <span
                    className={`${listCategory === "원화" ?
                        "list-category-clicked" :
                        ""}`}
                    onClick={() => dispatch(setListCategory("원화"))}>
                    원화
                </span>
                <span
                    className={`${listCategory === "보유" ?
                        "list-category-clicked" :
                        ""}`}
                    onClick={() => dispatch(setListCategory("보유"))}>
                    보유
                </span>
                <span
                    className={`${listCategory === "관심" ?
                        "list-category-clicked" :
                        ""}`}
                    onClick={() => dispatch(setListCategory("관심"))}>
                    관심
                </span>
            </div>
        </>
    )
}