import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserWallet, RootState, setOwnedCrypto } from "../store";

export default function useFunction() {

  const dispatch = useDispatch();
  const logInUser = useSelector((state: RootState) => state.logInUser);
  const ownedCrypto = useSelector((state: RootState) => state.ownedCrypto);
  const logInEmail = useSelector((state: RootState) => state.logInEmail);
  const cr_selected = useSelector((state: RootState) => state.cr_selected);

  // 서버로부터 사용자의 잔고량을 받아옴
  const getBalance = (email: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_user_balance/${email}/`
        );
        dispatch(setUserWallet(response.data.user_balance));
        console.log(logInUser, "의 잔고 : ", response.data.user_balance);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  // 사용자가 소유하고 있는 화폐의 정보를 받아옴
  const getOwnedCrypto = (logInEmail: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_user_ownedCrypto/${logInEmail}/`
        );
        dispatch(setOwnedCrypto(response.data))
        console.log("반환값-소유화폐 : ", response.data)
      } catch (error) {
        console.log(error);
      }
    })()
  }

  // 서버로부터 거래 내역을 받아옴
  const getTradeHistory = (logInEmail: string) => {
    (async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get_user_tradeHistory/${logInEmail}/`
        );
        console.log("반환값-거래내역 : ", response.data);
      } catch (error) {
        console.log("거래내역 받아오기 실패", error)
      }
    })();
  }

  return { getBalance, getOwnedCrypto, getTradeHistory };

}
