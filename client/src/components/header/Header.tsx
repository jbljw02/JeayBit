import favicon from "../../assets/images/favicon.png";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Wallet from "./wallet/Wallet";
import '../../styles/header/header.css'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { showNoticeModal } from "../../redux/features/ui/modalSlice";
import { setTradeHistory, setUnSignedTradeHistory } from "../../redux/features/trade/tradeSlice";
import { setUser } from "../../redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useGetBalance from "../../hooks/user/useGetBalance";
import { useClickOutside } from "../../hooks/common/useClickOutside";

const API_URL = process.env.REACT_APP_API_URL;

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const walletRef = useRef<HTMLSpanElement>(null);
  const loadingBarRef = useRef<LoadingBarRef>(null);

  const user = useAppSelector(state => state.user);
  const [walletHover, setWalletHover] = useState<boolean>(false);

  const logout = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      await axios.delete(`${API_URL}/api/auth/`, {
        withCredentials: true,
      });

      dispatch(setUser({
        name: '',
        email: '',
        balance: 0
      }));

      dispatch(setTradeHistory([]));
      dispatch(setUnSignedTradeHistory([]));
    } catch (error) {
      dispatch(showNoticeModal({
        content: '로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.',
        buttonLabel: '다시 시도',
        actionType: 'LOGOUT',
      }));
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      window.location.reload();
    }
  };

  useClickOutside(walletRef, () => setWalletHover(false));
  useGetBalance();

  return (
    <>
      <header className="header-container">
        <LoadingBar color="#29D" ref={loadingBarRef} />
        <div className="title">
          <img src={favicon} className="title-img" alt="제목" />
          <span
            onClick={() => navigate("/")}
            className="title-name no-drag">
            JeayBit
          </span>
        </div>
        {
          !user.email || !user.name ? (
            <div className="nav-user">
              <span
                onClick={() => {
                  navigate("/login");
                }}
                className="login">
                로그인
              </span>
              <span
                onClick={() => {
                  navigate("/signup");
                }}
                className="signUp">
                회원가입
              </span>
            </div>
          ) :
            (
              <div className="nav-user">
                <span className="user-name no-drag">
                  <u>{user.name}</u>님
                </span>
                <span
                  onClick={() => {
                    logout();
                  }}
                  className="logout">
                  로그아웃
                </span>
                <span
                  ref={walletRef}
                  onClick={() => setWalletHover(!walletHover)}
                  className="wallet">
                  지갑관리
                  {
                    walletHover &&
                    <Wallet />
                  }
                </span>
              </div>
            )}
      </header>
    </>
  );
};