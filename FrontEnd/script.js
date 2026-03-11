let data = [];
let reponseToken = localStorage.getItem("token");


if (reponseToken !== null){

    const editionBandeau = document.querySelector("header");
    editionBandeau.innerText = "j'ai réussi";
    console.log("j'ai réussi");
}
else{
    console.log("pas de token");
}
//fonction qui génère tous les projets
async function appelTravail(){
     const responseProj = await fetch("http://localhost:5678/api/works/");
    if (!responseProj.ok){
        console.log("problème de connexion");
        return;
    }
    data = await responseProj.json();
    console.log(data);
    projets(data);
}

function projets(works) {
    console.log(works);
    //génère l'HTML
    const sectionGallery = document.querySelector(".gallery");

  sectionGallery.innerHTML = "";
for (let i =0; i< works.length; i++){
    const figureElement = document.createElement("figure");
    const imageUrlElement = document.createElement("img");
    imageUrlElement.src = works[i].imageUrl;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = works[i].title;
    console.log(sectionGallery);
    sectionGallery.appendChild(figureElement);
    figureElement.appendChild(imageUrlElement);
    figureElement.appendChild(titleElement);
}
}
 function filtre(categorieId){
    console.log(categorieId);
    console.log(data);
    const Filtre = data.filter(function (work){
    return work.categoryId === categorieId;
});
console.log(Filtre);
projets(Filtre);
}

// fonction qui génère les filtres
async function categorie(){
    const reponseCat = await fetch("http://localhost:5678/api/categories");
    if(!reponseCat.ok){
        console.log("problème de connexion");
        return;
    }
    const filtres = await reponseCat.json();
    const sectionFiltre = document.querySelector(".filtre");
    console.log(filtres);
for (let i =0; i< filtres.length; i++){
    const nomElement = document.createElement("button");
    nomElement.innerText = filtres[i].name;
    const categorieId = filtres[i].id;
    nomElement.addEventListener("click", function()
    {
       filtre(categorieId)
    })
    sectionFiltre.appendChild(nomElement);

}
}

appelTravail();
categorie();

