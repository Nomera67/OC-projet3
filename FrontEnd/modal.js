const closeModal = document.querySelectorAll(".closeModal");
const modal = document.getElementById("modal");
const addModal = document.getElementById("modal2");
const backModal = document.querySelector(".back-button");
const selectCategory = document.getElementById("categorie");
const submitForm = document.getElementById("submit-form");
const submitLabel = document.getElementById("submit-label");
const submitText = document.getElementById("submit-text");
const addButton = document.getElementById("addButton");


// Vérification de la connexion de l'utilisateur. Si une valeur est retournée c'est qu'il est connecté
const utilisateurConnecte = !!window.localStorage.getItem("bearerAuth");
const usableToken = JSON.parse(window.localStorage.getItem("bearerAuth")).token;

// Fonctions utilitaires


function resetImg(){
    submitLabel.classList.remove("hidden");
    submitText.classList.remove("hidden");
    imagePreview.classList.remove('submit-img');
    imagePreview.src = './assets/icons/img-icon.svg';
}

function showFirstModal(){
    modal.showModal();
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    modal.getAttribute("aria-visible");
    modal.setAttribute("aria-modal", "true");
}

function hideFirstModal(){
    modal.close();
    modal.style.display = "none";
    modal.getAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "false");
}

function showSubmitModal(){
    addModal.showModal();
    addModal.style.display = "flex";
    addModal.removeAttribute("aria-hidden");
    addModal.getAttribute("aria-visible");
    addModal.setAttribute("aria-modal", "true");
}

function hideSubmitModal(){
    addModal.close();
    addModal.style.display = "none";
    addModal.getAttribute("aria-hidden");
    addModal.setAttribute("aria-modal", "false");
}



if (utilisateurConnecte) {
    console.log(usableToken);
    const editButtonContainer = document.getElementById("edit-button-container");
    const filters = document.querySelector('.filters-container');

    //Disparition en gardant le même écart des filtres de l'écran d'accueil

    filters.classList.add('filter-hidden');

    // Création du bouton d'édition
    const editButton = document.createElement("button");
    const buttonContent = `<img src="./assets/icons/edit.svg"> Mode édition`;
    editButton.classList.add("edition");
    editButton.innerHTML = buttonContent;

    // Ajout du bouton au container déjà préparé en HTML à cet effet
    editButtonContainer.appendChild(editButton);

       
    editButton.addEventListener("click", () => {
        showFirstModal();
    });

    addButton.addEventListener("click", () => {
        hideFirstModal();
        showSubmitModal();
        
    })

    closeModal.forEach((button) => {
        button.addEventListener("click", () => {
            hideFirstModal();
            hideSubmitModal();
            
        });
    });

    backModal.addEventListener("click", () => {
        showFirstModal();
        hideSubmitModal();
        submitForm.reset();
        resetImg();
    })

    window.addEventListener('click', (event) => {
        if (event.target === modal || event.target === addModal) {
            hideFirstModal();
            hideSubmitModal();
            resetImg();
            submitForm.reset();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            hideFirstModal();
            hideSubmitModal();
            resetImg();
            submitForm.reset();
        }
    });
    
} else {
    editButton.classList.add('hidden');
}




function displayImagesInModal(data) {
    const modalPictures = document.querySelector('.modal-pictures');

    data.forEach(work => {
        const workContainer = document.createElement('div');
        workContainer.id = work.id;
        workContainer.classList.add('modal-work');
        modalPictures.appendChild(workContainer);
        const workSpot = `<img src="${work.imageUrl}" alt="${work.title}">`;
        const trashButton = `<button type="button" data-id="${work.id}" class="trash-button"><img class="trash-img" src="./assets/icons/trash.svg"></button>`;
        const workSolo = workSpot + trashButton;
        workContainer.innerHTML = workSolo;

        const trashButtonElement = workContainer.querySelector('.trash-button');
        trashButtonElement.onclick = function () {
            deleteImage(work.id);
        }
    });
}



function displayCategoriesInModal(categories) {
    

    categories.forEach(category => {
        const categoryOption = document.createElement("option");
        categoryOption.classList.add('submit-option');
        categoryOption.value = category.id;
        const categorySolo = `${category.name}`;
        categoryOption.innerText = categorySolo;
        selectCategory.appendChild(categoryOption);
    })
}

const fileInput = document.getElementById('fileInput');

const imagePreview = document.querySelector('.submit-file img');

fileInput.addEventListener('change', (event) => {
    // Récupérer le fichier sélectionné
    const file = event.target.files[0];

    // Vérification de l'extension du fichier
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        // Vérification de la taille du fichier
        if (file.size <= 4 * 1024 * 1024) { 
            // 4 Mo en octets
            // Si le fichier est valide, afficher l'aperçu
            const reader = new FileReader();

            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                imagePreview.classList.add('submit-img');
                submitLabel.classList.add("hidden");
                submitText.classList.add("hidden");

                // Activer le bouton Valider
                addButton.removeAttribute('disabled');
            };

            reader.readAsDataURL(file);
        } else {
            alert(`L'image est trop volumineuse. Elle ne doit pas dépasser 4 Mo.`);
            fileInput.value = ''; // Réinitialiser le champ de fichier
        }
    } else {
        alert(`L'image doit être en .jpg ou .png.`);
        fileInput.value = '';
    }
});


submitForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('titre').value;
    const categoryId = document.getElementById('categorie').value;
    const picture = document.getElementById('fileInput').files[0];
    const formSubmit = document.getElementById('submit-form');
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", picture);

    const headers = new Headers({
        'Authorization': `Bearer ${usableToken}`        
    });
    fetch(urlApi + 'works', {
        method: 'POST',
        headers: headers,
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            console.log('Requête réussie');
            // Retourner la réponse JSON pour obtenir les données de la nouvelle image ajoutée
            return response.json(); 
        }
    })
    .then(newWorkData => {
        if (newWorkData) {
            data.push(newWorkData);

            // Ajouter la nouvelle image au DOM
            const modalPictures = document.querySelector('.modal-pictures');
            const workContainer = document.createElement('div');
            workContainer.id = newWorkData.id;
            workContainer.classList.add('modal-work');
            const workSpot = `<img src="${newWorkData.imageUrl}" alt="${newWorkData.title}">`;
            const trashButton = `<button type="button" data-id="${newWorkData.id}" class="trash-button"><img class="trash-img" src="./assets/icons/trash.svg"></button>`;
            const workSolo = workSpot + trashButton;
            workContainer.innerHTML = workSolo;

            const trashButtonElement = workContainer.querySelector('.trash-button');
            trashButtonElement.onclick = function () {
                deleteImage(newWorkData.id);
            }

            modalPictures.appendChild(workContainer); // Ajouter la nouvelle image au DOM

            updateFilter('all'); // Mettre à jour les filtres
            formSubmit.reset(); // Réinitialiser le formulaire
            resetImg();
            hideFirstModal();
            hideSubmitModal();
        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    });
})

function deleteImage(workId) {
    const workContainer = document.getElementById(workId);
    const workFigure = document.querySelector(`figure[data-id="${workId}"]`);

    fetch(urlApi + `works/${workId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${usableToken}` },
    })
    .then(response => {
        if (response.status === 204) {
            console.log("Image supprimée avec succès : " + workId);
            
            workContainer.remove(); 
            workFigure.remove();
        } else {
            console.error("Erreur lors de la suppression de l'image : " + workId);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression de l'image : " + error);
    });
}