import axios from "axios";
import { setSelectedCrypto } from "../../redux/features/selectedCryptoSlice";
import { OwnedCrypto, setOwnedCrypto } from "../../redux/features/userCryptoSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { showNoticeModal } from "../../redux/features/modalSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useGetOwnedCrypto() {
    const dispatch = useAppDispatch();

    const selectedCrypto = useAppSelector(state => state.selectedCrypto);
    const allCrypto = useAppSelector(state => state.allCrypto);
  
    // 사용자가 소유하고 있는 화폐의 정보를 받아옴
    const getOwnedCrypto = async (email: string) => {
        try {
            const response = await axios.post(`${API_URL}/get_user_ownedCrypto/`, {
                email: email,
            });

            const resOwnedCrypto: OwnedCrypto[] = response.data;

            // 현재 선택한 화폐의 보유량 업데이트
            const targetCrypto = resOwnedCrypto.find(item => item.name === selectedCrypto.name);
            const updatedCrypto = {
                ...selectedCrypto,
                is_owned: targetCrypto?.is_owned,
                owned_quantity: targetCrypto?.owned_quantity,
            };

            const updatedOwnedCrypto = allCrypto
                .filter(crypto => resOwnedCrypto.some(own => crypto.name === own.name))
                .map(crypto => {
                    const matched = resOwnedCrypto.find(own => crypto.name === own.name);
                    return matched ? { ...crypto, is_owned: true, owned_quantity: matched.owned_quantity } : crypto;
                });

            dispatch(setOwnedCrypto(updatedOwnedCrypto));
            dispatch(setSelectedCrypto(updatedCrypto));
        } catch (error) {
            dispatch(showNoticeModal('보유 화폐 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.'));
        }
    }

    return getOwnedCrypto;
}