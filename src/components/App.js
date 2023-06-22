import Main from './Main.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import Login from './Login.js'
import React from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { CurrentUserContext } from '../context/CurrentUserContext.js';
import { api } from '../utils/api.js';
import Register from './Register.js';
import ProtectedRouteElement from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip.js';

function App() {
    const menu = document.querySelector('.menu');
    const button = document.querySelector('.header__button');
    const [isEditAvatarClicked, setIsEditAvatarClicked] = React.useState(false);
    const [isEditProfileClicked, setIsEditProfileClicked] = React.useState(false);
    const [isAddPlaceClicked, setIsAddPlaceClicked] = React.useState(false);
    const [isAuth, setIsAuth] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [loading, isLoading] = React.useState(false);
    const [login, isLogin] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const navigate = useNavigate();
    //Получение данных о пользователе и карточках
    React.useEffect(() => {
        Promise.all([
            api.getUserData(),
            api.getInitialCards()
        ])
        .then(([user, cards]) => {
            setCurrentUser(user);
            setCards(cards);
        })
        .catch(err => {
            console.log(err.status);
        })
    }, []);
    //Блок авторизации
    React.useEffect(() => {
        handleTokenCheck();
      }, [navigate]);
    function authMessage(message) {
        setMessage(message);
    }
    function handleAuth() {
        setIsAuth(!isAuth);
    }
    function handleLoginChange() {
        isLogin(!login);
    }
    function handleTokenCheck() {
        if(localStorage.getItem('token')) {
            const jwt = localStorage.getItem('token');
            api.checkToken(jwt).then((res) => {
                setEmail(res.data.email);
                isLogin(true);
                navigate('/', {replace: true});
            })
            .catch((err) => {
                console.log(err.status);
            });
        }
    }
    //Открытие бургер-меню
    function handleMenuClick() {
        menu.classList.toggle('menu_active');
        button.classList.toggle('header__button_active');
    }
    //Выход из аккаунта
    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/sign-in', {replace: true});
        isLogin(false);
    }
    //Удаление карточки
    function handleCardDelete(card) {
        api.deleteCard(card._id)
        .then(() => {
            setCards((state) => state.filter((c) => c._id !== card._id));
        })
        .catch((err) => {
            console.log(err.status);
        });
    }
    //Обновление данных пользователя
    function handleUpdateUser(userData) {
        isLoading(true);
        api.editUser(userData.name, userData.about)
        .then((data) => {
            setCurrentUser(data);
            closeAllPopups();
        })
        .catch((err) => {
            console.log(err.status);
        })
        .finally(() => {
            isLoading(false);
        });
    }
    //Обновление аватара пользователя
    function handleUpdateAvatar(userData) {
        isLoading(true);
        api.setUserLogo(userData.avatar)
        .then((data) => {
            setCurrentUser(data);
            closeAllPopups();
        })
        .catch((err) => {
            console.log(err.status);
        })
        .finally(() => {
            isLoading(false);
        });
    }
    //Лайк
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
            console.log(err.status);
        })
    }
    //Добавление новой карточки
    function handleAddPlaceSubmit(card) {
        isLoading(true);
        api.addNewCard(card)
        .then(newCard => {
            setCards([newCard, ...cards]);
            closeAllPopups();
        })
        .catch((err) => {
            console.log(err.status);
        })
        .finally(() => {
            isLoading(false);
        });
    }
    //Открытие фотографии карточки
    function handleCardClick (card) {
        setSelectedCard(card);
    }
    //Открытие попата смена аватара
    function handleEditAvatarClick() {
        setIsEditAvatarClicked(!isEditAvatarClicked);
    }
    //Открытие попапа смены данных пользователя
    function handleEditProfileClick() {
        setIsEditProfileClicked(!isEditProfileClicked);
    }
    //Открытие попапа добавления карточки
    function handleAddPlaceClick() {
        setIsAddPlaceClicked(!isAddPlaceClicked);
    }
    //Закрытие попапов
    function closeAllPopups() {
        setIsEditAvatarClicked(false);
        setIsEditProfileClicked(false);
        setIsAddPlaceClicked(false);
        setSelectedCard({});
        setIsAuth(false);
    }

  return (
        <div className="pages">
            <CurrentUserContext.Provider  value={currentUser}>
                <Routes>
                    <Route path="/sign-in" element={<Login isLogin={login}  onAuth={handleAuth} setMessage={authMessage} login={handleLoginChange} />} />
                    <Route path="/sign-up" element={<Register isLogin={login}  onAuth={handleAuth} setMessage={authMessage}/>} />
                    <Route path="/" element={
                        <ProtectedRouteElement loggedIn={login}> 
                            <Main 
                                onEditAvatar={handleEditAvatarClick}
                                onEditProfile={handleEditProfileClick}
                                onAddPlace={handleAddPlaceClick}
                                onCardClick={handleCardClick}
                                user={email}
                                handleCardLike={handleCardLike}
                                cards={cards}
                                logout={handleLogout}
                                onCardLike={handleCardLike}
                                onCardDelete={handleCardDelete}
                                onMenuClick={handleMenuClick}
                                isLogin={login}
                            />
                        </ProtectedRouteElement>}
                    />
                </Routes>
                <EditProfilePopup isOpen={isEditProfileClicked} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={loading} />
                <AddPlacePopup isOpen={isAddPlaceClicked} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isLoading={loading} />
                <EditAvatarPopup isOpen={isEditAvatarClicked} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={loading} />
                <ImagePopup card={selectedCard} onClose={closeAllPopups} />
                <InfoTooltip isOpen={isAuth} onAuth={handleAuth} onClose={closeAllPopups} message={message}/>
            </CurrentUserContext.Provider>
        </div>
  );
}

export default App;
