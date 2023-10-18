const urlApi = 'http://localhost:5678/api/'; //URL de l'API
const bearerAuth = window.localStorage.getItem("BearerAuth");
const loginForm = document.querySelector("form");



loginForm.addEventListener("submit", async function(event) {
    //Suppression du précédent message d'erreur possible et preventDefault pour éviter que le formulaire s'envoie
    //avant qu'on le décide avec le JS
    event.preventDefault();
    const previousError = document.querySelector(".error");

    if (previousError) {
        previousError.remove();
    }

    //Récupération des valeurs de connexion mis dans le formulaire
    const loginFormDatas = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    };

    //Création du futur body du json
    const loginData = JSON.stringify(loginFormDatas);

    //Envoi des données grâce à une requête POST
    await fetch( urlApi + "users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: loginData
    })

    //Récupération de la réponse de l'API
    .then(response => {
        if (response.ok === true) {
            return response.json();
        //Message d'erreur si status 404 ou 401
        } else {
            throw new Error(`Erreur dans l’identifiant ou le mot de passe.`);
        }
    })

    .then(body => {
        //Enregistrer le token dans le stockage local pour pouvoir l'utiliser ensuite
        window.localStorage.setItem("bearerAuth", JSON.stringify(body));
        
        //Redirection vers la page d'accueil et l'ancre correspondante
        window.location.replace("index.html#edit-button-container");
    })

    //En cas d'erreur
    .catch(e => {
        //Création du message d'erreur et de sa mise en place
        const error = document.createElement("div");
        error.classList.add("form-error");
        error.innerHTML = e.message;
        //Ajout du message d'erreur après le dernier élément enfant du formulaire
        document.querySelector("form").append(error);
    })
});
