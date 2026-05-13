//Fonction qui permet d'envoyer le formulaire d'identification et vérifier l'autentification
function SendIdentification(){
const formLogin = document.getElementById("form");
console.log(formLogin);
formLogin.addEventListener("submit", function(event){
event.preventDefault();
const login = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=mdp]").value,
}
const body = JSON.stringify(login);
console.log(body);

fetch("http://localhost:5678/api/users/login", {

    method:"POST",
    headers: {"Content-Type": "application/json"},
    body
})
//.then(function(){console.log(identification)});
.then(async (identification) => {
 const data = await identification.json();
localStorage.setItem("token", data.token);
    if (identification.status !== 200) {
      console.log("error");
      const noUser = document.querySelector(".info");
      noUser.innerText = "identifiants incorrects";
    }
    if (identification.status == 200){
       window.location.href="index.html";
       console.log(data.token);
    }
  });
});

}
SendIdentification();
