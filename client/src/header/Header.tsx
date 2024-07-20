import { useDispatch, useSelector } from "react-redux";
import favicon from "../assets/images/favicon.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Wallet from "./wallet/Wallet";
import { setUser } from "../redux/features/userSlice";
import { setUserTradeHistory, setUserTradeHistory_unSigned } from "../redux/features/tradeSlice";
import { RootState } from "../redux/store";
import '../styles/header/header.css'

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user);

  const [walletHover, setWalletHover] = useState<boolean>(false);

  const logOut = async () => {
    try {
      await axios.post("https://jeaybit.onrender.com/logOut/",
        {},
        {
          withCredentials: true,
        });

      dispatch(setUser({
        name: '',
        email: '',
      }));

      dispatch(setUserTradeHistory([]));
      dispatch(setUserTradeHistory_unSigned([]));

      window.location.reload();
    } catch (error) {
      throw error;
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