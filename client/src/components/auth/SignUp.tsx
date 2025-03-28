import { useRef, useState } from "react";
import axios from "axios";
import FaviconTitle from "./child/AuthHeader";
import InputWarning from "../input/InputWarning";
import FormInput from "../input/FormInput";
import formValueChange from "../../utils/form/formValueChange";
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import AuthButton from "./child/AuthButton";
import '../../styles/auth/authContainer.css'
import Divider from "./child/Divider";
import KakaoLoginButton from "./child/KakaoLoginButton";
import HeaderNav from "../header/HeaderNav";
import { useAppDispatch } from "../../redux/hooks";
import { showNoticeModal } from "../../redux/features/ui/modalSlice";
import PICheckbox from "./child/PICheckbox";
import AuthNavigateLabel from "./child/AuthNavigateLabel";

const API_URL = process.env.REACT_APP_API_URL;
const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z]{2,}$/;
const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export default function SignUp() {
  const dispatch = useAppDispatch();

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const [activeInput, setActiveInput] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [isNameEmpty, setIsNameEmpty] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false); // 이메일 유효여부
  const [isEmailDuplicate, setIsEmailDuplicate] = useState<boolean>(false); // 이메일 중복여부
  const [isEmailEmpty, setIsEmailEmpty] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false); // 비밀번호 유효여부
  const [isPasswordEmpty, setIsPasswordEmpty] = useState<boolean>(false);
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const [invalidSubmit, setInvalidSubmit] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [signUpModal, setSignUpModal] = useState<boolean>(false);

  const [isAgreeForPersonalInfo, setIsAgreeForPersonalInfo] = useState<boolean>(false);
  const [isVibrate, setIsVibrate] = useState<boolean>(false);

  const submitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);

    // 이메일 또는 패스워드가 비어있으면 작업 X
    if (!email || !password || !name) {
      if (!email) {
        setIsEmailEmpty(true);
      }
      if (!password) {
        setIsPasswordEmpty(true);
      }
      if (!name) {
        setIsNameEmpty(true);
      }
    }

    // 이메일 유효성 검사
    if (email.match(emailPattern)) {
      setEmailInvalid(false);
    }
    else {
      setEmailInvalid(true);
    }

    // 비밀번호 유효성 검사
    if (password.match(passwordPattern)) {
      setPasswordInvalid(false);
    }
    else {
      setPasswordInvalid(true);
    }

    // 개인정보 처리방침 동의 여부
    if (isAgreeForPersonalInfo) {
      setIsAgreeForPersonalInfo(true);
    }
    else {
      setIsAgreeForPersonalInfo(false);

      // 개인정보 처리방침에 동의하지 않았을 경우 진동 효과
      setIsVibrate(true);
      setTimeout(() => {
        setIsVibrate(false);
      }, 1000);
    }

    /*
      1. 공란이 없어야 함
      2. 이메일이 정규식을 통과
      3. 비밀번호가 정규식을 통과
      4. 개인정보 처리방침 동의 여부
    */
    if (name &&
      !isNameEmpty &&
      email &&
      !emailInvalid &&
      !isEmailDuplicate &&
      !isEmailEmpty &&
      password &&
      !passwordInvalid &&
      !isPasswordEmpty &&
      isAgreeForPersonalInfo) {
      signUp();
    }
  }

  const signUp = async () => {
    const data = {
      username: name,
      email: email,
      password: password,
    }

    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }

    try {
      setIsNameEmpty(false);
      setIsEmailEmpty(false);
      setIsPasswordEmpty(false);

      await axios.post(`${API_URL}/api/user/`, data, {
        withCredentials: true,
      });

      setInvalidSubmit(false);
      setIsSubmitted(false);
      setSignUpModal(true);

      dispatch(showNoticeModal({
        content: '회원가입이 완료되었습니다.',
        buttonLabel: '로그인',
        actionType: 'REDIRECT_LOGIN'
      }))
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.error === '이름, 비밀번호, 이메일 모두 존재하지 않음') {
          setIsNameEmpty(true);
          setIsEmailEmpty(true);
          setIsPasswordEmpty(true);
        }
        if (error.response.data.error === '이름이 존재하지 않음') {
          setInvalidSubmit(true);
        }
        if (error.response.data.error === '이메일이 존재하지 않음') {
          setIsEmailEmpty(true);
        }
        if (error.response.data.error === '비밀번호가 존재하지 않음') {
          setIsPasswordEmpty(true);
        }
        if (error.response.data.error === '이미 사용중인 이메일') {
          setIsEmailDuplicate(true);
        }
      }
    } finally {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
    }
  }

  return (
    <div className="auth-container">
      <LoadingBar color="#29D" ref={loadingBarRef} />
      <HeaderNav />
      <div className="auth-section">
        <FaviconTitle
          title="회원가입"
          subtitle="JeayBit에 오신 것을 환영합니다!" />
        <div className="auth-form-container">
          <form onSubmit={submitSignUp} className="form-auth" noValidate>
            <FormInput
              type="text"
              value={name}
              placeholder="이름"
              isActive={activeInput === 'name'}
              isEmpty={isNameEmpty}
              onChange={(e) => formValueChange(e.target.value,
                isSubmitted,
                setName,
                setIsNameEmpty)}
              onClick={() => setActiveInput('name')}
              isSubmitted={isSubmitted} />
            <InputWarning
              isEmpty={isNameEmpty}
              label="이름을 입력해주세요"
              isSubmitted={isSubmitted} />
            <FormInput
              type="email"
              value={email}
              placeholder="이메일"
              isActive={activeInput === 'email'}
              isEmpty={isEmailEmpty}
              onChange={(e) => formValueChange(e.target.value,
                isSubmitted,
                setEmail,
                setIsEmailEmpty,
                emailPattern,
                setEmailInvalid,
                setIsEmailDuplicate)}
              onClick={() => setActiveInput('email')}
              invalidSubmit={isEmailDuplicate}
              isSubmitted={isSubmitted}
              invalidPattern={emailInvalid} />
            <InputWarning
              isEmpty={emailInvalid || isEmailDuplicate || isEmailEmpty}
              label={emailInvalid ? "유효한 이메일을 입력해주세요" :
                isEmailDuplicate ? "이미 존재하는 이메일입니다" :
                  "이메일을 입력해주세요"}
              isSubmitted={isSubmitted}
              isInvalid={emailInvalid || isEmailDuplicate} />
            <FormInput
              type="password"
              value={password}
              placeholder="비밀번호"
              isActive={activeInput === 'password'}
              isEmpty={isPasswordEmpty}
              onChange={(e) => formValueChange(e.target.value,
                isSubmitted,
                setPassword,
                setIsPasswordEmpty,
                passwordPattern,
                setPasswordInvalid)}
              onClick={() => setActiveInput('password')}
              isPasswordVisible={visiblePassword}
              onPasswordClick={() => setVisiblePassword(!visiblePassword)}
              isSubmitted={isSubmitted}
              invalidPattern={passwordInvalid} />
            <InputWarning
              isEmpty={passwordInvalid}
              label="비밀번호는 8자 이상, 특수문자를 포함해야 합니다"
              isSubmitted={isSubmitted}
              isInvalid={passwordInvalid} />
            <InputWarning
              isEmpty={isPasswordEmpty}
              label="비밀번호를 입력해주세요"
              isSubmitted={isSubmitted} />
            <AuthButton label="회원가입" />
          </form>
          <Divider />
          <KakaoLoginButton />
          <div className="auth-footer">
            <PICheckbox
              isAgreeForPersonalInfo={isAgreeForPersonalInfo}
              setIsAgreeForPersonalInfo={setIsAgreeForPersonalInfo}
              isVibrate={isVibrate}
              isSubmitted={isSubmitted} />
            <AuthNavigateLabel
              label="이미 계정이 있으신가요?"
              navigateString="/login"
              destinationLabel="로그인" />
          </div>
        </div>
      </div>
    </div>
  )
}