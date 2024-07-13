import {default as ocv_soc} from "./voc_soc_lifepo.json";


// SOC Berechnung
export function calculateSOC(voltage){
    let lut = ocv_soc;


    let closest_lower_voltage = -1;
    for (let i = 0; i < lut.x.length; i++) {
        let x = lut.x[i];

        //console.log("x: " + x + ", voltage: " + voltage);
        if(parseFloat(x) < parseFloat(voltage)){
            closest_lower_voltage = x;
        }
    }
    if(closest_lower_voltage < 0){
        closest_lower_voltage = lut.x[0];
    }

    let lower_index = lut.x.indexOf(closest_lower_voltage);
    let higher_index = 0;

    if(lower_index < (lut.x.length - 1)){
        higher_index = lower_index + 1;
    }else{
        lower_index = lower_index - 1;
        higher_index = lower_index + 1;
    }

    const closest_higher_voltage = lut.x[higher_index];

    let lower_soc = lut.y[lower_index];
    let higher_soc = lut.y[higher_index];

    //console.log(lower_index);
    //console.log(higher_index);

    //console.log("lsoc: " + lower_soc.toFixed(2) + " hsoc: " + higher_soc.toFixed(2));
    //console.log("lv: " + closest_lower_voltage.toFixed(2) + " hv: " + closest_higher_voltage.toFixed(2));


    return lower_soc
        + (higher_soc - lower_soc)
        * ((voltage - closest_lower_voltage) / Math.abs(closest_higher_voltage - closest_lower_voltage));
}