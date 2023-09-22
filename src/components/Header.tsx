import { useDispatch, useSelector } from 'react-redux';
import title from '../assets/images/title.png';
import { RootState, setTheme } from '../store';
import { dark_borderColor } from "../assets/theme";

const Header = () => {

  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  // console.log("테마 : ", theme)

  const themeChange = () => {
    
    dispatch(setTheme(!theme));
    let temp = document.querySelectorAll('.lightMode, .darkMode');

    temp.forEach(element => {
      if (!theme) {
        console.log("1")
        element.classList.remove('lightMode');
        element.classList.add('darkMode');
      }
      else {
        console.log("2")
        element.classList.remove('darkMode');
        element.classList.add('lightMode');
      }
    })
}


  return (
    <header className="header lightMode">
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
        <img src={title} className="title-img" alt='제목'></img>
        <span className="title-name">J TradingView</span>
        {
          theme === true ?
            <svg onClick={() => themeChange()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="changeTheme">
              <path d="M20.968 12.768a7 7 0 01-9.735-9.735 9 9 0 109.735 9.735z" fill="currentColor"></path>
            </svg> :
            <svg onClick={() => themeChange()} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="changeTheme">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 2h3v3h-3V2zM16 12a4 4 0 11-8 0 4 4 0 018 0zM5.99 3.869L3.867 5.99 5.99 8.112 8.111 5.99 5.989 3.87zM2 13.5v-3h3v3H2zm1.868 4.51l2.121 2.12 2.122-2.12-2.122-2.122-2.121 2.121zM13.5 19v3h-3v-3h3zm4.51-3.112l-2.121 2.122 2.121 2.121 2.121-2.121-2.121-2.122zM19 10.5h3v3h-3v-3zm-3.11-4.51l2.12 2.121 2.122-2.121-2.121-2.121-2.122 2.121z" fill="currentColor"></path>
            </svg>
        }
      </div>
    </header>
  );
}

export { Header };