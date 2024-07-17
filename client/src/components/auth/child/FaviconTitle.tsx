import favicon from '../../../assets/images/favicon.png';
import '../../../styles/favicon/faviconTitle.css'

export default function FaviconTitle() {
    return (
        <>
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Hind&display=swap');
            </style>
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Asap+Condensed:wght@300&family=Barlow:ital@1&family=Fira+Sans:ital,wght@1,300&family=Gowun+Batang&family=Roboto+Flex&display=swap');
            </style>
            <div className='favicon-title'>
                <img src={favicon} className="favicon-title-img" alt='제목' />
                <span className="favicon-title-name">JeayBit</span>
            </div>
        </>
    )
}