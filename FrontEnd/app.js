const form = document.getElementById("login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  // NOTE: genere un obj ac les donne du formulaire
  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  let hasError = false;
  // NOTE: si le test ne passe pas on choisi ce que l'on renvoie ici
  if (!emailRegex.test(formData.get("email"))) {
    emailInput.style.border = "1px solid red";
    hasError = true;
  } else {
    emailInput.style.border = "initial";
  }

  if (!formData.get("password")) {
    passwordInput.style.border = "1px solid red";
    hasError = true;
  } else {
    passwordInput.style.border = "initial";
  }
  // NOTE:
  if (hasError) {
    return;
  }

  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  }).then((res) => res.json());

  const userToken = response.token;
  if (!userToken) {
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
    sessionStorage.setItem("token", userToken);
  }
});
