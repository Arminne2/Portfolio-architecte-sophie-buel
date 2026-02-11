//fonction qui génère tous les projets
async function appel(){
     const responseProj = await fetch("http://localhost:5678/api/works/" + categoryID);
    if (!responseProj.ok){
        console.log("problème de connexion");
    }
    const data = await responseProj.json();
    console.log(data);
}

async function projets() {
    //récupère les données
    appel();
    //génère l'HTML
for (let i =0; i< data.length; i++){
    const sectionGallery = document.querySelector(".gallery");
    const figureElement = document.createElement("figure");
    const imageUrlElement = document.createElement("img");
    imageUrlElement.src = data[i].imageUrl;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = data[i].title;
    console.log(sectionGallery);
    sectionGallery.appendChild(figureElement);
    figureElement.appendChild(imageUrlElement);
    figureElement.appendChild(titleElement);
}
}


// fonction qui génère les filtres
async function categorie(){
    const reponseCat = await fetch("http://localhost:5678/api/categories");
    if(!reponseCat.ok){
        console.log("problème de connexion");
    }
    const filtres = await reponseCat.json();
    console.log(filtres);
for (let i =0; i< filtres.length; i++){
    const sectionFiltre = document.querySelector(".filtre");
    const nomElement = document.createElement("h2");
    nomElement.innerText = filtres[i].name;
    nomElement.addEventListener("click", function()
    {
       console.log("Bonjour");
    })
    sectionFiltre.appendChild(nomElement);

}
}

categorie();
projets();


/*boutonFiltre.addEventListener("click", function(e){
    console.log(e);
})*/


//fonction filtre objet

boutonObjet.addEventListener("click", function(){
const objet = data.filter(function (projet){
  return projet.categoryId = 1;
});

document.querySelector(".gallery").innerHTML= "";
projets(objet);
});
//fonction filtre appartement

boutonAppart.addEventListener("click", function(){
const appart = data.filter(function (projet){
  return projet.categoryId = 2;
});

document.querySelector(".gallery").innerHTML= "";
projets(appart);
});
//fonction filtre Hotel et restaurants

boutonHotelRestaurant.addEventListener("click", function(){
const hotelRestaurant = data.filter(function (projet){
  return projet.categoryId = 3;
})});

document.querySelector(".gallery").innerHTML= "";
projets(hotelRestaurant);
