const closeModal = document.querySelectorAll(".closeModal");
const modal = document.getElementById("modal");
const addModal = document.getElementById("modal2");
const backModal = document.querySelector(".back-button");

// Vérification de la connexion de l'utilisateur. Si une valeur est retournée c'est qu'il est connecté
const utilisateurConnecte = !!window.localStorage.getItem("bearerAuth");


if (utilisateurConnecte) {
    const editButtonContainer = document.getElementById("edit-button-container");
    const addButton = document.getElementById("addButton");

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

    addButton.addEventListener("click", () => {
        modal.close();
        modal.style.display = "none";
        modal.getAttribute("aria-hidden");
        modal.setAttribute("aria-modal", "false");
        addModal.showModal();
        addModal.style.display = "flex";
        addModal.removeAttribute("aria-hidden");
        addModal.getAttribute("aria-visible");
        addModal.setAttribute("aria-modal", "true");
    })

    closeModal.forEach((button) => {
        button.addEventListener("click", () => {
            modal.close();
            modal.style.display = "none";
            modal.getAttribute("aria-hidden");
            modal.setAttribute("aria-modal", "false")
            addModal.close();
            addModal.style.display = "none";
            addModal.getAttribute("aria-hidden");
            addModal.setAttribute("aria-modal", "false");
        });
    });

    backModal.addEventListener("click", () => {
        modal.showModal();
        modal.style.display = "flex";
        modal.removeAttribute("aria-hidden");
        modal.getAttribute("aria-visible");
        modal.setAttribute("aria-modal", "true");
        addModal.close();
        addModal.style.display = "none";
        addModal.getAttribute("aria-hidden");
        addModal.setAttribute("aria-modal", "false");
    })
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