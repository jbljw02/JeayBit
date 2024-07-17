import ListCategory from "./child/ListCategory";
import ListSearch from "./child/ListSearch";
import ListTbody from "./child/table/ListTbody";
import ListThead from "./child/table/ListThead";
import '../../styles/cryptoList/cryptoList.css'
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PlaceholderDisplay from "../placeholder/PlaceholderDisplay";

export default function CryptoList() {
    const user = useSelector((state: RootState) => state.user);
    const listCategory = useSelector((state: RootState) => state.listCategory);
    const favoriteCrypto = useSelector((state: RootState) => state.favoriteCrypto);
    const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);

    const renderContent = () => {
        if (user.name && user.email) {
            if (listCategory === '원화') {
                return <ListTbody />;
            }
            else if (listCategory === '보유') {
                if (ownedCrypto.length > 0) {
                    return <ListTbody />;
                }
                else {
                    return <PlaceholderDisplay content="보유 화폐가 없습니다." />;
                }
            }
            else if (listCategory === '관심') {
                if (favoriteCrypto.length > 0) {
                    return <ListTbody />;
                }
                else {
                    return <PlaceholderDisplay content="관심 화폐가 없습니다." />;
                }
            }
        }
        else {
            if (listCategory === '원화') {
                return <ListTbody />;
            } else {
                return <PlaceholderDisplay content="로그인 후 확인하실 수 있습니다." />;
            }
        }
    };

    return (
        <>
            <ListSearch />
            <ListCategory />
            <ListThead />
            {renderContent()}
        </>

    )
}