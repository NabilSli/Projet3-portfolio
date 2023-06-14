// NOTE: declare a global variable to initiate it and use it in multiple functions
let works = null;
const buttonTous = document.querySelector("#btnTous");
const buttonObject = document.querySelector("#btnObjets");
const buttonAppartements = document.querySelector("#btnAppartements");
const buttonHotelRestaurant = document.querySelector("#btnHotelRestaurant");
const worksContainer = document.querySelector(".gallery");

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

async function displayWork(worksCategory) {
  // NOTE: call the css element from hte html base as parent for the html replacement

  // NOTE: put a text message while the js is executing
  worksContainer.innerHTML = "loading ...";

  // NOTE: set works if its not already set, in order to call the api only when needed
  if (!works) {
    works = await fetchWorkData();
  }

  // NOTE: empties the html from the index page
  worksContainer.innerHTML = "";

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
    worksContainer.appendChild(workFigure);
  });
}

// NOTE: First display of the works
displayWork();

// NOTE: add listener for the diferent filters
buttonTous.addEventListener("click", () => {
  displayWork();
});

// TODO: use category endpoint to dynamicallly generate buttons

buttonObject.addEventListener("click", () => {
  displayWork("Objets");
});

buttonAppartements.addEventListener("click", () => {
  displayWork("Appartements");
});

buttonHotelRestaurant.addEventListener("click", () => {
  displayWork("Hotels & restaurants");
});
