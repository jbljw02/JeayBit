import { HeaderNav } from "./Header";
import { SetStateAction, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import title from '../assets/images/title.png';

const SignUp = () => {

  const navigate = useNavigate();

  const [activeInput, setActiveInput] = useState<string>('');
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [isNameEmpty, setIsNameEmpty] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailValid, setEmailValid] = useState<boolean>(true);  // 이메일 유효여부
  const [isEmailDuplicate, setIsEmailDuplicate] = useState<boolean>(false);  // 이메일 중복여부
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(true);  // 비밀번호 유효여부
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  type DataError = {
    error: string,
  }

  // 회원가입 완료 후 서버로 데이터 전송
  const signUp = (userName: string, email: string, password: string) => {
    setIsNameEmpty(false);
    setIsEmailEmpty(false);
    setIsEmailDuplicate(false);
    setIsPasswordEmpty(false);

    (async (userName, email, password) => {
      try {
        if (emailValid === true && passwordValid === true) {
          await axios.post('https://jeaybit.site/sign_up/', {
            username: userName,
            email: email,
            password: password,
          });
          // console.log("회원가입 정보 전송 성공");
          navigate('/logIn')
        }
        else {
          // console.log("유효하지 않은 비밀번호 혹은 이메일")
        }
      } catch (error) {
        const axiosError = error as AxiosError<DataError>;
        // console.log("회원가입 에러 : ", axiosError.response);

        if (axiosError.response) {
          const axiosError_responseData: DataError = axiosError.response.data;

          // 400 에러(이름, 이메일, 비밀번호값 오류)
          if (axiosError.response !== undefined && axiosError.response.status === 400) {
            if (axiosError_responseData.error === '이미 사용중인 이메일') {
              setIsEmailDuplicate(true);
              // console.log("사유 : ", axiosError_responseData.error)
            }
            if (axiosError_responseData.error === '이메일을 설정하지 않음') {
              setIsEmailEmpty(true);
              // console.log("사유 : ", axiosError_responseData.error)
            }
            if (axiosError_responseData.error === '비밀번호를 설정하지 않음') {
              setIsPasswordEmpty(true);
              // console.log("사유 : ", axiosError_responseData.error)
            }
            if (axiosError_responseData.error === '이름을 설정하지 않음') {
              setIsNameEmpty(true);
              // console.log("사유 : ", axiosError_responseData.error)
            }
          }
        }

      }
    })(userName, email, password);
  }

  // state에 이름 저장
  const nameSetting = (event: { target: { value: SetStateAction<string>; }; }) => {
    setName(event.target.value)
  }

  // 이메일 유효성 검증
  const emailChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
    if (String(event.target.value).match(emailPattern)) {
      setEmailValid(true);
    }
    // else {
    //   setEmailValid(false);
    // }
  }
  const emailBlur = () => {
    if (email.match(emailPattern)) {
      setEmailValid(true);
    }
    else {
      setEmailValid(false);
    }
  }

  // 비밀번호 유효성 검증 
  const passwordChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setPassword(event.target.value);
    if (String(event.target.value).match(passwordPattern)) {
      setPasswordValid(true);
    }
    // else {
    //   setPasswordValid(false);
    // }
  }
  const passwordBlur = () => {
    if (password.match(passwordPattern)) {
      setPasswordValid(true);
    }
    else {
      setPasswordValid(false);
    }
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
    <div className="container-signUp">
      <HeaderNav />
      <div className="div-signUp">
        <span className='signUp-title'>
          <img src={title} className="signUp-title-img-light" alt='제목'></img>
          <span className="signUp-title-name">JeayBit</span>
        </span>
        {/* <span className="title-signUp">회원가입</span> */}
        <div className="view-signUp">
          {/* 이름 영역 */}
          <div className="section-name">
            {/* <div className="signUp-name">이름</div> */}
            <div onClick={() => inputClick('name')} className={`signUp-name ${activeInput === 'name' ? 'container-input-click' : 'container-input-nonClick'} ${isNameEmpty ? 'input-inValid' : ''}`}>
              <input type="text" value={name} onChange={nameSetting} onFocus={() => { inputClick('name') }} className="input-signUp" placeholder="이름"></input>
            </div>
            {
              isNameEmpty ?
                <div className="inValid-alert">이름을 입력해주세요</div> :
                null
            }
          </div>

          {/* 이메일 영역 */}
          <div className="section-email">
            {/* <div className="signUp-email">이메일</div> */}
            <div onClick={() => inputClick('email')} className={`signUp-email ${activeInput === 'email' ? 'container-input-click' : 'container-input-nonClick'} ${emailValid ? '' : 'input-inValid'} ${isEmailDuplicate ? 'input-inValid' : ''} ${isEmailEmpty ? 'input-inValid' : ''}`}>
              <svg className="icon-email" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 29" width="30" height="29">
                <path fill="currentColor" fill-rule="evenodd" d="M7 7a2.5 2.5 0 0 0-2.5 2.5v9A2.5 2.5 0 0 0 7 21h15a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 22 7H7ZM5.5 9.5C5.5 8.67 6.17 8 7 8h15c.83 0 1.5.67 1.5 1.5v.17l-9 3.79-9-3.8V9.5Zm0 1.25v7.75c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-7.75l-8.8 3.71-.2.08-.2-.08-8.8-3.7Z"></path>
              </svg>
              <input type="text" value={email} onChange={emailChange} onFocus={() => { inputClick('email') }} onBlur={emailBlur} className="input-signUp" placeholder="이메일"></input>
            </div>
            {
              emailValid ?
                null :
                <div className="inValid-alert">유효한 이메일을 입력해주세요</div>
            }
            {
              isEmailDuplicate ?
                <div className="inValid-alert">이미 존재하는 이메일입니다</div> :
                null
            }
            {
              isEmailEmpty ?
                <div className="inValid-alert">이메일을 입력해주세요</div> :
                null
            }
          </div>

          {/* 비밀번호 영역 */}
          <div className="section-password">
            {/* <div className="signUp-password">비밀번호</div> */}
            <div onClick={() => inputClick('password')} className={`signUp-password ${activeInput === 'password' ? 'container-input-click' : 'container-input-nonClick'} ${passwordValid ? '' : 'input-inValid'} ${isPasswordEmpty ? 'input-inValid' : ''}`}>
              <input type={visiblePassword ? "text" : "password"} value={password} onChange={passwordChange} onFocus={() => { inputClick('password') }} onBlur={passwordBlur} className="input-signUp" placeholder="비밀번호"></input>
              {
                visiblePassword ?
                  <svg onClick={() => passwordClick()} className="icon-password" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" width="29" height="29"><path fill="currentColor" d="M22.2 6.5 6.5 22.2l-.7-.7L21.5 5.8l.7.7ZM14 6c1.54 0 2.9.4 4.1 1l-.74.75A8 8 0 0 0 14 7c-3.05 0-5.42 1.76-7.07 3.59A17.13 17.13 0 0 0 4.56 14a17.13 17.13 0 0 0 2.77 3.84l-.7.7-.44-.45c-1.1-1.24-2-2.61-2.74-4.09a17.7 17.7 0 0 1 2.74-4.08C7.92 7.99 10.55 6 14 6ZM21.8 9.92l-.41-.45-.7.7.38.42c1.29 1.43 2.1 2.88 2.37 3.41-.27.53-1.08 1.98-2.37 3.42C19.42 19.24 17.05 21 14 21a7.99 7.99 0 0 1-3.35-.75L9.9 21c1.2.6 2.57 1 4.1 1 3.45 0 6.08-2 7.8-3.91 1.11-1.23 2.03-2.6 2.75-4.09a17.82 17.82 0 0 0-2.74-4.08Z"></path><path fill="currentColor" d="M13.01 17.88A4 4 0 0 0 17.87 13l-.87.87V14a3 3 0 0 1-3.11 3l-.88.88ZM10.13 15.02l.87-.88V14a3 3 0 0 1 3.13-3l.87-.87a4 4 0 0 0-4.87 4.89Z"></path></svg>
                  :
                  <svg onClick={() => passwordClick()} className="icon-password" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" width="29" height="29"><path fill="currentColor" d="M21.8 9.92C20.09 7.99 17.46 6 14 6S7.92 8 6.2 9.92A17.7 17.7 0 0 0 3.44 14a18.56 18.56 0 0 0 2.74 4.08C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92 1.11-1.22 2.03-2.6 2.75-4.08a17.82 17.82 0 0 0-2.74-4.08ZM14 21c-3.05 0-5.42-1.76-7.07-3.58A17.13 17.13 0 0 1 4.56 14c.27-.53 1.08-1.98 2.37-3.42C8.58 8.76 10.95 7 14 7c3.05 0 5.42 1.76 7.07 3.58 1.29 1.44 2.1 2.89 2.37 3.42-.27.53-1.08 1.98-2.37 3.42C19.42 19.24 17.05 21 14 21Z"></path><path fill="currentColor" fill-rule="evenodd" d="M10 14a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm1 0a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"></path></svg>
              }
            </div>
            {
              passwordValid ?
                null :
                <div className="inValid-alert">비밀번호는 8자 이상, 특수문자를 포함해야 합니다</div>
            }
            {
              isPasswordEmpty ?
                <div className="inValid-alert">비밀번호를 입력해주세요</div> :
                null
            }
          </div>
          <span onClick={() => { signUp(name, email, password) }} className="signUp-submit">회원가입</span>
          <div onClick={() => { navigate('/logIn') }} className="signUp-etc">로그인</div>
        </div>
      </div >
    </div>
  )
}

export { SignUp };