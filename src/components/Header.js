import headerLogo from '../images/Vector.svg';
function Header({ link, email, text, onClick, children, active, isLogin }) {
    return (
        <>
        <header className="header">
            <img
                src={headerLogo}
                alt="Логотип"
                className="header__logo logo"/>
            {children}
            <div className={isLogin? 'header__links' : 'header__links_auth'}>    
                <p className='header__email'>{email}</p>
                <a className={`header__link ${active}`} onClick={onClick} href={link}>{text}</a>
            </div>
        </header>
        </>
    )
}
export default Header;