import { UtilityInterfaces } from "../models";
import { getOrException } from "../ProjectUtilities";

export function validateParams(parameterMap:Map<string, UtilityInterfaces.Parameter>) : boolean {
    const nozzleHeight = Number(getOrException(parameterMap, "nozzle_height").value);
    const product_height = Number(getOrException(parameterMap, "product_height"));

    if(nozzleHeight <= product_height) return false;

    return true;
}