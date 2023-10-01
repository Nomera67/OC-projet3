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
        submitForm.reset();
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

// Sélectionnez l'élément input de type fichier
const fileInput = document.getElementById('fileInput');

// Sélectionnez l'élément qui affichera l'aperçu de l'image
const imagePreview = document.querySelector('.submit-file img');

// Écoutez les changements dans le champ de fichier
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0]; // Récupérez le fichier sélectionné

    // Vérifiez si le fichier est une image de type .jpg ou .png
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        // Vérifiez si la taille du fichier ne dépasse pas 4 Mo
        if (file.size <= 4 * 1024 * 1024) { // 4 Mo en octets
            // Si le fichier est valide, affichez l'aperçu
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
            fileInput.value = ''; // Réinitialisez le champ de fichier
        }
    } else {
        alert(`L'image doit être en .jpg ou .png.`);
        fileInput.value = ''; // Réinitialisez le champ de fichier
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