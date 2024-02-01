import Paho from 'paho-mqtt';
import actionButtons from "./actionButtons";

export default class connectLogic{

    topics = [
        {
            name: "inverterTemp",
            display: "Inverter Temperatur",
            topic: "inverter_ohnesteuerung/gartenhaus/ch0/Temp",
        },
        {
            name: "inverterPAC",
            display: "Inverter Leistung",
            topic: "inverter_ohnesteuerung/gartenhaus/ch0/P_AC",
        },
        {
            name: "inverterPDC",
            topic: "inverter_ohnesteuerung/gartenhaus/ch0/P_DC",
        },

        {
            name: "bmsTemp",
            display: "Batterietemperatur",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_temperature_1/state"
        },
        {
            name: "bmsPower",
            display: "Batterie Leistung",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_power/state"
        },
        {
            name: "bmsCellDelta",
            display: "Batteriezellspannungsdifferenz",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_delta_cell_voltage/state"
        },
        {
            name: "bmsSOC",
            display: "BatterieLadestand",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_state_of_charge/state"
        },
        {
            name: "bmsCylcles",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_charging_cycles/state"
        },

        {
            name: "bmsMinCellVoltage",
            display: "Minimale Zellspannung",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_min_cell_voltage/state"
        },

        {
            name: "bmsMaxCellVoltage",
            display: "Maximale Zellspannung",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_max_cell_voltage/state"
        },

        {
            name: "bmsCurrent",
            display: "Strom",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_current/state"
        },

        {
            name: "bmsErrors",
            display: "Fehler",
            topic: "pv-speicher-bms/sensor/pv-speicher-bms_error/state"
        },

        {
            name: "bmsHeaterState",
            display: "Batterie Heizung",
            topic: "pv-speicher-bms/switch/heizung/state"
        }

    ];

    client;

    connectForm = document.getElementById("connection-information-form");

    hostInput = document.getElementById("host");
    usernameInput = document.getElementById("username");
    passwordInput = document.getElementById("password");

    connectButton = document.getElementById("connectButton");
    disconnectButton = document.getElementById("disconnectButton");

    guiCB;

    constructor(guiCallback){
        this.guiCB = guiCallback;
        this.#addEventListeners();

        new actionButtons(this.#publish.bind(this));

        console.log("initialized connect");
    }

    #publish(topic, payload){
        let Message = new Paho.Message(payload);
        Message.destinationName = topic;

        this.client.send(Message);
    }

    #addEventListeners(){
        this.connectButton.addEventListener("click", ()=>{
            // check for stupid inputs
            let hostname = this.hostInput.value;
            let username = this.usernameInput.value;
            let password = this.passwordInput.value;

            if(typeof hostname === "undefined" || typeof username === "undefined" || typeof password === "undefined"
            || hostname === "" || username === "" || password === ""){
                this.connectForm.classList.add = "warning";
                setTimeout(()=>{
                    this.connectForm.classList.remove = "warning";
                }, 2000);
                return;
            }

            // actually connect
            this.client = new Paho.Client(
                hostname,
                9001,
                "/ws",
                "webClient"
            );

            this.client.onConnectionLost = this.onConnectionLost.bind(this);
            this.client.onMessageArrived = this.onMessageArrived.bind(this);

            this.client.connect({
                onSuccess: this.onSuccessConnect.bind(this),
                userName: username,
                password: password
            });
        });

        this.disconnectButton.addEventListener("click", ()=>{
            this.client.disconnect();
        });
    }

    onSuccessConnect(){
        console.log("successfully connected!");

        for (const topic of this.topics) {
            this.client.subscribe(topic.topic);
            console.log("subscribing to: " + topic.topic);
        }
    }

    onConnectionLost(responseObject){
        document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost.</span><br>";
        if(responseObject !== 0){
            document.getElementById("messages").innerHTML += "<span> ERROR:"+ responseObject.errorMessage +"</span><br>";
        }
    }

    onMessageArrived(msg){
        for (const topic of this.topics) {
            if(msg.destinationName === topic.topic){
                this.guiCB(topic, msg.payloadString)
            }
        }
    }
}