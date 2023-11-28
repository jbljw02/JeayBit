import { HeaderNav } from "./Header";
import title from '../assets/images/title.png';
import { useNavigate } from "react-router-dom";
import { SetStateAction, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLogInEmail, setLogInUser } from "../store";
import { csrftoken } from './csrftoken';


const LogIn = () => {

  const navigate = useNavigate();

  const [activeInput, setActiveInput] = useState<string>('');
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);

  const dispatch = useDispatch();

  const logIn = (email: string, password: string) => {

    console.log("토큰 : ", csrftoken)
    setIsEmailEmpty(false);
    setIsPasswordEmpty(false);
    
    // 이메일 및 비밀번호가 모두 입력돼야 서버로 데이터 전송
    if (email !== '' && password !== '') {
      (async (email, password) => {
        console.log(email)
        console.log(password)
        try {
          const response = await axios.post('http://127.0.0.1:8000/logIn/', {
            email: email,
            password: password,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            withCredentials: true,
          });
          console.log("로그인 정보 전송 성공", response.data)
          dispatch(setLogInUser(response.data.username))
          dispatch(setLogInEmail(response.data.email))

          localStorage.setItem('user', JSON.stringify(response.data));

          navigate('/')
        } catch (error) {
          console.log("로그인 정보 전송 실패", error)
        }
      })(email, password)
    }
    else if (email === '' && password === '') {
      setIsEmailEmpty(true);
      setIsPasswordEmpty(true);
    }
    else if (email === '') {
      setIsEmailEmpty(true);
    }
    else if (password === '') {
      setIsPasswordEmpty(true);
    }
  }

  const emailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  }

  const passwordChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setPassword(event.target.value);
  }

  // input 영역을 클릭하면 테두리 색상 변경
  const inputClick = (inputName: string) => {
    setActiveInput(inputName);
  }

  // 눈 아이콘을 클릭하면 패스워드를 보이게 함
  const passwordClick = () => {
    setVisiblePassword(!visiblePassword);
  }

  return (
    <div className="container-logIn">
      <HeaderNav />
      <div className="div-logIn">
        <span className='logIn-title'>
          <img src={title} className="logIn-title-img-light" alt='제목'></img>
          <span className="logIn-title-name">JeayBit</span>
        </span>
        <div className="view-logIn">

          {/* 이메일 영역 */}
          <div className="section-email">
            {/* <div className="signUp-email">이메일</div> */}
            <div onClick={() => inputClick('email')} className={`logIn-email ${activeInput === 'email' ? 'container-input-click' : 'container-input-nonClick'} ${isEmailEmpty ? 'input-inValid' : ''}`}>
              <svg className="icon-email" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 29" width="30" height="29">
                <path fill="currentColor" fillRule="evenodd" d="M7 7a2.5 2.5 0 0 0-2.5 2.5v9A2.5 2.5 0 0 0 7 21h15a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 22 7H7ZM5.5 9.5C5.5 8.67 6.17 8 7 8h15c.83 0 1.5.67 1.5 1.5v.17l-9 3.79-9-3.8V9.5Zm0 1.25v7.75c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-7.75l-8.8 3.71-.2.08-.2-.08-8.8-3.7Z"></path>
              </svg>
              <input type="text" value={email} onChange={emailChange} onFocus={() => { inputClick('email') }} className="input-signUp" placeholder="이메일"></input>
            </div>
            {
              isEmailEmpty ?
                <div className="inValid-alert">이메일을 입력해주세요</div> :
                null
            }
          </div>

          {/* 비밀번호 영역 */}
          <div className="section-password">
            {/* <div className="signUp-password">비밀번호</div> */}
            <div onClick={() => inputClick('password')} className={`logIn-password ${activeInput === 'password' ? 'container-input-click' : 'container-input-nonClick'} ${isPasswordEmpty ? 'input-inValid' : ''}`}>
              <input type={visiblePassword ? "text" : "password"} className="input-signUp" value={password} onChange={passwordChange} onFocus={() => { inputClick('password') }} placeholder="비밀번호"></input>
              {
                visiblePassword ?
                  <svg onClick={() => passwordClick()} className="icon-password" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" width="29" height="29"><path fill="currentColor" d="M22.2 6.5 6.5 22.2l-.7-.7L21.5 5.8l.7.7ZM14 6c1.54 0 2.9.4 4.1 1l-.74.75A8 8 0 0 0 14 7c-3.05 0-5.42 1.76-7.07 3.59A17.13 17.13 0 0 0 4.56 14a17.13 17.13 0 0 0 2.77 3.84l-.7.7-.44-.45c-1.1-1.24-2-2.61-2.74-4.09a17.7 17.7 0 0 1 2.74-4.08C7.92 7.99 10.55 6 14 6ZM21.8 9.92l-.41-.45-.7.7.38.42c1.29 1.43 2.1 2.88 2.37 3.41-.27.53-1.08 1.98-2.37 3.42C19.42 19.24 17.05 21 14 21a7.99 7.99 0 0 1-3.35-.75L9.9 21c1.2.6 2.57 1 4.1 1 3.45 0 6.08-2 7.8-3.91 1.11-1.23 2.03-2.6 2.75-4.09a17.82 17.82 0 0 0-2.74-4.08Z"></path><path fill="currentColor" d="M13.01 17.88A4 4 0 0 0 17.87 13l-.87.87V14a3 3 0 0 1-3.11 3l-.88.88ZM10.13 15.02l.87-.88V14a3 3 0 0 1 3.13-3l.87-.87a4 4 0 0 0-4.87 4.89Z"></path></svg>
                  :
                  <svg onClick={() => passwordClick()} className="icon-password" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" width="29" height="29"><path fill="currentColor" d="M21.8 9.92C20.09 7.99 17.46 6 14 6S7.92 8 6.2 9.92A17.7 17.7 0 0 0 3.44 14a18.56 18.56 0 0 0 2.74 4.08C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92 1.11-1.22 2.03-2.6 2.75-4.08a17.82 17.82 0 0 0-2.74-4.08ZM14 21c-3.05 0-5.42-1.76-7.07-3.58A17.13 17.13 0 0 1 4.56 14c.27-.53 1.08-1.98 2.37-3.42C8.58 8.76 10.95 7 14 7c3.05 0 5.42 1.76 7.07 3.58 1.29 1.44 2.1 2.89 2.37 3.42-.27.53-1.08 1.98-2.37 3.42C19.42 19.24 17.05 21 14 21Z"></path><path fill="currentColor" fillRule="evenodd" d="M10 14a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm1 0a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"></path></svg>
              }
            </div>
            {
              isPasswordEmpty ?
                <div className="inValid-alert">비밀번호를 입력해주세요</div> :
                null
            }
          </div>

          <span onClick={() => { logIn(email, password) }} className="logIn-submit">로그인</span>
          <div className="logIn-etc">
            <span onClick={() => { navigate('/signUp') }}>회원가입</span>
            <span>비밀번호를 잊으셨나요?</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export { LogIn };