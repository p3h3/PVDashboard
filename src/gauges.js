import connectLogic from "./connect";
import {calculateSOC} from "./calculateVOCSOC";

export default class gauges{

    gaugesContainer = document.getElementById("gauges");

    experte;

    i = 2.4;

    constructor(experte = false){
        this.experte = experte;

        new connectLogic(this.setGauge.bind(this));


        setInterval(()=>{
            if(this.i > 3.5){
                this.i = 2.4;
            }
            this.setGauge({
                name: "bmsVOCSOC",
                display: "BatterieLadestand Spannung"
            }, (100 * calculateSOC(this.i)).toFixed(0));

            console.log("voltage: " + this.i.toFixed(2) + " soc: " + calculateSOC(this.i).toFixed(2));

            this.i += 0.05;
        }, 500);

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


        if(topic.name === "bmsAvgCellVoltage"){
            this.setGauge({
                name: "bmsVOCSOC",
                display: "BatterieLadestand Spannung"
            }, (100 * calculateSOC(parseFloat(payload))).toFixed(0));
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