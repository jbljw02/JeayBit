import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import FormInput from "../input/FormInput";
import InputWarning from "../input/InputWarning";
import FaviconTitle from "./child/FaviconTitle";
import formValueChange from "../../utils/formValueChange";
import HeaderNav from "../../header/HeaderNav";
import '../../styles/auth/login.css'
import AuthButton from "../button/AuthButton";
import { setUser } from "../../redux/features/userSlice";

export default function LogIn() {
  const navigate = useNavigate();

  const [activeInput, setActiveInput] = useState<string>('');
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [invalidSubmit, setInvalidSubmit] = useState<boolean>(false);

  const dispatch = useDispatch();

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

    try {
      setIsEmailEmpty(false);
      setIsPasswordEmpty(false);

      const data = { email, password };
      const response = await axios.post('http://127.0.0.1:8000/logIn/', data, {
        withCredentials: true,
      });

      dispatch(setUser({
        name: response.data.name,
        email: response.data.email,
      }));
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
    }
  };

  return (
    <>
      <HeaderNav />
      <div className="container-login">
        <FaviconTitle />
        <form onSubmit={submitLogin} className="form-login" noValidate>
          <div className="section-email">
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
          </div>
          <div className="section-password">
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
          </div>
          <InputWarning
            isEmpty={invalidSubmit}
            label="이메일 혹은 비밀번호가 일치하지 않습니다"
            isSubmitted={isSubmitted} />
          <AuthButton
            label="로그인" />
          <div className="login-footer">
            <span onClick={() => navigate('/signUp')}>회원가입</span>
            <span>비밀번호를 잊으셨나요?</span>
          </div>
        </form>
      </div>
    </>
  )
}