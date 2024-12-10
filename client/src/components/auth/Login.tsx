import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import { useAppDispatch } from "../../redux/hooks";
import FormInput from "../input/FormInput";
import InputWarning from "../input/InputWarning";
import FaviconTitle from "./child/FaviconTitle";
import formValueChange from "../../utils/formValueChange";
import '../../styles/auth/authContainer.css'
import { setUserInfo } from "../../redux/features/userSlice";
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import AuthButton from "./child/AuthButton";
import AuthFooter from "./child/AuthFooter";
import Divider from "./child/Divider";
import KakaoLoginButton from "./child/KakaoLoginButton";
import HeaderNav from "../header/HeaderNav";

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeInput, setActiveInput] = useState<string>('');
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [invalidSubmit, setInvalidSubmit] = useState<boolean>(false);

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);

    // 이메일 또는 패스워드가 비어있으면 작업 X
    if (!email || !password) {
      if (!email) {
        setIsEmailEmpty(true);
      }
      if (!password) {
        setIsPasswordEmpty(true);
      }
      return;
    }

    loadingBarRef.current?.continuousStart();

    try {
      setIsEmailEmpty(false);
      setIsPasswordEmpty(false);

      const data = { email, password };
      const response = await axios.post(`${API_URL}/login/`, data, {
        withCredentials: true,
      });

      dispatch(setUserInfo({
        name: response.data.name,
        email: response.data.email,
      }))
      setInvalidSubmit(false);
      setIsSubmitted(false);

      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.error === '이메일, 비밀번호 모두 존재하지 않음') {
          setIsEmailEmpty(true);
          setIsPasswordEmpty(true);
        }
        if (error.response.data.error === '이메일이 존재하지 않음') {
          setIsEmailEmpty(true);
        }
        if (error.response.data.error === '비밀번호가 존재하지 않음') {
          setIsPasswordEmpty(true);
        }
        if (error.response.data.error === '잘못된 이메일 혹은 비밀번호') {
          setInvalidSubmit(true);
        }
      }
    } finally {
      loadingBarRef.current?.complete();
    }
  };

  return (
    <div className="auth-container">
      <LoadingBar color="#29D" ref={loadingBarRef} />
      <HeaderNav />
      <div className="auth-section">
        <FaviconTitle
          title="로그인"
          subtitle="24시간 깨어있는 JeayBit과 함께하세요." />
        <div className="auth-form-container">
          <form onSubmit={submitLogin} className="form-auth" noValidate>
            <FormInput
              type="email"
              value={email}
              placeholder="이메일"
              isActive={activeInput === 'email'}
              isEmpty={isEmailEmpty}
              onChange={(e) => formValueChange(e.target.value,
                isSubmitted,
                setEmail,
                setIsEmailEmpty)}
              onClick={() => setActiveInput('email')}
              invalidSubmit={invalidSubmit}
              isSubmitted={isSubmitted} />
            <InputWarning
              isEmpty={isEmailEmpty}
              isSubmitted={isSubmitted}
              label="이메일을 입력해주세요" />
            <FormInput
              type="password"
              value={password}
              placeholder="비밀번호"
              isActive={activeInput === 'password'}
              isEmpty={isPasswordEmpty}
              onChange={(e) => formValueChange(e.target.value,
                isSubmitted,
                setPassword,
                setIsPasswordEmpty)}
              onClick={() => setActiveInput('password')}
              isPasswordVisible={visiblePassword}
              onPasswordClick={() => setVisiblePassword(!visiblePassword)}
              invalidSubmit={invalidSubmit}
              isSubmitted={isSubmitted} />
            <InputWarning
              isEmpty={isPasswordEmpty}
              isSubmitted={isSubmitted}
              label="비밀번호를 입력해주세요" />
            <InputWarning
              isEmpty={invalidSubmit}
              label="이메일 혹은 비밀번호가 일치하지 않습니다"
              isSubmitted={isSubmitted} />
            <AuthButton
              label="로그인" />
          </form>
          <Divider />
          <KakaoLoginButton />
          <AuthFooter
            label="아직 계정이 없으신가요?"
            navigateString="/signUp" />
        </div>
      </div>
    </div>
  )
}