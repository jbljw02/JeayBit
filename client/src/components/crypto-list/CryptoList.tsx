import ListCategory from "./child/ListCategory";
import ListSearch from "./child/ListSearch";
import ListTbody from "./child/table/ListTbody";
import ListThead from "./child/table/ListThead";
import '../../styles/crypto-list/cryptoList.css'
import PlaceholderDisplay from "../placeholder/PlaceholderDisplay";
import SkeletonUI from "../placeholder/SkeletonUI";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import NavBar from "../common/NavBar";
import { setListCategory } from "../../redux/features/cryptoListSlice";

type SectionChange = '원화' | '보유' | '관심';

const navItems = [
    { label: '원화', color: '#000000' },
    { label: '보유', color: '#000000' },
    { label: '관심', color: '#000000' },
];

export default function CryptoList() {
    const dispatch = useAppDispatch();
    
    const user = useAppSelector(state => state.user);
    const listCategory = useAppSelector(state => state.listCategory);
    const favoriteCrypto = useAppSelector(state => state.favoriteCrypto);
    const ownedCrypto = useAppSelector(state => state.ownedCrypto);
    const allCrypto = useAppSelector(state => state.allCrypto);

    const renderContent = () => {
        if (!allCrypto.length) {
            return <div style={{ height: '100%' }}>
                <SkeletonUI
                    containerHeight="100%"
                    elementsHeight={30} />
            </div>;
        }

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
            <NavBar
                items={navItems}
                activeItem={listCategory}
                onItemClick={(label) => dispatch(setListCategory(label as SectionChange))}
                size="small" />
            <ListThead />
            {renderContent()}
        </>

    )
}