export default class credentialRememberer{

    saveButton = document.getElementById("login-save");
    loadButton = document.getElementById("login-load");

    usernameField = document.getElementById("username");
    passwordField = document.getElementById("password");

    experteCheckbox = document.getElementById("experte");

    experte = false;

    constructor(){
        this.#addEventListeners();

        try{
            this.experte = Boolean(localStorage.getItem("experte"));
        } catch{
            console.log("couldn't get experte status");
            this.experte = false;
        }
        this.experteCheckbox.checked = this.experte;
    }

    #addEventListeners(){
        this.loadButton.addEventListener("click", ()=>{
            if(this.usernameField.value === ""){
                this.usernameField.value = localStorage.getItem("mqttUser");
            }

            if(this.passwordField.value === ""){
                this.passwordField.value = localStorage.getItem("mqttPassword");

                // simulate a connect click for nicer user experience
                document.getElementById("connectButton").dispatchEvent(new Event("click"));
            }
        });

        this.saveButton.addEventListener("click", ()=>{
            if(this.usernameField.value !== ""){
                localStorage.setItem("mqttUser", this.usernameField.value);
            }

            if(this.passwordField.value !== ""){
                localStorage.setItem("mqttPassword", this.passwordField.value);
            }
        });

        this.experteCheckbox.addEventListener("change", ()=>{
            localStorage.setItem("experte", this.experteCheckbox.checked);
        });
    }
}