// NOTE: declare a global variable to initiate it and use it in multiple functions
let works = null;
let categories = null;
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
const modalAddNewWorkBtn = document.getElementById("modalAddBtn");
const modalEdit = document.getElementById("modalWrapperEdit");
const modaladdition = document.getElementById("modalWrapperAddition");
const modalReturnArrow = document.getElementById("modalCloseBtn");

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
async function displayWork(target, worksCategory, isEditable) {
  // NOTE: put a text message while the js is executing
  worksContainer.innerHTML = "loading ...";

  // NOTE: set works if its not already set, in order to call the api only when needed
  if (!works) {
    works = await fetchWorkData();
  }

  // NOTE: empties the html from the index page
  target.replaceChildren();

  // NOTE: displays the works by parameters, to enable filters
  const worksToDisplay =
    worksCategory != undefined
      ? works.filter((work) => work.category.name === worksCategory)
      : works;

  worksToDisplay.forEach((work) => {
    // NOTE: creats the html elements for each project form the backend
    const workFigure = document.createElement("figure");
    const workImage = document.createElement("img");

    // NOTE: add the needed atributes for the elements
    workImage.setAttribute("src", work.imageUrl);
    workImage.setAttribute("alt", work.title);

    // NOTE: adds to elements to the parent html container "gallery" cold before
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

  const response = await responseCategoriesData.json();

  const optionCategory = response;

  const optionfiler = document.createElement("option");

  for (let i = 0; i < response.length; i++) {
    optionfiler.value += `${optionCategory[i].id}` ?? "aucune catégorie";
    optionfiler.innerText += `${optionCategory[i].name}` ?? "sans noms";
  }
  console.log(optionfiler.value);
  console.log(optionfiler.innerText);
}

fetchCategoriesData();

/*
    const optionObjets = document.createElement("option");
    const optionAppartements = document.createElement("option");
    const optionHotels = document.createElement("option");

    optionObjets.setAttribute("value", "1");
    optionAppartements.setAttribute("value", "2");
    optionHotels.setAttribute("value", "3");

    optionObjets.innerText("Objets");
    optionAppartements.innerText("Appartements");
    optionHotels.innerText("Hotels $ restaurants");

    target.appendChild(optionObjets);
    target.appendChild(optionAppartements);
    target.appendChild(optionHotels);
*/

// NOTE: the code start running here

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

modalReturnArrow.addEventListener("click", function (event) {
  modaladdition.style.display = "none";
  modalEdit.style.display = "flex";
});

// NOTE: CLoses the modal
const closeModal = function (event) {
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
    .querySelector("modalWrapperAddition")
    .removeEventListener("click", stopPropagation);
};

// NOTE: to prevent the modal from closing when you click in it
const stopPropagation = function (event) {
  event.stopPropagation();
};

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
