//fonction qui stock les projets dans une variable
document.addEventListener("DOMContentLoaded", loadProject());

async function loadProject() {
    console.log("j'ai été lancée");
    let data = await getProject();
    projects(data);
}
//Fonction qui récupère les projets via l'API.
async function getProject() {
    const responseProj = await fetch("http://localhost:5678/api/works/");
    if (!responseProj.ok) {
        console.log("problème de connexion");
        return;
    }
    let data = await responseProj.json();
    return data;
}
//Récupération du token
let responseToken = localStorage.getItem("token");

//Fonction qui modifie le header et permet le logout 
function header() {
    const bodyElement = document.querySelector("body");
    const headerElement = document.querySelector("header");
    const divElement = document.createElement("div");
    divElement.setAttribute("class", "edition");
    const titleEdition = document.createElement("h2");
    titleEdition.innerText = "mode édition";
    const icone = document.createElement("i");
    icone.setAttribute("class", "fa-solid fa-pen-to-square");
    bodyElement.appendChild(divElement);
    divElement.appendChild(icone);
    divElement.appendChild(titleEdition);
    bodyElement.insertBefore(divElement, headerElement);
    const logout = document.getElementById("logout");
    logout.innerHTML = "logout";
    logout.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
    })
}
//fonction qui créer le bouton permettant d'ouvrir la modale 
function buttonChange() {
    const projectManager = document.getElementById("gestionProjet");
    const change = document.createElement("p");
    change.setAttribute("id", "open");
    change.innerText = "modifier";
    const iconeModif = document.createElement("i");
    iconeModif.setAttribute("class", "fa-solid fa-pen-to-square");
    projectManager.appendChild(iconeModif);
    projectManager.appendChild(change);
}
//Condition permettant de vérifier la présence ou non de token
if (responseToken !== null) {
    header();
    buttonChange();

    const openModal = document.getElementById("open");
    const modale = document.getElementById("modal");

    openModal.addEventListener("click", () => {
        const modale1 = modale.firstElementChild;
        if (modale1 !== null) {
            modale1.remove();
            template1Gen();
            modale.showModal();
        } else {
            template1Gen();
            modale.showModal();
        }
    })
}
else {
    categorie();
    const login = document.getElementById("logout");
    login.addEventListener("click", () => {
        window.location.href = "login.html";
    })
}

//fonction qui génère les projets stockées 
function projects(works) {
    const sectionGallery = document.querySelector(".gallery");

    sectionGallery.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const figureElement = document.createElement("figure");
        const imageUrlElement = document.createElement("img");
        imageUrlElement.src = works[i].imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = works[i].title;
        sectionGallery.appendChild(figureElement);
        figureElement.appendChild(imageUrlElement);
        figureElement.appendChild(titleElement);
    }
}
//Fonction qui permet de filtrer par catégorie
async function filters(categorieId) {
    let data = await getProject();
    let noFilter = document.getElementById("noFilter");
    noFilter.addEventListener("click", () => {
        projects(data);
    });
    const Filters = data.filter(function (work) {
        return work.categoryId === categorieId;
    });
    projects(Filters);
}

// fonction qui génère les filtres
async function categorie() {
    const reponseCat = await fetch("http://localhost:5678/api/categories");
    if (!reponseCat.ok) {
        console.log("problème de connexion");
        return;
    }
    const filtres = await reponseCat.json();
    const sectionFiltre = document.getElementById("filtre");
    const all = document.createElement("button");
    all.setAttribute("id", "noFilter");
    all.innerText = "Tous";
    sectionFiltre.appendChild(all);
    for (let i = 0; i < filtres.length; i++) {
        const nomElement = document.createElement("button");
        nomElement.innerText = filtres[i].name;
        const categorieId = filtres[i].id;
        nomElement.addEventListener("click", function () {
            filters(categorieId);
        })
        sectionFiltre.appendChild(nomElement);

    }
}
const modal = document.getElementById("modal");
//const modale1 = modal.firstElementChild;
//Fonction qui récupère le template du HTML et génère sa structure
async function template1Gen() {

    const template1 = document.getElementById("modal1-template");

    const clone1 = document.importNode(template1.content, true);

    const close = clone1.querySelector(".closeModal");
    close.setAttribute("class", "fa-solid fa-xmark");

    const addButton = clone1.getElementById("add-project");
    addButton.textContent = "ajouter une photo";

    const title = clone1.querySelector(".modal1-title");
    title.textContent = "Galerie photo";
    //const bin = clone1.querySelector(".bin");
    modal.appendChild(clone1);
    modalProject();
    console.log(modal);
    const modale1 = modal.firstElementChild;
    console.log(modale1);
    addButton.addEventListener("click", () => {
        modale1.remove();
        template2Gen();
    })

    close.addEventListener("click", () => {
        modale1.remove();
        modal.close();
    })
}
//Fonction qui génère les projets dans la première page modale et permet de les supprimer
async function modalProject() {
    const modale1 = modal.firstElementChild;
    let works = await getProject();
    let modalBody = document.querySelector(".modal1-body");
    modalBody.innerHTML = "";
    console.log(modale1);
    for (let i = 0; i < works.length; i++) {
        let div = document.createElement("div");
        let imgModal1 = document.createElement("img");
        imgModal1.classList.add("modal1-img");
        imgModal1.src = works[i].imageUrl;
        let bin = document.createElement("i");
        bin.classList.add("bin");
        bin.setAttribute("class", "fa-solid fa-trash-can");
        bin.setAttribute("data-id", works[i].id);
        div.append(imgModal1, bin);
        modalBody.appendChild(div);

        bin.addEventListener("click", () => {
            let projectsId = bin.getAttribute("data-id");
            console.log(projectsId);
            console.log(responseToken);
            fetch(`http://localhost:5678/api/works/${projectsId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${responseToken}`
                }
            })
                .then(() => {
                    modale1.remove();
            template1Gen();
            loadProject();
                })
        });
    };
}

