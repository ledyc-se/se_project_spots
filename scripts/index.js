const initialCards = [
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editFormElement = document.querySelector(".modal__form");
const editModal = document.querySelector("#edit-modal");
const cardSubmitBtn = document.querySelector(".modal__button");
const editModalCloseBtn = document.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardFormModalNewPost = cardModal.querySelector(".modal__form");
const editCardNameInput = cardModal.querySelector("#add-card-name-input");
const editCardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn-preview"
);

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", closeModalOverlay);
  document.addEventListener("keydown", handleEscape);
}

function closeModalOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    editFormElement.querySelector(".modal__submit-btn")
  );

  openModal(editModal);
});

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", closeModalOverlay);

  document.removeEventListener("keydown", handleEscape);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: editCardNameInput.value,
    link: editCardLinkInput.value,
  };

  evt.target.reset(editCardNameInput.value);
  evt.target.reset(editCardLinkInput.value);

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(cardModal);

  disableButton(cardSubmitBtn);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);

    previewModalCaptionEl.textContent = data.name;

    previewModalImgEl.src = data.link;
    previewModalImgEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  return cardElement;
}

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

cardFormModalNewPost.addEventListener("submit", handleNewPostFormSubmit);

initialCards.forEach((card) => {
  const cardElement = getCardElement(card);
  cardsList.append(cardElement);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const modalOpened = document.querySelector(".modal_opened");
    if (modalOpened) {
      closeModal(modalOpened);
    }
  }
}
