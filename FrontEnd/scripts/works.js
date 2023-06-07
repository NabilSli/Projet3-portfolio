// NOTE: CALLBACK HELL
// function fetchWorkData2(callback) {
//   fetch("http://localhost:5678/api/works/", {
//    method: "get",
//  }).then((responseWorkData2) => {
//    responseWorkData2.json().then(response => {
//      callback(response)
//    })
//  })
// }
// fetchWorkData2((response) => {
//   console.log(response)
// })

// NOTE: display all the works in the gallery dynamically
// NOTE: async function waits for the response of fetch before resuming
async function fetchWorkData() {
  const responseWorkData = await fetch("http://localhost:5678/api/works/", {
    method: "get",
  });
  const response = await responseWorkData.json();
  if (!response) {
    return false;
  }
  return response;
}

async function displayWork() {
  // NOTE: call the css element from hte html base as parent for the html replacement
  const worksContainer = document.querySelector(".gallery");
  // NOTE: put a text message while the js is executing
  worksContainer.innerHTML = "loading ...";

  const works = await fetchWorkData();
  if (!works) {
    return console.error("L'api n'est pas accessible");
  }

  // NOTE: empties the html from the index page
  worksContainer.innerHTML = "";

  works.map((work) => {
    // NOTE: creats the html elements for each project form the backend
    const workFigure = document.createElement("figure");
    const workImage = document.createElement("img");
    const workFigCaption = document.createElement("figcaption");

    // NOTE: add the needed atributes for the elements
    workImage.setAttribute("src", work.imageUrl);
    workImage.setAttribute("alt", work.title);
    workFigCaption.textContent = work.title;

    // NOTE: adds to elements to the parent html container "gallery" cold before
    workFigure.appendChild(workImage);
    workFigure.appendChild(workFigCaption);
    worksContainer.appendChild(workFigure);
  });
}

displayWork();
