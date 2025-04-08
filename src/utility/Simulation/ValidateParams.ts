import { UtilityInterfaces } from "../models";
import { getOrException } from "../ProjectUtilities";

export function validateParams(parameterMap:Map<string, UtilityInterfaces.Parameter>) : boolean {
    const nozzleHeight = Number(getOrException(parameterMap, "nozzle_height").value);
    const productHeight = Number(getOrException(parameterMap, "product_height").value);

    const productWidth = Number(getOrException(parameterMap, "product_width").value);
    const lineWidth = Number(getOrException(parameterMap, "line_width").value);

    if(nozzleHeight <= productHeight) return false;

    console.log(`product width is: ${productWidth} and line is is: ${lineWidth}`)

    if(lineWidth <= productWidth) return false;

    return true;
}