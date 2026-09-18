import '../pages/index.css';

import { createCard, handleLikeClick, handleDeleteCard } from './components/card.js';
import { openModal, closeModal, handleOverlayClose } from './components/modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  addCard,
  updateAvatar,
} from './components/api.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

const cardTemplateSelector = '#card-template';
const placesList = document.querySelector('.places__list');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');
const confirmPopup = document.querySelector('.popup_type_confirm');
const imagePopup = document.querySelector('.popup_type_image');
const popups = document.querySelectorAll('.popup');

const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

const editProfileForm = editProfilePopup.querySelector('.popup__form');
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const jobInput = editProfileForm.querySelector('.popup__input_type_description');
const editProfileSubmitButton = editProfileForm.querySelector('.popup__button');

const addCardForm = addCardPopup.querySelector('.popup__form');
const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = addCardForm.querySelector('.popup__input_type_url');
const addCardSubmitButton = addCardForm.querySelector('.popup__button');

const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarLinkInput = avatarForm.querySelector('.popup__input_type_avatar-link');
const avatarSubmitButton = avatarForm.querySelector('.popup__button');

const confirmForm = confirmPopup.querySelector('.popup__form');
const confirmSubmitButton = confirmForm.querySelector('.popup__button');

let currentUserId = null;
let cardIdToDelete = null;
let cardElementToDelete = null;

document.querySelectorAll('.popup__form .popup__button').forEach((buttonElement) => {
  buttonElement.dataset.defaultText = buttonElement.textContent;
});

function renderLoading(isLoading, buttonElement, loadingText = 'Сохранение...') {
  buttonElement.textContent = isLoading ? loadingText : buttonElement.dataset.defaultText;
}

function handleCardClick(name, link) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

function renderCard(cardData) {
  return createCard(
    cardData,
    currentUserId,
    cardTemplateSelector,
    handleCardClick,
    handleLikeClick,
    handleDeleteCardClick
  );
}

function handleEditProfileOpen() {
  nameInput.value = profileTitle.textContent.trim();
  jobInput.value = profileDescription.textContent.trim();
  clearValidation(editProfileForm, validationConfig);
  openModal(editProfilePopup);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, editProfileSubmitButton);

  updateUserInfo({ name: nameInput.value, about: jobInput.value })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editProfilePopup);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => renderLoading(false, editProfileSubmitButton));
}

function handleAddCardOpen() {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig);
  openModal(addCardPopup);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, addCardSubmitButton);

  addCard({ name: placeNameInput.value, link: placeLinkInput.value })
    .then((cardData) => {
      placesList.prepend(renderCard(cardData));
      addCardForm.reset();
      clearValidation(addCardForm, validationConfig);
      closeModal(addCardPopup);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => renderLoading(false, addCardSubmitButton));
}

function handleAvatarOpen() {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, avatarSubmitButton);

  updateAvatar({ avatar: avatarLinkInput.value })
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => renderLoading(false, avatarSubmitButton));
}

function handleDeleteCardClick(cardId, cardElement) {
  cardIdToDelete = cardId;
  cardElementToDelete = cardElement;
  openModal(confirmPopup);
}

function handleConfirmDeleteSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, confirmSubmitButton, 'Удаление...');

  handleDeleteCard(cardIdToDelete, cardElementToDelete)
    .then(() => {
      cardIdToDelete = null;
      cardElementToDelete = null;
      closeModal(confirmPopup);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => renderLoading(false, confirmSubmitButton));
}

profileEditButton.addEventListener('click', handleEditProfileOpen);
profileAddButton.addEventListener('click', handleAddCardOpen);
profileImage.addEventListener('click', handleAvatarOpen);

editProfileForm.addEventListener('submit', handleEditProfileSubmit);
addCardForm.addEventListener('submit', handleAddCardSubmit);
avatarForm.addEventListener('submit', handleAvatarSubmit);
confirmForm.addEventListener('submit', handleConfirmDeleteSubmit);

popups.forEach((popup) => {
  popup.addEventListener('mousedown', handleOverlayClose);

  const closeButton = popup.querySelector('.popup__close');
  closeButton.addEventListener('click', () => closeModal(popup));
});

enableValidation(validationConfig);

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      placesList.append(renderCard(cardData));
    });
  })
  .catch((err) => {
    console.log(err);
  });
