import favicon from "../../assets/images/favicon.png";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Wallet from "./wallet/Wallet";
import '../../styles/header/header.css'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { showNoticeModal } from "../../redux/features/modalSlice";
import { setUserTradeHistory, setUserTradeHistory_unSigned } from "../../redux/features/tradeSlice";
import { setUser } from "../../redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import useGetBalance from "../hooks/useGetBalance";
import { useClickOutside } from "../hooks/useClickOutside";

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
      await axios.post(`${API_URL}/logout/`, {},
        {
          withCredentials: true,
        });

      dispatch(setUser({
        name: '',
        email: '',
        balance: 0
      }));

      dispatch(setUserTradeHistory([]));
      dispatch(setUserTradeHistory_unSigned([]));
    } catch (error) {
      dispatch(showNoticeModal({
        content: '로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.',
        buttonLabel: '다시 시도',
        onClick: () => logout(),
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
      <div className="header-container">
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
                  navigate("/signUp");
                }}
                className="signUp">
                회원가입
              </span>
            </div>
          ) :
            (
              <div className="nav-user">
                <span className="user-name">
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
      </div>
    </>
  );
};