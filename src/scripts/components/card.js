import { likeCard, unlikeCard, deleteCard } from './api.js';

function getCardElement(templateSelector) {
  return document
    .querySelector(templateSelector)
    .content.querySelector('.card')
    .cloneNode(true);
}

export function handleLikeClick(cardId, likeButton, likeCountElement) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const request = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  request
    .then((cardData) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCountElement.textContent = cardData.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function handleDeleteCard(cardId, cardElement) {
  return deleteCard(cardId).then(() => cardElement.remove());
}

export function createCard(
  data,
  currentUserId,
  templateSelector,
  handleCardClick,
  handleLikeClick,
  handleDeleteCardClick
) {
  const cardElement = getCardElement(templateSelector);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  likeCountElement.textContent = data.likes.length;

  const isLiked = data.likes.some((user) => user._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  const isOwnCard = data.owner._id === currentUserId;
  if (isOwnCard) {
    deleteButton.addEventListener('click', () => handleDeleteCardClick(data._id, cardElement));
  } else {
    deleteButton.remove();
  }

  cardImage.addEventListener('click', () => handleCardClick(data.name, data.link));
  likeButton.addEventListener('click', () => handleLikeClick(data._id, likeButton, likeCountElement));

  return cardElement;
}
