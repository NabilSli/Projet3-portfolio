// NOTE: declare a global variable to initiate it and use it in multiple functions
let works = null;
let categories = null;
let idToken = sessionStorage.getItem("token");

const buttonTous = document.getElementById("btnTous");
const buttonObject = document.getElementById("btnObjets");
const buttonAppartements = document.getElementById("btnAppartements");
const buttonHotelRestaurant = document.getElementById("btnHotelRestaurant");
const maybeWorksContainer = document.getElementsByClassName("gallery");
const worksContainer = maybeWorksContainer.item(0);
const categoriesSelection = document.getElementById("selectCategory");
const modalContainer = document.getElementById("galleryModal");
const editionModeBand = document.getElementById("editorBand");
const editionModeButtons = document.getElementsByClassName("editorBtn");
const modifyBtn = document.getElementsByClassName("modifyBtn");
const modalBox = document.getElementById("modal");
const modalAddNewWorkBtn = document.getElementById("modalAddNewWorkBtn");
const modalAddWorkInputBtn = document.querySelector("#modalAddWorkInputBtn");
const modalEdit = document.getElementById("modalWrapperEdit");
const modaladdition = document.getElementById("modalWrapperAddition");
const modalReturnArrow = document.getElementById("modalCloseBtn");
const uploadedImgBox = document.getElementById("uploadedImgBox");
const workAddition = document.getElementById("workAddition");
const addWorkForm = document.getElementById("addWorkForm");
const newWorkTitleInput = document.getElementById("uploadTitle");
const uploadSelect = document.getElementById("selectCategory");
const uploadImgPreview = document.getElementById("uploadImgPreview");
const modalValidationBtn = document.getElementById("modalValidationBtn");

/* NOTE: verify that we have an identification token in the session storage,
 meaning the user is correctly logged in and can have access to modifications */
if (
  sessionStorage.getItem("token") == null ||
  sessionStorage.getItem("token") == ""
) {
  editionModeBand.style.display = "none";
} else {
  editionModeBand.style.display = "flex";
  for (modificationButton of editionModeButtons) {
    modificationButton.style.display = "flex";
  }
}

// NOTE: display all the works in the gallery dynamically
// NOTE: async function waits for the response of fetch before resuming
async function fetchWorkData() {
  const responseWorkData = await fetch("http://localhost:5678/api/works/", {
    method: "get",
  });
  const response = await responseWorkData.json();
  if (!response) {
    return;
  }
  return response;
}