//Fonction qui envoie le nouveau projet
function template2Gen() {
    async function sendNewProject() {
        const newImage = document.getElementById("image-newproject");
        const newTitle = document.getElementById("title-newproject");
        const newCategory = document.getElementById("category-newproject");
        const formData = new FormData();
        formData.append("title", newTitle.value);
        formData.append("category", newCategory.value);
        formData.append("image", newImage.files[0]);
        console.log(newImage.files[0].size / 1024 / 1024);
        console.log(formData);

        fetch("http://localhost:5678/api/works/", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${responseToken}`
            },
            body: formData
        })
            .then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                loadProject();
            })
        modal2.remove();
        template2Gen();
    }
    const modalTotal = document.getElementById("modal");

    const template2 = document.getElementById("modal2-template");

    const clone2 = document.importNode(template2.content, true);
    console.log(modalTotal);
    const title = clone2.querySelector(".modal2-title");
    title.textContent = "Ajout photo";

    const titleLabel = clone2.querySelector(".title-label");
    titleLabel.textContent = "Titre";

    const categoryLabel = clone2.querySelector(".category-label");
    categoryLabel.textContent = "Catégorie";

    const closeModal = clone2.querySelector(".closeModal");
    closeModal.setAttribute("class", "fa-solid fa-xmark");

    const returnArrow = clone2.querySelector(".returnArrow");
    returnArrow.setAttribute("class", "fa-solid fa-arrow-left");

    const placeHolder = clone2.querySelector("#inputImage");
    placeHolder.src = "assets/images/Vector(2).png";

    const addImgText = clone2.getElementById("addimg-text");
    addImgText.textContent = "jpg, png : 4mo max";

    const buttonValidation = clone2.getElementById("validation");
    buttonValidation.addEventListener("click", (event) => {
        event.preventDefault();
        sendNewProject();

    });

    const categoryList = clone2.querySelector(".catList");
    //Fonction qui rajoute la preview de l'image
    function addImage(eventImage) {
        const input = eventImage.target;
        const previewImage = document.getElementById("inputImage");


        if (input.files && input.files[0]) {
            console.log(input.files);
            if (input.files[0].type === "image/png" || input.files[0].type === "image/jpg" || input.files[0].type === "image/jpeg") {
                if (input.files[0].size <= 4000000) {
                    document.getElementById("addimg").style.padding = "0"
                    document.querySelector("#addimg-button").style.display = "none"
                    document.querySelector("#addimg-text").style.display = "none"
                    document.getElementById("inputImage").src = "";
                    const reader = new FileReader();
                    reader.onload = function (eventImage) {
                        previewImage.src = eventImage.target.result;
                    }
                    reader.readAsDataURL(input.files[0]);
                    checkImage = true;
                    check();
                }
                else {
                    window.alert("merci de mettre un fichier de maximum 4mo.");
                    input.files[0]; value = "";
                }
            }
            else {
                window.alert("merci de mettre un fichier de type PNG ou JPG.");
                input.files[0]; value = "";
            }
        }
    }
    clone2.getElementById("image-newproject").addEventListener("change", addImage)

    const titleInput = clone2.getElementById("title-newproject");
    const categoryInput = clone2.getElementById("category-newproject");
    //Variables qui indique si les champs titre, catégorie et l'image sont remplis
    let checkImage = false;
    let checkTitle = false;
    let checkCategory = false;
    titleInput.addEventListener("input", () => {
        if (titleInput.value.length > 0) {
            console.log("il y a un titre");
            checkTitle = true;
            console.log(checkTitle);
            check();
        }
        else {
            console.log("il n'y a pas de titre");
            checkTitle = false;
            console.log(checkTitle);
            check();
        }
    })
    categoryInput.addEventListener("input", () => {
        if (categoryInput.value.length > 0) {
            console.log("il y a une catégorie");
            checkCategory = true;
            console.log(checkCategory);
            check();
        }
        else {
            console.log("il n'y a pas de catégorie");
            checkCategory = false;
            console.log(checkCategory);
            check();
        }
    })
    //Fonction qui vérifie que les champs titre,catégorie et l'image sont bien remplis et met le bouton en vert si c'est le cas
    function check() {
        if (checkCategory === true && checkTitle === true && checkImage === true) {
            buttonValidation.removeAttribute("disabled");
            buttonValidation.style.backgroundColor = "#1D6154";
        }
        else {

            buttonValidation.setAttribute("disabled", "disabled");
            buttonValidation.style.backgroundColor = "grey";
        }
    }

    fetch("http://localhost:5678/api/categories")
        .then(responsesCat => responsesCat.json())
        .then(categories => {
            for (let category of categories) {
                const options = document.createElement("option");
                options.classList.add("categoryOption");
                options.textContent = category.name;
                options.setAttribute("value", category.id);
                categoryList.appendChild(options);
            }
        });

    modalTotal.appendChild(clone2);
    const modal2 = modalTotal.firstElementChild;
    returnArrow.addEventListener("click", () => {
        modal2.remove();
        template1Gen();
    });
    closeModal.addEventListener("click", () => {
        modal2.remove();
        modalTotal.close();
    })
}
