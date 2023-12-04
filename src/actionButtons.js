export default class actionButtons{

    writeCallback;

    heizungAnButton = document.getElementById("heizung-an");
    heizungAusButton = document.getElementById("heizung-aus");

    constructor(writeCallback){
        this.writeCallback = writeCallback;

        this.#addEventListeners();
    }

    #addEventListeners(){
        this.heizungAnButton.addEventListener("click", ()=>{
            this.writeCallback("pv-speicher-bms/switch/heizung/command", "ON");
        });
        this.heizungAusButton.addEventListener("click", ()=>{
            this.writeCallback("pv-speicher-bms/switch/heizung/command", "OFF");
        });
    }
}