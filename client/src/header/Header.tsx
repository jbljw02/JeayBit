import { useAppSelector } from "../redux/hooks";
import { useAppDispatch } from "../redux/hooks";
import favicon from "../assets/images/favicon.png";
import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Wallet from "./wallet/Wallet";
import { setUserTradeHistory, setUserTradeHistory_unSigned } from "../redux/features/tradeSlice";
import { setUser, setUserInfo } from "../redux/features/userSlice";
import '../styles/header/header.css'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

const API_URL = process.env.REACT_APP_API_URL;

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(state => state.user);

  const [walletHover, setWalletHover] = useState<boolean>(false);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const logOut = async () => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      await axios.post(`${API_URL}/logOut/`, {},
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
      throw error;
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      window.location.reload();
    }
  };

  return (
    <>
      {/* 제목 폰트를 사용하기 위한 구글 폰트 api */}
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Hind&display=swap');
      </style>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Roboto+Flex&display=swap');
      </style>
      <div className="header-container">
        <LoadingBar color="#22ab94" ref={loadingBarRef} />
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
                    logOut();
                  }}
                  className="logout">
                  로그아웃
                </span>
                <span
                  onMouseEnter={() => setWalletHover(true)}
                  onMouseLeave={() => setWalletHover(false)}
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