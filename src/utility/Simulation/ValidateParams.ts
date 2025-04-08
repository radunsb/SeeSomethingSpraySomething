import { UtilityInterfaces } from "../models";
import { getOrException } from "../ProjectUtilities";

export function validateParams(parameterMap:Map<string, UtilityInterfaces.Parameter>) : boolean {
    const nozzleHeight = Number(getOrException(parameterMap, "nozzle_height").value);
    const productHeight = Number(getOrException(parameterMap, "product_height").value);

    const productWidth = Number(getOrException(parameterMap, "product_width").value);
    const lineWidth = Number(getOrException(parameterMap, "line_width").value);

    const alignment = Number(getOrException(parameterMap, "alignment").value);

    if(nozzleHeight <= productHeight) return false;

    if(lineWidth < productWidth) return false;

    if(alignment >= 90) return false;

    return true;
}