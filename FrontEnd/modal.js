const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("modal");

// Vérification de la connexion de l'utilisateur. Si une valeur est retournée c'est qu'il est connecté
const utilisateurConnecte = !!window.localStorage.getItem("bearerAuth");


if (utilisateurConnecte) {
    const editButtonContainer = document.getElementById("edit-button-container");

    // Création du bouton d'édition
    const editButton = document.createElement("button");
    const buttonContent = `<img src="./assets/icons/edit.svg"> Mode édition`;
    editButton.classList.add("edition");
    editButton.innerHTML = buttonContent;

    // Ajout du bouton au container déjà préparé en HTML à cet effet
    editButtonContainer.appendChild(editButton);

       
    editButton.addEventListener("click", () => {
        modal.showModal();
        modal.style.display = "flex";
        modal.removeAttribute("aria-hidden");
        modal.getAttribute("aria-visible");
        modal.setAttribute("aria-modal", "true");
    });

    closeModal.addEventListener("click", () => {
        modal.close();
        modal.style.display = "none";
        modal.getAttribute("aria-hidden");
        modal.setAttribute("aria-modal", "false")
    });
}

function displayImagesInModal(data) {
    const modalPictures = document.querySelector('.modal-pictures');

    data.forEach(work => {
        const workContainer = document.createElement('div');
        workContainer.classList.add('modal-work');
        modalPictures.appendChild(workContainer);
        const workSolo = `<img src="${work.imageUrl}" alt=${work.title}><button><img src="./assets/icons/trash.svg"></button>`;
        workContainer.innerHTML = workSolo;
    });
}