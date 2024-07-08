import { SetStateAction, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import favicon from '../../assets/images/favicon.png';
import FaviconTitle from "./child/FaviconTitle";
import InputWarning from "../input/InputWarning";
import FormInput from "../input/FormInput";
import formValueChange from "../../utils/formValueChange";
import SignUpModal from "../modal/SignUpModal";
import HeaderNav from "../../header/HeaderNav";

export default function SignUp() {
  const navigate = useNavigate();

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

  const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z]{2,}$/;
  const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

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
      return;
    }

    if (email.match(emailPattern)) {
      setEmailInvalid(false);
    }
    else {
      setEmailInvalid(true);
      return;
    }

    if (password.match(passwordPattern)) {
      setPasswordInvalid(false);
    }
    else {
      setPasswordInvalid(true);
      return;
    }

    const data = {
      username: name,
      email: email,
      password: password,
    }

    try {
      setIsNameEmpty(false);
      setIsEmailEmpty(false);
      setIsEmailDuplicate(false);
      setIsPasswordEmpty(false);

      const response = await axios.post('http://127.0.0.1:8000/sign_up/', data, {
        withCredentials: true,
      });

      setInvalidSubmit(false);
      setIsSubmitted(false);
      setSignUpModal(true);

      console.log("회원가입 성공: ", response);
    } catch (error) {
      console.error("에러: ", error)
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
    }
  }

  return (
    <>
      <SignUpModal
        isModalOpen={signUpModal}
        setIsModalOpen={setSignUpModal} />
      <div className="container-signUp">
        <HeaderNav />
        <div className="div-signUp">
          <FaviconTitle />
          <form onSubmit={submitSignUp} className="view-signUp">
            <div className="section-name">
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
                warningString="이름을 입력해주세요"
                isSubmitted={isSubmitted} />
            </div>
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
                  setIsEmailEmpty,
                  setEmailInvalid,
                  emailPattern)}
                onClick={() => setActiveInput('email')}
                invalidSubmit={isEmailDuplicate}
                isSubmitted={isSubmitted}
                invalidPattern={emailInvalid} />
              <InputWarning
                isEmpty={emailInvalid}
                warningString="유효한 이메일을 입력해주세요"
                isSubmitted={isSubmitted}
                isInvalid={emailInvalid} />
              <InputWarning
                isEmpty={isEmailDuplicate}
                warningString="이미 존재하는 이메일입니다"
                isSubmitted={isSubmitted}
                isInvalid={isEmailDuplicate} />
              <InputWarning
                isEmpty={isEmailEmpty}
                warningString="이메일을 입력해주세요"
                isSubmitted={isSubmitted} />
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
                  setIsPasswordEmpty,
                  setPasswordInvalid,
                  passwordPattern)}
                onClick={() => setActiveInput('password')}
                isPasswordVisible={visiblePassword}
                onPasswordClick={() => setVisiblePassword(!visiblePassword)}
                isSubmitted={isSubmitted}
                invalidPattern={passwordInvalid} />
              <InputWarning
                isEmpty={passwordInvalid}
                warningString="비밀번호는 8자 이상, 특수문자를 포함해야 합니다"
                isSubmitted={isSubmitted}
                isInvalid={passwordInvalid} />
              <InputWarning
                isEmpty={isPasswordEmpty}
                warningString="비밀번호를 입력해주세요"
                isSubmitted={isSubmitted} />
            </div>
            <button
              type="submit"
              className="signUp-submit">
              회원가입
            </button>
            <span onClick={() => { navigate('/logIn') }} className="signUp-etc">이미 계정이 있으신가요?</span>
          </form>
        </div>
      </div>
    </>
  )
}