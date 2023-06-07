async function fetchWorkData() {
  const response = await fetch("http://localhost:5678/api/works/", {
    method: "get",
  }).then((response) => response.json());

  if (!response) {
    return false;
  }

  return response;
}

fetchWorkData();

async function displayWork() {
  const works = await fetchWorkData();
  if (!works) {
    return console.error("L'api n'est pas accessible");
  }

  let worksContainer = document.querySelector(".gallery");
  worksContainer.innerHTML = "";

  works.map((work) => {
    const workFigure = document.createElement("figure");
    const workImage = document.createElement("img");
    workImage.setAttribute("src", work.imageUrl);
    workImage.setAttribute("alt", work.title);
    const workFigCaption = document.createElement("figcaption");
    workFigCaption.textContent = work.title;

    workFigure.appendChild(workImage);
    workFigure.appendChild(workFigCaption);

    worksContainer.appendChild(workFigure);
  });
}
displayWork();
