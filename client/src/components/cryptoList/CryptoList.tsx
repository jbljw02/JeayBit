import ListCategory from "./child/ListCategory";
import ListSearch from "./child/ListSearch";
import ListTbody from "./child/table/ListTbody";
import ListThead from "./child/table/ListThead";
import '../../styles/cryptoList/cryptoList.css'
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LoginPrompt from "../LoginPrompt";

export default function CryptoList() {
    const user = useSelector((state: RootState) => state.user);
    const listCategory = useSelector((state: RootState) => state.listCategory);

    return (
        <>
            <ListSearch />
            <ListCategory />
            <ListThead />
            {
                listCategory === '원화' || (user.name && user.email) ?
                    <ListTbody /> :
                    <LoginPrompt />
            }
        </>
    )
}