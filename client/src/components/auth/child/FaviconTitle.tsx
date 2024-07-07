import favicon from '../../../assets/images/favicon.png';

export default function FaviconTitle() {
    return (
        <div className='logIn-title'>
            <img src={favicon} className="logIn-title-img-light" alt='제목' />
            <span className="logIn-title-name">JeayBit</span>
        </div>
    )
}