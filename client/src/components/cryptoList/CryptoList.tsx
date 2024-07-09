import ListCategory from "./child/ListCategory";
import ListSearch from "./child/ListSearch";
import ListTbody from "./child/table/ListTbody";
import ListThead from "./child/table/ListThead";
import '../../styles/cryptoList/cryptoList.css'

export default function CryptoList() {
    return (
        <>
            <ListSearch />
            <ListCategory />
            <ListThead />
            <ListTbody />
        </>
    )
}