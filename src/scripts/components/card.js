function getCardElement(templateSelector) {
  return document
    .querySelector(templateSelector)
    .content.querySelector('.card')
    .cloneNode(true);
}

export function handleLikeClick(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export function handleDeleteCard(evt) {
  const cardElement = evt.target.closest('.card');
  cardElement.remove();
}

export function createCard(
  data,
  templateSelector,
  handleCardClick,
  handleLikeClick,
  handleDeleteCard
) {
  const cardElement = getCardElement(templateSelector);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  cardImage.addEventListener('click', () => handleCardClick(data.name, data.link));
  likeButton.addEventListener('click', handleLikeClick);
  deleteButton.addEventListener('click', handleDeleteCard);

  return cardElement;
}
