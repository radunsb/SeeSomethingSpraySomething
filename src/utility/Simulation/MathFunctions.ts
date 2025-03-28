//take an angle in degrees and return it in radians
export function toRadians(angleInDegrees : number) : number{
    return angleInDegrees * Math.PI / 180;
}

//find the cartesian distance between two points
export function distance(x1:number, y1:number, x2:number, y2:number) : number{
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
}

export function flowRateEstimate(oldFlowrate:number, oldPressure:number, newPressure:number) : number{
    return oldFlowrate * Math.sqrt(newPressure) / Math.sqrt(oldPressure);
}