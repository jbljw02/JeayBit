import { useDispatch, useSelector } from "react-redux";
import title from "../assets/images/title.png";
import { RootState, setBalanceUpdate, setLogInEmail, setLogInUser, setTheme, setUserWallet } from "../store";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { csrftoken } from "./csrftoken";
import getFuntion from "./useFuction";

const Header = () => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFToken";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useSelector((state: RootState) => state.theme);
  const cr_selected = useSelector((state: RootState) => state.cr_selected);
  const logInUser = useSelector((state: RootState) => state.logInUser);
  const logInEmail = useSelector((state: RootState) => state.logInEmail);
  const balanceUpdate = useSelector((state: RootState) => state.balanceUpdate);

  const [walletHover, setWalletHover] = useState<boolean>(false);
  const [transferSort, setTransferSort] = useState<string>("입금");

  // 입금량, 입금 -> 화폐 전환량
  const [depositAmount, setDepositAmount] = useState<number>();
  const [depositChangeAmount, setDepositChangeAmount] = useState<number>(0);
  const [depositLimit, setDepositLimit] = useState<boolean>(false);

  // 출금량, 출금 -> 화폐 전환량
  const [withdrawAmount, setWithdrawAmount] = useState<number>();
  const [withdrawChangeAmount, setWithdrawChangeAmount] = useState<number>(0);
  const [withdrawLimit, setWithdrawLimit] = useState<boolean>(false);
  const [withdrawOverflow, setWithdrawOverflow] = useState<boolean>(false);

  // 로그인 중인 사용자의 잔고량
  const userWallet = useSelector((state: RootState) => state.userWallet);

  const getBalance = getFuntion();

  const themeChange = () => {
    dispatch(setTheme(!theme));

    let generalTheme = document.querySelectorAll(".lightMode, .darkMode");
    let titleTheme = document.querySelectorAll(
      ".lightMode-title, .darkMode-title"
    );
    let titleImgTheme = document.querySelectorAll(
      ".title-img-light, .title-img-dark"
    );
    let hoverTheme = document.querySelectorAll(
      ".hover-lightMode, .hover-darkMode"
    );

    // 라이트모드 <-> 다크모드 순회
    generalTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("lightMode");
        element.classList.add("darkMode");
      } else {
        element.classList.remove("darkMode");
        element.classList.add("lightMode");
      }
    });

    titleTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("lightMode-title");
        element.classList.add("darkMode-title");
      } else {
        element.classList.remove("darkMode-title");
        element.classList.add("lightMode-title");
      }
    });

    titleImgTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("title-img-light");
        element.classList.add("title-img-dark");
      } else {
        element.classList.remove("title-img-dark");
        element.classList.add("title-img-light");
      }
    });

    hoverTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("hover-lightMode");
        element.classList.add("hover-darkMode");
      } else {
        element.classList.remove("hover-darkMode");
        element.classList.add("hover-lightMode");
      }
    });
  };

  // 화면 첫 랜더링 시, 사용자 변경 시, 입출금 할 때마다 잔고 데이터 받아옴
  useEffect(() => {
    if (logInEmail !== '') {
      getBalance(logInEmail);
    }
  }, [logInEmail, balanceUpdate])

  const logOut = () => {
    (async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/logOut/",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("로그아웃 성공 : ", response);
        } else {
          console.log("로그아웃 실패");
        }
        dispatch(setLogInEmail(''))
        dispatch(setLogInUser(''))
        localStorage.removeItem('user');
      } catch (error) {
        console.log("로그아웃 정보 전송 실패");
      }
    })();
  };

  const checkLogin = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/check_login/", {
        withCredentials: true,
      });

      if (response.data.is_logged_in) {
        console.log("로그인 중");
      } else {
        console.log("로그아웃 상태");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 입금량을 서버로 전송
  const addBalanceToUser = (email: string, depositAmount: number) => {
    if (logInEmail !== "") {
      return (async (email, depositAmount) => {
        try {
          await axios.post("http://127.0.0.1:8000/add_balance_to_user/", {
            email: email,
            depositAmount: depositAmount,
          });
          console.log("입금량 전송 성공");
        } catch (error) {
          console.log("입금량 전송 실패");
        }
      })(email, depositAmount);
    }
  };

  // 출금량을 서버로 전송
  const minusBalanceFromUser = (email: string, withdrawAmount: number) => {
    if (logInEmail !== "") {
      return (async (email, withdrawAmount) => {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/minus_balance_from_user/",
            {
              email: email,
              withdrawAmount: withdrawAmount,
            }
          );
          if (response.data.error) {
            setWithdrawOverflow(true);
            console.log("출금량이 잔고보다 많습니다 : ", response.data);
          } else {
            setWithdrawOverflow(false);
            console.log("출금량 전송 성공");
          }
        } catch (error) {
          console.log("출금량 전송 실패");
        }
      })(email, withdrawAmount);
    }
  };

  // 입금량의 변화를 감지하고 한계량을 지정
  const depositChange = (event: { target: { value: string } }) => {
    let value = event.target.value.replace(/,/g, ""); // 콤마 제거(숫자만으로 이루어진 문자열을 얻기 위함)
    const numberValue = Number(value);

    if (numberValue <= 10000000 && numberValue >= 1000) {
      setDepositLimit(false);
      setDepositAmount(numberValue);
      setDepositChangeAmount(
        parseFloat((numberValue / cr_selected.price).toFixed(7))
      );
    } else {
      if (numberValue <= 10000000) {
        setDepositAmount(numberValue);
      }
      setDepositLimit(true);
    }
  };

  // 출금량의 변화를 감지하고 한계량을 지정
  const withdrawChange = (event: { target: { value: string } }) => {
    let value = event.target.value.replace(/,/g, ""); // 콤마 제거(숫자만으로 이루어진 문자열을 얻기 위함)
    const numberValue = Number(value);

    if (numberValue <= 10000000 && numberValue >= 1000) {
      setWithdrawLimit(false);
      setWithdrawAmount(numberValue);
      setWithdrawChangeAmount(
        parseFloat((numberValue / cr_selected.price).toFixed(7))
      );
    } else {
      if (numberValue <= 10000000) {
        setWithdrawAmount(numberValue);
      }
      setWithdrawLimit(true);
    }
  };

  return (
    <header className="header lightMode-title">
      {/* 제목 폰트를 사용하기 위한 구글 폰트 api */}
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Hind&display=swap');
      </style>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Roboto+Flex&display=swap');
      </style>
      <div className="div-title">
        <span className="title">
          <img src={title} className="title-img-light" alt="제목"></img>
          <span
            onClick={() => {
              navigate("/");
            }}
            className="title-name"
          >
            JeayBit
          </span>
        </span>
        {/* <span onClick={() => checkLogin()}>확인항</span> */}
        {logInUser === "" ? (
          <div className="member-nav-unLogIn">
            <span
              onClick={() => {
                navigate("/logIn");
              }}
              className="logIn"
            >
              로그인
            </span>
            <span
              onClick={() => {
                navigate("/signUp");
              }}
              className="signUp"
            >
              회원가입
            </span>
          </div>
        ) : (
          <div className="member-nav-LogIn">
            <span className="logInUser">
              <u>{logInUser}</u>님
            </span>
            <span
              onClick={() => {
                logOut();
              }}
              className="logOut"
            >
              로그아웃
            </span>
            <span
              onMouseEnter={() => setWalletHover(true)}
              onMouseLeave={() => setWalletHover(false)}
              // onClick={() => navigate('/Wallet')}
              className="wallet"
            >
              지갑관리
              {walletHover === true ? (
                <div
                  className={`walletHover ${transferSort === "잔고" ? "balance" : ""
                    }`}
                >
                  <div className="transfer-section">
                    <span
                      onClick={() => setTransferSort("입금")}
                      id={`${transferSort === "입금" ? "depositSection" : ""}`}
                    >
                      입금
                    </span>
                    <span
                      onClick={() => setTransferSort("출금")}
                      id={`${transferSort === "출금" ? "withdrawSection" : ""}`}
                    >
                      출금
                    </span>
                    <span
                      onClick={() => {
                        setTransferSort("잔고");
                        // getBalance(logInEmail);
                      }}
                      id={`${transferSort === "잔고" ? "balanceSection" : ""}`}
                    >
                      잔고
                    </span>
                  </div>
                  {
                    // 입금 영역
                    transferSort === "입금" ? (
                      <>
                        <div
                          className={`transfer-input ${depositLimit === true ? "alert-border" : ""
                            }`}
                        >
                          <div>입금금액</div>
                          <input
                            onChange={depositChange}
                            value={
                              depositAmount && depositAmount.toLocaleString()
                            }
                            placeholder="1,000 ~ 10,000,000"
                          ></input>
                          <span>KRW</span>
                        </div>
                        {depositLimit === true ? (
                          <div className="alert-KRW">
                            한화로 1,000원 이상 1000만원 이하만 입금 가능합니다
                          </div>
                        ) : null}
                        <div className="change-input">
                          <div>전환량</div>
                          <input value={depositChangeAmount}></input>
                          <span className="change-input-span">
                            <img
                              className="img-transfer-crypto"
                              src={
                                cr_selected && cr_selected.market
                                  ? Array.isArray(cr_selected.market)
                                    ? `https://static.upbit.com/logos/${cr_selected.market[0].slice(
                                      4
                                    )}.png`
                                    : `https://static.upbit.com/logos/${cr_selected.market.slice(
                                      4
                                    )}.png`
                                  : undefined
                              }
                              alt="화폐사진"
                            />
                            <span>
                              {cr_selected && cr_selected.market
                                ? Array.isArray(cr_selected.market)
                                  ? cr_selected.market[0].slice(4)
                                  : cr_selected.market.slice(4)
                                : undefined}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="img-crypto-sort"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12.11 12.178L16 8.287l1.768 1.768-5.657 5.657-1.768-1.768-3.889-3.889 1.768-1.768 3.889 3.89z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        <div className="transfer-submit deposit">
                          <span
                            onClick={
                              // async를 사용하여 입금이 완료될 때까지 dispatch를 실행하지 않음
                              async () => {
                                if (depositAmount !== undefined) {
                                  await addBalanceToUser(logInEmail, depositAmount);
                                } else {
                                  alert("입금량 존재X");
                                }
                                dispatch(setBalanceUpdate(!balanceUpdate))
                              }
                            }
                          >
                            입금
                          </span>
                        </div>
                      </>
                    ) : transferSort === "출금" ? (
                      // 출금영역
                      <>
                        <div
                          className={`transfer-input ${withdrawOverflow || withdrawLimit === true
                            ? "alert-border"
                            : ""
                            }`}
                        >
                          <div>출금금액</div>
                          <input
                            onChange={withdrawChange}
                            value={
                              withdrawAmount && withdrawAmount.toLocaleString()
                            }
                            placeholder="1,000 ~ 10,000,000"
                          ></input>
                          <span>KRW</span>
                        </div>
                        {withdrawOverflow === true ? (
                          <div className="alert-KRW">
                            출금량이 잔고보다 많습니다
                          </div>
                        ) : null}
                        {withdrawLimit === true ? (
                          <div className="alert-KRW">
                            출금액은 1,000원 이상 1000만원 이하만 가능합니다
                          </div>
                        ) : null}
                        <div className="change-input">
                          <div>전환량</div>
                          <input value={withdrawChangeAmount}></input>
                          <span className="change-input-span">
                            <img
                              className="img-transfer-crypto"
                              src={
                                cr_selected && cr_selected.market
                                  ? Array.isArray(cr_selected.market)
                                    ? `https://static.upbit.com/logos/${cr_selected.market[0].slice(
                                      4
                                    )}.png`
                                    : `https://static.upbit.com/logos/${cr_selected.market.slice(
                                      4
                                    )}.png`
                                  : undefined
                              }
                              alt="화폐사진"
                            />
                            <span>
                              {cr_selected && cr_selected.market
                                ? Array.isArray(cr_selected.market)
                                  ? cr_selected.market[0].slice(4)
                                  : cr_selected.market.slice(4)
                                : undefined}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="img-crypto-sort"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12.11 12.178L16 8.287l1.768 1.768-5.657 5.657-1.768-1.768-3.889-3.889 1.768-1.768 3.889 3.89z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        <div className="transfer-submit withdraw">
                          <span
                            onClick={
                              async () => {
                                if (withdrawAmount !== undefined) {
                                  await minusBalanceFromUser(logInEmail, withdrawAmount);
                                }
                                dispatch(setBalanceUpdate(!balanceUpdate))
                              }}
                          >
                            출금
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="balance-section">
                          <div className="balance-content">
                            <span className="balance-title">
                              <span>{logInUser}</span>님의 출금가능 금액
                            </span>
                            <span className="balance-amount">
                              {userWallet !== undefined
                                ? userWallet.toLocaleString()
                                : null}
                              <span>&nbsp;KRW</span>
                            </span>
                          </div>
                          <div className="balance-notice">
                            <ul>
                              <li>
                                잔고에 보유할 수 있는 금액의 제한은 없습니다.
                              </li>
                              <li>
                                입금 및 출금 할 수 있는 금액의 상한선은 1회당
                                10,000,000원입니다.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )
                  }
                </div>
              ) : null}
            </span>
          </div>
        )}
        {theme === true ? (
          <svg
            onClick={() => themeChange()}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="changeTheme"
          >
            <path
              d="M20.968 12.768a7 7 0 01-9.735-9.735 9 9 0 109.735 9.735z"
              fill="currentColor"
            ></path>
          </svg>
        ) : (
          <svg
            onClick={() => themeChange()}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="changeTheme"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.5 2h3v3h-3V2zM16 12a4 4 0 11-8 0 4 4 0 018 0zM5.99 3.869L3.867 5.99 5.99 8.112 8.111 5.99 5.989 3.87zM2 13.5v-3h3v3H2zm1.868 4.51l2.121 2.12 2.122-2.12-2.122-2.122-2.121 2.121zM13.5 19v3h-3v-3h3zm4.51-3.112l-2.121 2.122 2.121 2.121 2.121-2.121-2.121-2.122zM19 10.5h3v3h-3v-3zm-3.11-4.51l2.12 2.121 2.122-2.121-2.121-2.121-2.122 2.121z"
              fill="currentColor"
            ></path>
          </svg>
        )}
        {/* {
          theme === true ?
            <svg onClick={() => themeChange()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="changeTheme">
              <path fill="#D8D4EA" fill-rule="evenodd" d="M3.881.015L4.267.4c-.706 1.735-.503 3.708.543 5.263C5.857 7.218 7.608 8.15 9.481 8.148c.727 0 1.446-.14 2.118-.415l.386.386c-.947 2.35-3.229 3.887-5.763 3.881C3.246 12 .686 9.893.115 6.971c-.57-2.92 1.009-5.837 3.766-6.956zm7.883 3.278l.236.235.236-.235c.13-.13.34-.13.471 0 .13.13.13.341 0 .471L12.472 4l.235.237c.13.13.13.34 0 .471-.13.13-.341.13-.471 0L12 4.471l-.236.236c-.13.13-.34.13-.471 0-.13-.13-.13-.341 0-.471l.235-.237-.235-.235c-.13-.13-.13-.34 0-.471.13-.13.341-.13.471 0zM7.146 1.439l.354.354.354-.354c.195-.195.511-.195.707 0 .195.196.195.512 0 .707l-.353.353.353.355c.195.195.195.511 0 .707-.196.195-.512.195-.707 0L7.5 3.207l-.354.354c-.195.195-.511.195-.707 0-.195-.196-.195-.512 0-.707l.354-.354-.354-.354c-.195-.195-.195-.511 0-.707.196-.195.512-.195.707 0z"></path>
            </svg> :
            <span className='ddd'>
              <svg onClick={() => themeChange()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="changeTheme">
                <path fill="#FF8D00" fill-rule="evenodd" d="M7 11.304c.304 0 .522.261.522.566v1.565c0 .304-.218.565-.522.565-.304 0-.522-.26-.522-.565V11.87c0-.305.218-.566.522-.566zm-3.826-1.26c.217-.174.522-.218.739 0 .217.217.217.565 0 .739l-1.13 1.13c-.087.13-.218.174-.348.174-.174 0-.305-.044-.392-.174-.217-.174-.217-.522 0-.696zm6.87-.044c.173-.174.521-.174.695.043l1.238 1.238c.15.185.13.477-.064.632-.217.217-.522.217-.74 0L10 10.739c-.174-.217-.174-.522.043-.739zM7 4.174c1.522 0 2.783 1.26 2.783 2.783 0 1.565-1.261 2.782-2.783 2.826-1.565 0-2.783-1.261-2.783-2.826 0-1.522 1.261-2.783 2.783-2.783zm0 1.13c-.913 0-1.696.74-1.696 1.653 0 .956.74 1.695 1.653 1.695.956 0 1.695-.739 1.695-1.695 0-.914-.739-1.653-1.652-1.653zm6.435 1.174c.304 0 .565.218.565.522 0 .304-.26.522-.565.522H11.87c-.305 0-.566-.218-.566-.522 0-.304.261-.522.566-.522zm-11.305 0c.305 0 .522.218.522.522 0 .304-.217.522-.522.522H.522C.217 7.522 0 7.304 0 7c0-.304.217-.522.522-.522zm9.151-4.455c.185-.15.477-.13.632.064.26.174.217.522 0 .74l-1.13 1.13c-.174.173-.479.173-.696 0-.217-.218-.217-.566 0-.74zm-9.238.064c.218-.217.522-.217.74 0l1.13 1.13c.174.218.174.479 0 .696-.217.217-.522.217-.74.044l-1.13-1.13c-.217-.218-.217-.566 0-.74zM7 0c.304 0 .522.217.522.522V2.13c0 .305-.218.522-.522.522-.304 0-.522-.217-.522-.478V.522C6.478.217 6.696 0 7 0z"></path>
              </svg>
            </span>
        } */}
      </div>
    </header>
  );
};

const HeaderNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme);

  const themeChange = () => {
    dispatch(setTheme(!theme));
    let generalTheme = document.querySelectorAll(".lightMode, .darkMode");
    let titleTheme = document.querySelectorAll(
      ".lightMode-title, .darkMode-title"
    );
    let titleImgTheme = document.querySelectorAll(
      ".title-img-light, .title-img-dark"
    );
    let hoverTheme = document.querySelectorAll(
      ".hover-lightMode, .hover-darkMode"
    );

    // 라이트모드 <-> 다크모드 순회
    generalTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("lightMode");
        element.classList.add("darkMode");
      } else {
        element.classList.remove("darkMode");
        element.classList.add("lightMode");
      }
    });

    titleTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("lightMode-title");
        element.classList.add("darkMode-title");
      } else {
        element.classList.remove("darkMode-title");
        element.classList.add("lightMode-title");
      }
    });

    titleImgTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("title-img-light");
        element.classList.add("title-img-dark");
      } else {
        element.classList.remove("title-img-dark");
        element.classList.add("title-img-light");
      }
    });

    hoverTheme.forEach((element) => {
      if (!theme) {
        element.classList.remove("hover-lightMode");
        element.classList.add("hover-darkMode");
      } else {
        element.classList.remove("hover-darkMode");
        element.classList.add("hover-lightMode");
      }
    });
  };

  return (
    <header className="header-nav lightMode-title">
      {/* 제목 폰트를 사용하기 위한 구글 폰트 api */}
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Hind&display=swap');
      </style>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Roboto+Flex&display=swap');
      </style>
      <div className="div-title-nav">
        {/* 이전 페이지로 이동 */}
        <svg
          onClick={() => navigate(-1)}
          className="backButton"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 25 25"
          width="25"
          height="25"
          fill="none"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.2"
            d="M17 22.5 6.85 12.35a.5.5 0 0 1 0-.7L17 1.5"
          ></path>
        </svg>

        {/* 홈 화면으로 이동 */}
        <svg
          onClick={() => navigate("/")}
          className="closeButton"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 25 25"
          width="25"
          height="25"
        >
          <path
            stroke="currentColor"
            stroke-width="1.2"
            d="m1.5 1.5 21 21m0-21-21 21"
          ></path>
        </svg>
      </div>
    </header>
  );
};

export { Header, HeaderNav };
