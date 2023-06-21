import React from 'react';
function InfoTooltip ({ isOpen, isCorrect, onClose, message }) {
    return (
        <div className={isOpen? `popup popup-success popup_opened` : `popup popup-error`}>
            <div className="popup__container">
                <button type="button" className="popup__button-close" onClick={onClose}></button>
                <p className={message? message.isCorrect? 'popup__information_success' : 'popup__information_error' : ''}></p>
                <h3 className="popup__information">{message? message.message : ''}</h3>
            </div>
        </div>   
    )
}

export default InfoTooltip ;