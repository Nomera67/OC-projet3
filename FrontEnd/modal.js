const closeModal = document.querySelectorAll(".closeModal");
const modal = document.getElementById("modal");
const addModal = document.getElementById("modal2");
const backModal = document.querySelector(".back-button");
const selectCategory = document.getElementById("categorie");
const submitForm = document.getElementById("submit-form");
const submitLabel = document.getElementById("submit-label");
const submitText = document.getElementById("submit-text");


// Vérification de la connexion de l'utilisateur. Si une valeur est retournée c'est qu'il est connecté
const utilisateurConnecte = !!window.localStorage.getItem("bearerAuth");
const usableToken = JSON.parse(window.localStorage.getItem("bearerAuth")).token;



if (utilisateurConnecte) {
    console.log(usableToken);
    const editButtonContainer = document.getElementById("edit-button-container");
    const addButton = document.getElementById("addButton");
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
        submitForm.reset();
    })

    window.addEventListener('click', (event) => {
        if (event.target === modal || event.target === addModal) {
            modal.close();
            modal.style.display = "none";
            modal.getAttribute("aria-hidden");
            modal.setAttribute("aria-modal", "false");
            addModal.close();
            addModal.style.display = "none";
            addModal.getAttribute("aria-hidden");
            addModal.setAttribute("aria-modal", "false");
            submitForm.reset();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            modal.close();
            modal.style.display = "none";
            modal.getAttribute("aria-hidden");
            modal.setAttribute("aria-modal", "false");
            addModal.close();
            addModal.style.display = "none";
            addModal.getAttribute("aria-hidden");
            addModal.setAttribute("aria-modal", "false");
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
                document.getElementById('addButton').removeAttribute('disabled');
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
        }
    })
    .then(newWorkData => {
        if(newWorkData) {
            data.push(newWorkData);

            updateFilter('all');
            formData.reset();
            imagePreview.style.display = 'none';

        }
    })
    .catch(error => {
        console.error('Erreur :', error);
    })
})

function deleteImage(workId) {
    const workContainer = document.getElementById(workId);


    fetch(urlApi + `works/${workId}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${usableToken}` },
    })
    .then(response => {
        if (response.status === 204) {
            console.log("Image supprimée avec succès : " + workId);
            
            workContainer.remove(); 
        } else {
            console.error("Erreur lors de la suppression de l'image : " + workId);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la suppression de l'image : " + error);
    });


}