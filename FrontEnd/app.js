//Variables

const urlApi = 'http://localhost:5678/api/'; //URL de l'API
const gallery = document.querySelector('.gallery');

const allButton = document.getElementById('allButton');
const objectsButton = document.getElementById('objectsButton');
const appartmentsButton = document.getElementById('appartmentsButton');
const hotelsButton = document.getElementById('hotelsButton');

const bearerAuth = window.localStorage.getItem("BearerAuth");

//Creation de deux array pour stocker les datas et les categories de l'API et les manipuler sans refaire d'appel

let data = [];
let categories = [];

//Request en GET pour recevoir la liste des projets du portfolio

fetch(urlApi + 'works')
    //Récupération de la réponse de l'API et d'une éventuelle erreur de connexion
    .then(response => {
        if (!response.ok) {
            console.log('Erreur lors de la demande');
        }
        return response.json();
    })
    //Récupération des données de l'API et stockage dans l'array data tout en mettant updateFilter en all pour tout afficher
    //Et displayImagesInModal pour mettre les projets dans la modal
    .then(dataApi => {
        data = dataApi

        updateFilter('all');
        displayImagesInModal(data);

    })
    //Analyse d'une éventuelle erreur pendant la requête
    .catch( error => {
        console.error('Erreur :', error);
    })


    //Request API pour les catégories

fetch(urlApi + 'categories')
    .then(response => {
        if (!response.ok) {
            console.log('Erreur lors de la demande');
        }
        return response.json();
    })
    //Récupération des données de l'API et stockage dans l'array data tout en mettant updateFilter en all pour tout afficher
    .then(categoriesApi => {
        categories = categoriesApi;
        displayCategoriesInModal(categories);
    })
    //Analyse d'une éventuelle erreur pendant la requête
    .catch( error => {
        console.error('Erreur :', error);
    })


//Fonction pour mettre à jour les filtres avec la catégorie souhaitée
function updateFilter(category) {

    //Vider la gallerie avant d'y ajouter les figures que l'on va créer avec les data
    gallery.innerHTML = '';

    //On "découpe" la data pour en faire des work individuels 
    //Si la catégorie est à all on affiche tout, sinon uniquement ceux où la categoryId match avec la category sélectionnée
    data.forEach(work => {
        if(category === 'all' || work.categoryId === category) {
            const figure = document.createElement('figure');
            figure.setAttribute('data-id', work.id);

            figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}"/>
                <figcaption>${work.title}</figcaption>
            `;

            //Après les avoir créé, on les affiche
            gallery.appendChild(figure)
        }
    });
}

//On met à jour l'updateFilter en fonction du bouton voulu
allButton.addEventListener('click', () => {
    updateFilter('all');
});

objectsButton.addEventListener('click', () => {
    updateFilter(1);
});

appartmentsButton.addEventListener('click', () => {
    updateFilter(2);
});

hotelsButton.addEventListener('click', () => {
    updateFilter(3);
});


