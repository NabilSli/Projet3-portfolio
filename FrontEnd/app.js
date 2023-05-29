const form = document.getElementById("login")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("pass")
const errorMessage = document.getElementById("errorMessage")


form.addEventListener("submit", async(event) => {
 event.preventDefault()
 const formData = new FormData(form) //genere un obj ac les donne du formulaire
 console.log(formData)
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

let error = 0

//si le test ne passe pas on choisi ce aue l'on renvoie ici
if (!emailRegex.test(formData.get("email"))){
    emailInput.style.border = "1px solid red"
    error += 1
} else {
    emailInput.style.border = "initial"
}

console.log(emailRegex.test(formData.get("email")))
console.log(formData.get("email"))

if (!formData.get("password")) {
    passwordInput.style.border = "1px solid red"
    error += 1
} else {
    passwordInput.style.border = "initial"
}

if (error > 0) {
    return
}

const response = await fetch ("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),   
    }),
}).then ( (res) =>
    res.json())


const userToken = response.token

console.log(userToken)

if (!userToken) {
    errorMessage.style.display = "block"
} else {
    errorMessage.style.display = "none"
    sessionStorage.setItem("token", userToken)
}
})





