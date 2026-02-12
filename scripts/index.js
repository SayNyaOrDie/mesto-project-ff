const cardTemplate = document.querySelector('#card-template').content;

const placesList = document.querySelector('.places__list');

function deleteCard(cardElement) {
  cardElement.remove();
}

function createCard(cardData, deleteCallback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', function () {
    deleteCallback(cardElement);
  });

  return cardElement;
}

initialCards.forEach(function (cardData) {
  const cardElement = createCard(cardData, deleteCard);
  placesList.append(cardElement);
});
