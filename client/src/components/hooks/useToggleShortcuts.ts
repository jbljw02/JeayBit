import { showNoticeModal } from "../../redux/features/modalSlice";
import { setFavoriteCrypto } from "../../redux/features/userCryptoSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import axios from "axios";
import { Crypto } from "../../redux/features/cryptoListSlice";

const API_URL = process.env.REACT_APP_API_URL;

export default function useToggleShortcuts() {
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user);
    const favoriteCrypto = useAppSelector(state => state.favoriteCrypto);

    // 로그인한 사용자에 대해 관심 화폐를 업데이트
    const addFavoriteCrypto = async (cryptoName: string) => {
        if (user.email) {
            try {
                const response = await axios.post(`${API_URL}/api/user/favorite/`, {
                    cryptoName: cryptoName,
                },
                    {
                        withCredentials: true,
                    }
                );

                return response.data.favorite_crypto;
            } catch (error) {
                dispatch(showNoticeModal({ content: '관심 화폐 추가에 실패했습니다.' }));
            }
        }
    };

    const toggleShortcuts = (crypto: Crypto, e: { stopPropagation: () => void; }) => {
        e.stopPropagation();

        if (!user.email) {
            dispatch(showNoticeModal({
                content: '관심 화폐를 추가하기 위해선 로그인이 필요합니다.',
                buttonLabel: '로그인',
                actionType: 'REDIRECT_LOGIN'
            }));
            return;
        }

        const updatedFavoriteCrypto = favoriteCrypto.some(item => item.name === crypto.name)
            ? favoriteCrypto.filter(item => item.name !== crypto.name)
            : [...favoriteCrypto, crypto];

        dispatch(setFavoriteCrypto(updatedFavoriteCrypto));
        addFavoriteCrypto(crypto.name);
    }

    return { toggleShortcuts, addFavoriteCrypto };
}