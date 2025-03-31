let liste = document.getElementById("tableBody");
let modal = document.getElementById("modalEdit");
let addModal = document.getElementById("addProduct");
let produit = null;
let donnees = [];

if (localStorage.getItem("produits")) {
    donnees = JSON.parse(localStorage.getItem("produits"));
    afficherDonnees();
} else {

    fetch("produits.json")
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (data) {
            donnees = data;
            localStorage.setItem("produits", JSON.stringify(donnees)); // on stocke dans le localStorage
            afficherDonnees();
        })
        .catch(function (error) {
            console.error("erreur chargement", error);
        });
}
function afficherDonnees() {//fonction pour afficher nos produits
    liste.innerHTML = "";//on vide la liste

    for (let i = 0; i < donnees.length; i++) {//on boucle pour recuperer nos produits
        produit = donnees[i];
        let tr = document.createElement("tr");//on créé une entrée pour notre tableau
        let stockAlert = "";
        if (produit.stock > 0) {
            stockAlert = '<img src="assets/images/icon/RectangleGreen.png" alt="">'
        } else {
            stockAlert = '<img src="assets/images/icon/RectangleRed.png" alt="">'
        }
        let contenu = ` <td data-label="Référence">${produit.reference}</td> 
                        <td data-label="Catégorie">${produit.categorie}</td>
                        <td data-label="Libellé">${produit.libelle}</td>
                        <td data-label="Prix">${produit.prix} €</td>
                        <td data-label="Stock">${stockAlert}</td>
                        <td data-label="Actions" class="actionBtn">
                            <button onclick="voirProduit('${produit.reference}')" class="btnTable"><img src="assets/images/icon/eye.png" alt=""></button>
                            <button onclick="modifierProduit('${produit.reference}')" class="btnTable"><img src="assets/images/icon/edit.png" alt=""></button>
                            <button onclick="supprimerProduit('${produit.reference}')" class="btnTable"><img src="assets/images/icon/trash-2.png" alt=""></button>
                        </td>`; //le contenu de notre tableau en html 
        tr.innerHTML = contenu; // on met le contenu dans notre entree tr
        liste.appendChild(tr); // on met tr dans la liste ( ici tbody pour moi) 
    }
}

function modifierProduit(reference) {// fonction pour modifier produit
    for (let i = 0; i < donnees.length; i++) { //On lance la boucle
        if (donnees[i].reference === reference) { //Si la reference correspond on stop la boucle 
            produit = donnees[i];
            break;
        }
    }
    document.querySelector(".modal").classList.remove("d-none");//on ouvre la modal
    document.querySelector(".container").classList.add("blur");//en ajoutant nos classes

    document.getElementById("modal-reference").value = produit.reference;// on prérempli les champs
    document.getElementById("modal-categorie").value = produit.categorie;
    document.getElementById("modal-libelle").value = produit.libelle;
    document.getElementById("modal-prix").value = produit.prix;
    document.getElementById("modal-stock").value = produit.stock;
}

modal.addEventListener("submit", function (e) {//ici on va ecouter le submit
    e.preventDefault(); // on empeche le rechargement

    let reference = document.getElementById("modal-reference").value; // on recupère les valeurs modifiés
    let categorie = document.getElementById("modal-categorie").value;
    let libelle = document.getElementById("modal-libelle").value;
    let prix = parseFloat(document.getElementById("modal-prix").value);
    let stock = parseInt(document.getElementById("modal-stock").value);

    for (let i = 0; i < donnees.length; i++) { // on boucle pour trouver le produit a modifier ( grace a la reference)
        if (donnees[i].reference === reference) {
            donnees[i].categorie = categorie;
            donnees[i].libelle = libelle;
            donnees[i].prix = prix;
            donnees[i].stock = stock;
            break;
        }
    }
    localStorage.setItem("produits", JSON.stringify(donnees));
    fermerModal(); // on ferme la modal 
    afficherDonnees(); // et on met à jour la liste
});

function ajouterProduit() { // tout est dans le nom

    document.getElementById("modalAdd").classList.remove("d-none"); //ouvre la modal
    document.querySelector(".container").classList.add("blur"); // avec effet de flou en fond
    document.getElementById("addProduct").reset(); // on s'assure que le formulaire soit vide
}

addModal.addEventListener("submit", function (e) { //on ecoute le submit
    e.preventDefault(); //empeche le refresh

    let reference = document.getElementById("addReference").value; //on prend nos entrés comme valeurs
    let categorie = document.getElementById("addCategorie").value;
    let libelle = document.getElementById("addLibelle").value;
    let fournisseur = document.getElementById("addFournisseur").value;
    let prix = parseFloat(document.getElementById("addPrix").value);
    let description = document.getElementById("addDescription").value;
    let stock = parseInt(document.getElementById("addStock").value);
    let photo = document.getElementById("addPhoto").value;

    donnees.push({ // puis on pousse ces entrées sur le tableau donnée
        reference: reference,
        categorie: categorie,
        libelle: libelle,
        fournisseur: fournisseur,
        prix: prix,
        description: description,
        stock: stock,
        photo: photo
    });

    localStorage.setItem("produits", JSON.stringify(donnees));

    fermerModalAdd();//on ferme la modal
    afficherDonnees();//on MàJ les données
});

function supprimerProduit(reference) { // Suppression produit
    donnees = donnees.filter(produit => produit.reference !== reference); // on cherche toute les references a garder, et on recrée le tableau sans celle que l'on veut supprimer
    localStorage.setItem("produits", JSON.stringify(donnees));
    afficherDonnees(); // mise a jour liste
}

function fermerModal() { //fonction pour fermer la modal de modif
    document.getElementById("modal-reference").value = ""; // on reset bien l'ID
    document.getElementById("modalEdit").reset(); // puis le formulaire
    document.querySelector(".modal").classList.add("d-none"); // on cache la modal
    document.querySelector(".container").classList.remove("blur"); // on enleve le flou
}



function voirProduit(reference){ // voir produit
    for (let i = 0; i < donnees.length; i++) { //on boucle pour trouver le produit
        if (donnees[i].reference === reference) {
            produit = donnees[i];
            break;
        }
    }
    document.getElementById("modalView").classList.remove("d-none"); // affichage modal
    document.querySelector(".container").classList.add("blur"); // flou

    document.getElementById("viewReference").textContent = produit.reference; // on recupere les données a ecrire dans la modal
    document.getElementById("viewLibelle").textContent = produit.libelle;
    document.getElementById("viewDescription").textContent = produit.description;
    document.getElementById("viewStock").textContent = produit.stock;
    document.getElementById("viewPrix").textContent = produit.prix;
    document.getElementById("viewPhoto").src = produit.photo
}

function fermerModalView(){ // fermer la modal fiche produit
    document.getElementById("modalView").classList.add("d-none");
    document.querySelector(".container").classList.remove("blur");
}

function fermerModalAdd(){ // fermer la modal ajout produit
    document.getElementById("modalAdd").classList.add("d-none");
    document.querySelector(".container").classList.remove("blur");
    document.getElementById("addProduct").reset();
}

document.getElementById("burgerBtn").addEventListener("click", function () { // ouverture burger mobile
    document.querySelector(".left").classList.toggle("active");
    document.querySelector(".right").classList.toggle("menu-open");
});
