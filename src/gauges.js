import connectLogic from "./connect";

export default class gauges{

    gaugesContainer = document.getElementById("gauges");

    experte;

    constructor(experte = false){
        this.experte = experte;

        new connectLogic(this.setGauge.bind(this));
    }

    setGauge(topic, payload){
        let div = this.gaugesContainer.querySelector("#" + topic.name);

        if(div === null){
            return;
        }

        let newDiv = document.createElement("div");
        newDiv.id = topic.name;

        let nameSpan = document.createElement("span");
        if(typeof topic.display !== "undefined"){
            nameSpan.innerHTML = topic.display;
        }else{
            if(this.experte){
                nameSpan.innerHTML = topic.name;
            }else{
                return;
            }
        }

        let valueSpan = document.createElement("span");
        valueSpan.innerHTML = payload;

        valueSpan.classList.add("updated");
        setTimeout(()=>{
            valueSpan.classList.remove("updated");
        }, 500);

        newDiv.appendChild(nameSpan);
        newDiv.appendChild(valueSpan);

        div.replaceWith(newDiv);

    }
}