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
            const response = await axios.get(`${API_URL}/api/user/crypto/owned/`, {
                withCredentials: true,
            });

            const resOwnedCrypto: OwnedCrypto[] = response.data;

            // 현재 선택한 화폐의 보유량 업데이트
            const targetCrypto = resOwnedCrypto.find(item => item.name === selectedCrypto.name);
            const updatedCrypto = {
                ...selectedCrypto,
                isOwned: targetCrypto?.isOwned,
                ownedQuantity: targetCrypto?.ownedQuantity,
            };

            const updatedOwnedCrypto = allCrypto
                .filter(crypto => resOwnedCrypto.some(own => crypto.name === own.name))
                .map(crypto => {
                    const matched = resOwnedCrypto.find(own => crypto.name === own.name);
                    return matched ? { ...crypto, isOwned: true, ownedQuantity: matched.ownedQuantity } : crypto;
                });

            dispatch(setOwnedCrypto(updatedOwnedCrypto));
            dispatch(setSelectedCrypto(updatedCrypto));
        } catch (error) {
            dispatch(showNoticeModal({
                content: '보유 화폐 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
            }));
        }
    }

    return getOwnedCrypto;
}