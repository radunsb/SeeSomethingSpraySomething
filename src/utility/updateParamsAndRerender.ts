import { UtilityInterfaces } from "./models";

export function updateParamsAndRerender(oldMap: Map<string, UtilityInterfaces.Parameter>, updateMap: React.Dispatch<React.SetStateAction<Map<string, UtilityInterfaces.Parameter>>>){
    const newMap : Map<string, UtilityInterfaces.Parameter> = new Map();

    for(const [paramName, param] of oldMap){
        const newParam = {
            name:param.name, 
            type:param.type,
            min:param.min,
            max:param.max,
            value:param.value
        }

        newMap.set(paramName, newParam);
    }

    updateMap(newMap);
}