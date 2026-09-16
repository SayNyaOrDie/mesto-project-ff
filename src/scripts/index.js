import '../pages/index.css';

import { initialCards } from './cards.js';
import { createCard, handleLikeClick, handleDeleteCard } from './components/card.js';
import { openModal, closeModal, handleOverlayClose } from './components/modal.js';

const cardTemplateSelector = '#card-template';
const placesList = document.querySelector('.places__list');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const popups = document.querySelectorAll('.popup');

const imagePopupImage = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');

const editProfileForm = editProfilePopup.querySelector('.popup__form');
const nameInput = editProfileForm.querySelector('.popup__input_type_name');
const jobInput = editProfileForm.querySelector('.popup__input_type_description');

const addCardForm = addCardPopup.querySelector('.popup__form');
const placeNameInput = addCardForm.querySelector('.popup__input_type_card-name');
const placeLinkInput = addCardForm.querySelector('.popup__input_type_url');

function handleCardClick(name, link) {
  imagePopupImage.src = link;
  imagePopupImage.alt = name;
  imagePopupCaption.textContent = name;
  openModal(imagePopup);
}

function renderCard(cardData) {
  return createCard(
    cardData,
    cardTemplateSelector,
    handleCardClick,
    handleLikeClick,
    handleDeleteCard
  );
}

function handleEditProfileOpen() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editProfilePopup);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();

  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;

  closeModal(editProfilePopup);
}

function handleAddCardOpen() {
  addCardForm.reset();
  openModal(addCardPopup);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };
  placesList.prepend(renderCard(newCardData));

  addCardForm.reset();
  closeModal(addCardPopup);
}

profileEditButton.addEventListener('click', handleEditProfileOpen);
profileAddButton.addEventListener('click', handleAddCardOpen);

editProfileForm.addEventListener('submit', handleEditProfileSubmit);
addCardForm.addEventListener('submit', handleAddCardSubmit);

popups.forEach((popup) => {
  popup.addEventListener('mousedown', handleOverlayClose);

  const closeButton = popup.querySelector('.popup__close');
  closeButton.addEventListener('click', () => closeModal(popup));
});

initialCards.forEach((cardData) => {
  placesList.append(renderCard(cardData));
});
