// NOTE: declare a global variable to initiate it and use it in multiple functions
let works = null;
let modal = null;
const buttonTous = document.querySelector("#btnTous");
const buttonObject = document.querySelector("#btnObjets");
const buttonAppartements = document.querySelector("#btnAppartements");
const buttonHotelRestaurant = document.querySelector("#btnHotelRestaurant");
const worksContainer = document.querySelector(".gallery");
const modalContainer = document.querySelector("#galleryModal");
const editionModeBand = document.getElementById("editorBand");
const editionModeButtons = document.getElementsByClassName("editorBtn");
const modifyBtn = document.getElementById("modifyBtn");
const modalBox = document.getElementById("modal");

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

async function displayWork(target, worksCategory) {
  // NOTE: call the css element from hte html base as parent for the html replacement

  // NOTE: put a text message while the js is executing
  target.innerHTML = "loading ...";

  // NOTE: set works if its not already set, in order to call the api only when needed
  if (!works) {
    works = await fetchWorkData();
  }

  // NOTE: empties the html from the index page
  target.innerHTML = "";

  // NOTE: displays the works by parameters, to enable filters
  const worksToDisplay =
    worksCategory != undefined
      ? works.filter((work) => work.category.name === worksCategory)
      : works;

  worksToDisplay.forEach((work) => {
    // NOTE: creats the html elements for each project form the backend
    const workFigure = document.createElement("figure");
    const workImage = document.createElement("img");
    const workFigCaption = document.createElement("figcaption");

    // NOTE: add the needed atributes for the elements
    workImage.setAttribute("src", work.imageUrl);
    workImage.setAttribute("alt", work.title);
    workFigCaption.textContent = work.title;

    // NOTE: adds to elements to the parent html container called before
    workFigure.appendChild(workImage);
    workFigure.appendChild(workFigCaption);
    target.appendChild(workFigure);
  });
}

// NOTE: Ici commence l'execution du code
//
//
if (sessionStorage.getItem("token") != null) {
  editionModeBand.style.display = "flex";
  for (editionButton of editionModeButtons) {
    editionButton.style.display = "flex";
  }
}

// NOTE: opens the modal
modifyBtn.addEventListener("click", () => {
  modalBox.style.display = "flex";
  modalBox
    .querySelector(".modalCloseBtn")
    .addEventListener("click", closeModal);
  modalBox
    .querySelector(".modalStop")
    .addEventListener("click", stopPropagation);
});

// NOTE: CLoses the modal
const closeModal = function (event) {
  if (modalBox === null) return;
  modalBox.style.display = "none";
  modalBox
    .querySelector(".modalCloseBtn")
    .removeEventListener("click", closeModal);
  modalBox
    .querySelector(".modalStop")
    .removeEventListener("click", stopPropagation);
};

const stopPropagation = function (event) {
  event.stopPropagation();
};

// NOTE: First display of the works
displayWork(worksContainer);

// NOTE: add listener for the diferent filters
buttonTous.addEventListener("click", () => {
  displayWork(worksContainer);
});

// TODO: use category endpoint to dynamicallly generate buttons

buttonObject.addEventListener("click", () => {
  displayWork(worksContainer, "Objets");
});

buttonAppartements.addEventListener("click", () => {
  displayWork(worksContainer, "Appartements");
});

buttonHotelRestaurant.addEventListener("click", () => {
  displayWork(worksContainer, "Hotels & restaurants");
});

// declenchement de l'affichage de gallerie dans la modale
//modifyBtn.addEventListener("click", () => {
//  displayWork(modalContainer);
//});
