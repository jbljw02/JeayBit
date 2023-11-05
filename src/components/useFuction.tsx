  import axios from "axios";
  import { useDispatch, useSelector } from "react-redux";
  import { setUserWallet, RootState } from "../store";

  export default function useFunction() {
    
    const dispatch = useDispatch();
    const logInUser = useSelector((state: RootState) => state.logInUser);

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
    
    return getBalance;

  }
