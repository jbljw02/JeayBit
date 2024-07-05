import { HeaderNav } from "./Header";
import favicon from '../assets/images/favicon.png';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import FormInput from "./input/FormInput";
import InputWarning from "./input/InputWarning";

export default function LogIn() {
  const navigate = useNavigate();

  const [activeInput, setActiveInput] = useState<string>('');
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);
  const [invalidSubmit, setInvalidSubmit] = useState<boolean>(false);

  const dispatch = useDispatch();

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 이메일 또는 패스워드가 비어있으면 로그인 작업 X
    if (!email || !password) {
      if (!email) {
        setIsEmailEmpty(true);
      }
      if (!password) {
        setIsPasswordEmpty(true);
      }
      return;
    }

    setIsEmailEmpty(false);
    setIsPasswordEmpty(false);

    try {
      const data = { email, password };
      const response = await axios.post('http://127.0.0.1:8000/logIn/', data, {
        withCredentials: true,
      });

      dispatch(setUser({
        name: response.data.name,
        email: response.data.email,
      }));
      setInvalidSubmit(false);

      navigate('/');
    } catch (error) {
      // 로그인 정보 불일치
      setInvalidSubmit(true);
    }
  };

  return (
    <div className="container-logIn">
      <HeaderNav />
      <div className="div-logIn">
        <div className='logIn-title'>
          <img src={favicon} className="logIn-title-img-light" alt='제목' />
          <span className="logIn-title-name">JeayBit</span>
        </div>
        <form onSubmit={submitLogin} className="view-logIn" noValidate>
          <div className="section-email">
            <FormInput
              type="email"
              value={email}
              placeholder="이메일"
              isActive={activeInput === 'email'}
              isEmpty={isEmailEmpty}
              onChange={(e) => setEmail(e.target.value)}
              onClick={() => setActiveInput('email')}
              invalidSubmit={invalidSubmit} />
            <InputWarning
              isInvalid={isEmailEmpty}
              warningString="이메일을 입력해주세요" />
          </div>
          <div className="section-password">
            <FormInput
              type="password"
              value={password}
              placeholder="비밀번호"
              isActive={activeInput === 'password'}
              isEmpty={isPasswordEmpty}
              onChange={(e) => setPassword(e.target.value)}
              onClick={() => setActiveInput('password')}
              isPasswordVisible={visiblePassword}
              onPasswordClick={() => setVisiblePassword(!visiblePassword)}
              invalidSubmit={invalidSubmit} />
            <InputWarning
              isInvalid={isPasswordEmpty}
              warningString="비밀번호를 입력해주세요" />
          </div>
          <InputWarning
            isInvalid={invalidSubmit}
            warningString="이메일 혹은 비밀번호가 일치하지 않습니다"
          />
          <button type="submit" className="logIn-submit">
            로그인
          </button>
          <div className="logIn-etc">
            <span onClick={() => navigate('/signUp')}>회원가입</span>
            <span>비밀번호를 잊으셨나요?</span>
          </div>
        </form>
      </div>
    </div>
  )
}