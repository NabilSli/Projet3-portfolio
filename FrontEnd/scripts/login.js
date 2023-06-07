const form = document.getElementById("login");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("pass");
const errorMessage = document.getElementById("errorMessage");
// NOTE: minimum requisit to met to be considered an email, used to verify email field
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

form.addEventListener("submit", async (event) => {
  // NOTE: block refreshing the page when submit, it's default behavior
  event.preventDefault();
  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");
  // NOTE: use this variable to check for error
  let hasError = false;
  // NOTE: check email validity
  if (!emailRegex.test(email)) {
    emailInput.style.border = "1px solid red";
    hasError = true;
  } else {
    emailInput.style.border = "initial";
  }

  // NOTE: check password validity
  if (!password) {
    passwordInput.style.border = "1px solid red";
    hasError = true;
  } else {
    passwordInput.style.border = "initial";
  }

  // NOTE: skip submiting form if there is an error
  if (hasError) {
    // NOTE: resume function (act like a "break" in a loop)
    return;
  }

  const bodyData = {
    email,
    password,
  };
  const body = JSON.stringify(bodyData);
  // NOTE: ask backend server if this email and password combination is known and to return token if so
  // https://developer.mozilla.org/fr/docs/Web/API/Response

  const responseObject = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    // NOTE: ressource type i will be sending
    headers: {
      "Content-Type": "application/json",
    },
    // NOTE: send a json string
    body,
  });
  // NOTE: transorms the body in an js object
  const response = await responseObject.json();

  const userToken = response.token;
  if (!userToken) {
    errorMessage.style.display = "block";
  } else {
    errorMessage.style.display = "none";
    sessionStorage.setItem("token", userToken);
  }
});
