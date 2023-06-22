import React from 'react';
import Header from './Header';
import { api } from '../utils/api';
import {useNavigate} from 'react-router-dom';
function Register({ onAuth, setMessage, isLogin }) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({email: '', password: ''});
    //Получение и запись значений из инпутов
    function handleChange(evt) {
        const {name, value} = evt.target;
        setUser((state) => ({...state, [name]: value}));
    }
    //Отправка данных на сервер и регистрация пользователя
    function handleSubmit(evt) {
        evt.preventDefault();
        api.registration(user.password, user.email)
        .then((user) => {
            onAuth();
            setMessage({
                message: "Вы успешно зарегистрировались!",
                isCorrect: true
            });
            navigate('/sign-in', {replace: true});
        })
        .catch((err) => {
            onAuth();
            setMessage({
                message: "Что-то пошло не так! Попробуйте еще раз.",
                isCorrect: false
            });
        });
    }
    return (
        <>
        <Header link={'sign-in'} text={'Войти'} isLogin={isLogin}/>
        <div className="sign" >
            <div className="sign__container">
                <h2 className="sign__header">Регистрация</h2>
                <form className="sign__form" onSubmit={handleSubmit}>
                    <input className="sign__input" type="email" name="email" required placeholder="Email" onChange={handleChange} value={setUser.email}></input>
                    <input className="sign__input" type="password" name="password" required placeholder="Пароль" onChange={handleChange} value={setUser.password}></input>
                    <button className="sign__button" type="submit">Зарегистрироваться</button>
                </form>
                <a className="sign__link" href="sign-in">Уже зарегистрированы? Войти</a>
            </div>
        </div>
        
        </>
    )
}
export default Register;