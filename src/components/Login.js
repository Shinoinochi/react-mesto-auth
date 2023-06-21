import React from 'react';
import Header from './Header';
import { api } from '../utils/api';
import {useNavigate} from 'react-router-dom';
function Login({ onAuth, setMessage, login, isLogin }) {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({email: '', password: ''});
     //Получение и запись значений из инпутов
    function handleChange(evt) {
        const {name, value} = evt.target;
        setUser((state) => ({...state, [name]: value}));
    }
    //Отправка данных на сервер, установка токена и вход пользователя
    function handleSubmit(evt) {
        evt.preventDefault();
        api.login(user.password, user.email)
        .then((user) => {
            if(user.token) {
                localStorage.setItem('token', user.token);
                setUser({email: '', password: ''});
                login();
                navigate('/', {replace: true})
            }
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
        <Header link={'sign-in'} text={'Регистрация'} isLogin={isLogin}/>
        <div className="sign" >
            <div className="sign__container">
                <h2 className="sign__header">Вход</h2>
                <form className="sign__form" onSubmit={handleSubmit}>
                    <input className="sign__input" type="email" name="email" placeholder="Email" required onChange={handleChange} value={setUser.email}></input>
                    <input className="sign__input" type="password" name="password" placeholder="Пароль" required onChange={handleChange} value={setUser.password}></input>
                    <button className="sign__button" type="submit">Войти</button>
                </form>
            </div>
        </div>
        </>
    )
}
export default Login;