import { UtilityInterfaces } from "../models";
import { getOrException } from "../ProjectUtilities";

export function validateParams(parameterMap:Map<string, UtilityInterfaces.Parameter>) : boolean {
    const nozzleHeight = Number(getOrException(parameterMap, "nozzle_height").value);
    const productHeight = Number(getOrException(parameterMap, "product_height").value);

    console.log(`validating parameters:\n\tnozzle height: ${nozzleHeight}\n\tproduct height: ${productHeight}`)

    if(nozzleHeight <= productHeight) return false;

    return true;
}