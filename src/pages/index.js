import "./index.css";
import {
  resetValidation,
  enableValidation,
  disableButton,
} from "../scripts/validation.js";
import { settings } from "../scripts/validation.js";
import logoSrc from "../images/spots-logo.svg";
import avatarSrc from "../images/avatar.jpg";
import pencilSrc from "../images/pencil-icon.svg";
import plusSrc from "../images/plus-sign-icon.svg";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const spotsLogo = document.getElementById("spotsLogo");
spotsLogo.src = logoSrc;
const spotsAvatar = document.getElementById("profile-avatar");
spotsAvatar.src = avatarSrc;
const spotsPencilIcon = document.getElementById("pencil-icon");
spotsPencilIcon.src = pencilSrc;
const spotsPlusIcon = document.getElementById("plus-icon");
spotsPlusIcon.src = plusSrc;
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

let selectedCard;
let selectedCardId;
let currentUserId;

//Delete
const deleteConfirmationModal = document.querySelector(
  "#delete-confirmation-modal"
);
const deleteConfirmationForm = deleteConfirmationModal.querySelector(
  "#delete-confirmation-form"
);

const deleteConfirmationBtn = document.querySelector(
  "#delete-confirmation-button"
);

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

//Edit
const editFormElement = document.querySelector(".modal__form");
const editModal = document.querySelector("#edit-modal");
const editModalCloseBtn = document.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);
const editSubmitBtn = editModal.querySelector(".modal__submit-btn");

//Card
const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardFormModalNewPost = cardModal.querySelector(".modal__form");
const editCardNameInput = cardModal.querySelector("#add-card-name-input");
const editCardLinkInput = cardModal.querySelector("#add-card-link-input");
const cardSubmitBtn = cardFormModalNewPost.querySelector(".modal__button");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

//Preview
const previewModal = document.querySelector("#preview-modal");
const previewModalImgEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close-btn-preview"
);

//Avatar
const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarInput = avatarModal.querySelector(".modal__input");
const avatarForm = avatarModal.querySelector(".modal__form");

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "405e0a22-ee55-4a2d-b905-d3c2cbdb8a74",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileName.textContent = userData.name;
    spotsAvatar.src = userData.avatar;
    profileDescription.textContent = userData.about;

    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
  })
  .catch((err) => console.error("Error:", err));

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
    editFormElement.querySelector(".modal__submit-btn"),
    settings
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
  const data = {
    name: editModalNameInput.value,
    about: editModalDescriptionInput.value,
  };

  setButtonText(editSubmitBtn, true);

  api
    .editUserInfo(data)
    .then((updatedUser) => {
      profileName.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(editSubmitBtn, false);
    });
}

function handleNewPostFormSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: editCardNameInput.value,
    link: editCardLinkInput.value,
  };

  setButtonText(cardSubmitBtn, true);

  api
    .addCard(inputValues)
    .then(() => {
      return api.getInitialCards();
    })
    .then((cards) => {
      const latestCard = cards[0];
      const cardElement = getCardElement(latestCard);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      cardFormModalNewPost.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitBtn, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  setButtonText(avatarSubmitBtn, true);

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      spotsAvatar.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
      disableButton(avatarSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitBtn, false);
    });
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

  if (localStorage.getItem(`liked-${data._id}`) === "true") {
    cardLikeBtn.classList.add("card__like-button_liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("card__like-button_liked");

    const request = isLiked ? api.unlikeCard(data._id) : api.likeCard(data._id);

    request
      .then((updatedCard) => {
        cardLikeBtn.classList.toggle("card__like-button_liked");
        const nowLiked = cardLikeBtn.classList.contains(
          "card__like-button_liked"
        );
        localStorage.setItem(`liked-${data._id}`, nowLiked);
      })
      .catch(console.error);
  });

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImgEl.src = data.link;
    previewModalImgEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = document.querySelectorAll(".modal__submit-btn");

  setButtonText(deleteConfirmationBtn, true, "Deleting...");

  api
    .removeCard(selectedCardId)
    .then(() => {
      closeModal(deleteConfirmationModal);
      selectedCard.remove();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteConfirmationBtn, false, "Delete");
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteConfirmationModal);
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

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteConfirmationForm.addEventListener("submit", handleDeleteSubmit);

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const modalOpened = document.querySelector(".modal_opened");
    if (modalOpened) {
      closeModal(modalOpened);
    }
  }
}

enableValidation(settings);
