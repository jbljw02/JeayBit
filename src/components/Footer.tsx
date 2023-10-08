import { useNavigate } from "react-router-dom";

const Footer = () => {

  const navigate = useNavigate();

  return (
    <footer className='footer'>
      <div>이미 계정이 있으신가요?
        <span onClick={() => { navigate('/logIn') }} className="logIn">&nbsp;&nbsp;로그인</span>
      </div>
    </footer>
  )
}

export { Footer };