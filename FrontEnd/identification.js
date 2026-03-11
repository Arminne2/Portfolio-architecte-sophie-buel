function EnvoyerIdentification(){
const formulaireLogin = document.getElementById("form");
console.log(formulaireLogin);
formulaireLogin.addEventListener("submit", function(event){
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
 const token = await identification.json();
localStorage.setItem("token", token);
    if (identification.status !== 200) {
      console.log("erreur");
      const noUser = document.querySelector(".info");
      noUser.innerText = "l'utilisateur n'existe pas";
    }
    if (identification.status == 200){
       window.location.href="index.html";
       console.log(token);
    }
  });
});

}
EnvoyerIdentification();
