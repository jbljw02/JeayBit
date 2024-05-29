import ListCategory from "./ListCategory";
import ListSearch from "./ListSearch";
import ListTbody from "./table/ListTbody";
import ListThead from "./table/ListThead";

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