// TODO: merge `worksCategory` and `isEditable` into an option object
async function displayWork(
  target,
  worksCategory,
  isEditable,
  forceFetch = false
) {
  // NOTE: put a text message while the js is executing
  worksContainer.innerHTML = "loading ...";

  // NOTE: set works if its not already set, in order to call the api only when needed
  if (!works || forceFetch) {
    works = await fetchWorkData();
  }

  // NOTE: empties the html from the index page
  target.replaceChildren();

  // NOTE: displays the works by parameters, to enable filters
  const worksToDisplay =
    worksCategory != undefined
      ? works.filter((work) => work.category.name === worksCategory)
      : works;

  // NOTE: create cards for each work in the gallery and in the modal
  worksToDisplay.forEach((work) => {
    // NOTE: creats the html elements for each project form the backend
    const workFigure = document.createElement("figure");
    const workImage = document.createElement("img");

    // NOTE: add the needed atributes for the elements
    workImage.setAttribute("src", work.imageUrl);
    workImage.setAttribute("alt", work.title);

    // NOTE: adds elements to the parent html container "gallery" called before
    workFigure.appendChild(workImage);

    // NOTE: changes card title if the galery is in the core page or in the modal
    if (!isEditable) {
      const workFigCaption = document.createElement("figcaption");
      workFigCaption.textContent = work.title;
      workFigure.appendChild(workFigCaption);
    } else {
      const editionButton = document.createElement("button");
      editionButton.setAttribute("class", "galleryEditionBtn");
      editionButton.textContent = "éditer";
      workFigure.appendChild(editionButton);
      const deleteBinButton = document.createElement("a");
      deleteBinButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
      workFigure.appendChild(deleteBinButton);

      deleteBinButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const worksToDelete = work.id;

        await fetch(`http://localhost:5678/api/works/${worksToDelete}`, {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${idToken}`,
          },
        });
        displayWork(worksContainer, null, false, true);
        displayWork(modalContainer, null, true, true);
      });
    }

    target.appendChild(workFigure);
  });
}

// NOTE: get all the categories from the backend
async function fetchCategoriesData() {
  const responseCategoriesData = await fetch(
    "http://localhost:5678/api/categories",
    {
      method: "get",
    }
  );
  // NOTE: convert JSON object in to an array of objects
  const response = await responseCategoriesData.json();

  const optionCategory = response;
  // NOTE: iterate the creation of option dinamically from the backend
  for (let i = 0; i < response.length; i++) {
    const optionFiler = document.createElement("option");
    optionFiler.value = `${optionCategory[i].id}` ?? "aucune catégorie";
    optionFiler.innerText = `${optionCategory[i].name}` ?? "sans noms";
    optionFiler.setAttribute("value", optionCategory[i].id);
    categoriesSelection.appendChild(optionFiler);
  }
}

// NOTE: the code start running here

/* NOTE: opens the modal with a new function so it be can used again in 
an other callbacks if needed */
const openModal = function (event) {
  modalBox.style.display = "flex";

  modalBox.addEventListener("click", closeModal);
  modalBox
    .querySelector(".modalCloseBtn")
    .addEventListener("click", closeModal);
  modalBox
    .querySelector(".modalWrapperEdit")
    .addEventListener("click", stopPropagation);
  modalBox
    .querySelector(".modalWrapperAddition")
    .addEventListener("click", stopPropagation);
};

// NOTE: make a loop so all the "modifier" links opens the modal
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// NOTE: Transition to the second modal
modalAddNewWorkBtn.addEventListener("click", function (event) {
  modalEdit.style.display = "none";
  modaladdition.style.display = "flex";
  modaladdition
    .querySelector(".modalCloseBtn")
    .addEventListener("click", closeModal);
});

// NOTE: Return to the first modal
modalReturnArrow.addEventListener("click", function (event) {
  modaladdition.style.display = "none";
  modalEdit.style.display = "flex";
});

// NOTE: CLoses the modal
const closeModal = function (event) {
  if (event) event.preventDefault();
  if (modalBox === null) return;
  modalBox.style.display = "none";
  modalEdit.style.display = "flex";
  modaladdition.style.display = "none";
  modalBox.removeEventListener("click", closeModal);
  modalBox
    .querySelector(".modalCloseBtn")
    .removeEventListener("click", closeModal);
  modalBox
    .querySelector(".modalWrapperEdit")
    .removeEventListener("click", stopPropagation);
  modalBox
    .querySelector(".modalWrapperAddition")
    .removeEventListener("click", stopPropagation);
};

// NOTE: to prevent the modal from closing when you click in it
const stopPropagation = function (event) {
  event.stopPropagation();
};

// NOTE: closes the modal when you press escape key on keyboard
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal(event);
  }
});

// NOTE: First display of the works
displayWork(worksContainer);

// NOTE: add listener for the diferent filters
buttonTous.addEventListener("click", () => {
  displayWork(worksContainer);
});

buttonObject.addEventListener("click", () => {
  displayWork(worksContainer, "Objets");
});

buttonAppartements.addEventListener("click", () => {
  displayWork(worksContainer, "Appartements");
});

buttonHotelRestaurant.addEventListener("click", () => {
  displayWork(worksContainer, "Hotels & restaurants");
});

displayWork(modalContainer, null, true);

fetchCategoriesData();

// NOTE: preview the selected image file
modalAddWorkInputBtn.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    uploadImgPreview.style.display = "none";
    uploadedImgBox.style.backgroundImage = `url(${reader.result})`;
  });
  reader.readAsDataURL(this.files[0]);
});

// NOTE: validation of inputs before unabling submit button
modalValidationBtn.disabled = true;
function setSubmbitBtnStatus() {
  if (isCategoryValid && isTitleValid && isImageValid) {
    modalValidationBtn.disabled = false;
  } else {
    modalValidationBtn.disabled = true;
  }
}

let isImageValid = false;
modalAddWorkInputBtn.addEventListener("change", (event) => {
  const currentSize = modalAddWorkInputBtn.files.item(0).size;
  if (currentSize === 0 || currentSize > 4000000) {
    uploadedImgBox.style.border = "1px solid red";
    isImageValid = false;
  } else {
    uploadedImgBox.style.border = "initial";
    isImageValid = true;
  }

  setSubmbitBtnStatus();
});

let isTitleValid = false;
newWorkTitleInput.addEventListener("change", (event) => {
  if (event.target.value === "") {
    newWorkTitleInput.style.border = "1px solid red";
    isTitleValid = false;
  } else {
    isTitleValid = true;
    newWorkTitleInput.style.border = "initial";
  }

  setSubmbitBtnStatus();
});

let isCategoryValid = false;
uploadSelect.addEventListener("change", (event) => {
  if (event.target.value === "") {
    uploadSelect.style.border = "1px solid red";
    isCategoryValid = false;
  } else {
    newWorkTitleInput.style.border = "initial";
    isCategoryValid = true;
  }

  setSubmbitBtnStatus();
});

/* NOTE: submit new work after validating the form and displays the new works
without reloading*/
addWorkForm.addEventListener("submit", async (event) => {
  event.stopPropagation();
  event.preventDefault();

  if (
    sessionStorage.getItem("token") == null ||
    sessionStorage.getItem("token") == ""
  ) {
    return;
  }

  const formData = new FormData(addWorkForm);
  const newWorkTitle = formData.get("title");
  const newWorkCategory = formData.get("category");
  const newWorkImage = formData.get("image");

  if (!isCategoryValid && !isTitleValid && !isImageValid) {
    return;
  }

  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: formData,
  });

  /* NOTE: verification of the post and display new work in gallery and
  in the modal without relaoding*/
  if (response?.status === 201) {
    console.log("Le travail a bien été ajouté");
    displayWork(worksContainer, null, false, true);
    displayWork(modalContainer, null, true, true);
    closeModal();
    resetPreview();
  } else {
    console.log("Une erreur est survenue, veuillez réessayer plus tard");
    return;
  }
});

// NOTE: clean the preview of uploaded image after submitting new work
const resetPreview = function () {
  addWorkForm.reset();
  uploadedImgBox.style.backgroundImage = `url(${""})`;
  uploadImgPreview.style.display = "flex";
};
