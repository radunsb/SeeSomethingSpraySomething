import {UtilityInterfaces} from "./models.ts"

/* A NOTE ON UNITS AND COORDINATES

all lengths are stored in inches, all times in seconds, and all angles in degrees

Let the direction the conveyor belt moves be the positive x direction
Let up from the conveyor belt be the positve z direction
Let to the left of the positive x direction be positive y

If you face the positive x direction, the origin is the right-most point on the conveyor belt that is directly beneath the spray manifold

t=0 at the instant the product reaches the sensor

*/

//take an angle in degrees and return it in radians
function toRadians(angleInDegrees : number) : number{
    return angleInDegrees * Math.PI / 180;
}

//find the cartesian distance between two points
function distance(x1:number, y1:number, x2:number, y2:number) : number{
    return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1))
}

namespace GlobalParams{
    //once this is integrated into the application, these will be acquired from the drawer
    //THESE VALUES SHOULD NOT BE CHANGED OUTSIDE OF THE SETGLOBALPARAMS METHOD
    export let SENSOR_DISTANCE = 18;
    export let LINE_SPEED = 10; //50 ft/min *12in/foot * 1min/60sec = 10 in/sec

    export let LINE_WIDTH = 24;

    export let PRODUCT_WIDTH = 20;
    export let PRODUCT_LENGTH = 36;
    export let PRODUCT_HEIGHT = 2;

    export let NOZZLE_HEIGHT = 6;

    export let SPRAY_START_TIME = 1.8; //s
    export let SPRAY_END_TIME = 5.4;
    export let SPRAY_DURATION = 3.6;

    export let MAX_FREQUENCY = 3000; //Hz
    export let DUTY_CYCLE = 1; // this 1 represents 100%
    export let FREQUENCY = 0; // 0 Hz means the nozzle is on for 100% of the spray duration

    export class Nozzle{
        readonly sprayAngle: number; //should be on the order of 60 degrees
        readonly thicknessAngle: number; //should be on the order of 3 degrees
        readonly twistAngle: number; //should be on the order of 5 degrees
        readonly flowRate: number; //stored in cubic inches per second
        readonly yPos: number

        constructor(spray_angle:number, thickness_angle:number, twist_angle:number, flowrate_galpermin:number, yPos:number){
            this.sprayAngle = spray_angle;
            this.thicknessAngle = thickness_angle;
            this.twistAngle = twist_angle;
            this.flowRate = flowrate_galpermin/60; //comes in as gallons/minute -> gal/min * 1min/60sec
            this.yPos = yPos;
        }
    }
    export let NOZZLE_LIST : Nozzle[] = [new Nozzle(100, 3, 5, 2, 18),
                                            new Nozzle(100, 3, 5, 2, 11)];
}

export function updateGlobalParams(parameterMap:Map<String, UtilityInterfaces.Parameter>){
    const new_sensor_distance = parameterMap.get("sensor_distance");
    if(typeof new_sensor_distance !== "undefined"){
        GlobalParams.SENSOR_DISTANCE = Number(new_sensor_distance.value);
    }

    const new_line_speed = parameterMap.get("line_speed");
    if(typeof new_line_speed !== "undefined"){
        //divide by 5 to convert from ft/min to in/s (1 ft/min * 12in/ft * 1min/60s = 1in/5s)
        GlobalParams.LINE_SPEED = Number(new_line_speed.value) / 5;
    }

    const new_line_width = parameterMap.get("line_width");
    if(typeof new_line_width !== "undefined"){
        GlobalParams.LINE_WIDTH = Number(new_line_width.value);
    }

    const new_product_width = parameterMap.get("product_width");
    if(typeof new_product_width !== "undefined"){
        GlobalParams.PRODUCT_WIDTH = Number(new_product_width.value);
    }

    const new_product_length = parameterMap.get("product_length");
    if(typeof new_product_length !== "undefined"){
        GlobalParams.PRODUCT_LENGTH = Number(new_product_length.value);
    }

    const new_product_height = parameterMap.get("product_height");
    if(typeof new_product_height !== "undefined"){
        GlobalParams.PRODUCT_HEIGHT = Number(new_product_height.value);
    }

    const new_nozzle_height = parameterMap.get("nozzle_height");
    if(typeof new_nozzle_height !== "undefined"){
        GlobalParams.NOZZLE_HEIGHT = Number(new_nozzle_height.value);
    }

    const new_flow_rate = parameterMap.get("flow_rate");
    
    //Nozzles!
    let new_nozzle_count = parameterMap.get("nozzle_count");
    let new_nozzle_spacing = parameterMap.get("nozzle_spacing");
    let new_spray_angle = parameterMap.get("angle");
    let new_twist_angle = parameterMap.get("twist_angle");

    if(typeof new_nozzle_count !== "undefined" && typeof new_nozzle_spacing !== "undefined" && typeof new_spray_angle !== "undefined" && typeof new_twist_angle !== "undefined" && typeof new_flow_rate !== "undefined"){
        GlobalParams.NOZZLE_LIST = [];
        for (let i = 0; i < Number(new_nozzle_count.value); i++){
            const this_pos = 0.5 * GlobalParams.LINE_WIDTH + Number(new_nozzle_spacing.value) * (0.5 - 0.5*Number(new_nozzle_count.value) + i);
            const new_nozzle = new GlobalParams.Nozzle(Number(new_spray_angle.value),3,Number(new_twist_angle.value),Number(new_flow_rate.value),this_pos);//read and replace parameters
            GlobalParams.NOZZLE_LIST.push(new_nozzle);
        }
    }

    //timing mode params
    //if start_delay is undefined, then that's a problem. One of the other two is allowed to be undefined
    let new_start_delay = parameterMap.get("start_delay");
    let new_stop_delay = parameterMap.get("stop_delay");
    let new_spray_duration = parameterMap.get("spray_duration");

    if(typeof new_start_delay !== "undefined"){
        //this is simple, because t=0 is when the sensor is triggered
        GlobalParams.SPRAY_START_TIME = Number(new_start_delay.value);
    }

    //we're in fixed time/distance
    if((true || typeof new_stop_delay === "undefined") && typeof new_spray_duration !== "undefined"){
        GlobalParams.SPRAY_DURATION = Number(new_spray_duration.value);
        GlobalParams.SPRAY_END_TIME = GlobalParams.SPRAY_START_TIME + GlobalParams.SPRAY_DURATION;
    }
    //we're in variable time/distance
    else if(typeof new_stop_delay !== "undefined" && typeof new_spray_duration === "undefined"){
        const falling_edge_trigger_time = GlobalParams.PRODUCT_LENGTH / GlobalParams.LINE_SPEED;
        GlobalParams.SPRAY_END_TIME = falling_edge_trigger_time + Number(new_stop_delay.value);
        GlobalParams.SPRAY_DURATION = GlobalParams.SPRAY_END_TIME - GlobalParams.SPRAY_START_TIME; 
    }

    //console.log(`line speed: ${GlobalParams.LINE_SPEED}\nsensor distance: ${GlobalParams.SENSOR_DISTANCE}\nproduct length: ${GlobalParams.PRODUCT_LENGTH}`)

    //if there was an error receiving or setting timing modes, default to automatic timing
    if(GlobalParams.SPRAY_DURATION.toFixed(2) !== (GlobalParams.SPRAY_END_TIME - GlobalParams.SPRAY_START_TIME).toFixed(2)){
        console.error(`TIMING MODE ENTRY ERROR - given values don't match:\nstart time: ${GlobalParams.SPRAY_START_TIME}\nend time: ${GlobalParams.SPRAY_END_TIME}\nduration: ${GlobalParams.SPRAY_DURATION}\n\ndefaulting to automatic timing.`)
        GlobalParams.SPRAY_START_TIME = GlobalParams.SENSOR_DISTANCE / GlobalParams.LINE_SPEED - 0.01; //start just before the product arrives
        GlobalParams.SPRAY_DURATION = GlobalParams.PRODUCT_LENGTH / GlobalParams.LINE_SPEED;
        GlobalParams.SPRAY_END_TIME = GlobalParams.SPRAY_START_TIME + GlobalParams.SPRAY_DURATION + 0.02;
        console.log(`Auto starting at ${GlobalParams.SPRAY_START_TIME}\nAuto-ending at ${GlobalParams.SPRAY_END_TIME}`); //end just after the product passes
    }
}

namespace LocalConstants{
    export const TIME_STEP = 0.0001; //second

    export const NUM_WIDTH_ELEMENTS = 100;
    export const ELEMENT_WIDTH = GlobalParams.PRODUCT_WIDTH/NUM_WIDTH_ELEMENTS;

    export const NUM_LENGTH_ELEMENTS = 100;
    export const ELEMENT_LENGTH = GlobalParams.PRODUCT_LENGTH/NUM_LENGTH_ELEMENTS;

    export const ELEMENT_AREA = ELEMENT_LENGTH*ELEMENT_WIDTH;
}

export class ProductElement{
    readonly yPos: number;
    readonly xOffset: number;
    private volumeApplied: number;

    //xOffset is the position of the center of this product element relative to the front edge of the product
    //yPos is the y-value of this element's center's position. It does not change.
    constructor(xIndex:number, yIndex:number){
        this.yPos = (GlobalParams.LINE_WIDTH - GlobalParams.PRODUCT_WIDTH)/2 + LocalConstants.ELEMENT_WIDTH*(0.5+yIndex);
        this.xOffset = -1*LocalConstants.ELEMENT_LENGTH*(0.5+xIndex);
        this.volumeApplied = 0;
    }

    //send in the spray density that this element is receiving in units of (gallons of spray)/((square inch of product)*(second))
    //add that amount of spray to this productElement for one timestep
    addSpray(sprayDensity:number){
        this.volumeApplied += sprayDensity*LocalConstants.TIME_STEP;
    }

    //return the spray density on this product element
    getElementSprayDensity() : number{
        return this.volumeApplied / LocalConstants.ELEMENT_AREA;
    }

    toString():string{
        return `ProductElement:(${this.xOffset},${this.yPos})`
    }
}

class NozzleFunction{
    readonly parentNozzle : GlobalParams.Nozzle;
    readonly sprayLength : number;
    readonly sprayWidth : number;
    readonly maxDensity : number;
    readonly patternOriginX : number;
    readonly patternOriginY : number;
    readonly patternTerminusX : number;
    readonly patternTerminusY : number;
    readonly patternSlope : number; 

    constructor(nozzle : GlobalParams.Nozzle){
        this.parentNozzle = nozzle;

        let spray_height = GlobalParams.NOZZLE_HEIGHT - GlobalParams.PRODUCT_HEIGHT;
        this.sprayLength = 2*spray_height*Math.tan(toRadians(nozzle.sprayAngle/2));
        this.sprayWidth = 2*spray_height*Math.tan(toRadians(nozzle.thicknessAngle/2));

        this.maxDensity = nozzle.flowRate / (0.7*this.sprayLength*this.sprayWidth);

        this.patternOriginX = -1*this.sprayLength*Math.sin(toRadians(nozzle.twistAngle))/2;
        this.patternOriginY = nozzle.yPos - this.sprayLength*Math.cos(toRadians(nozzle.twistAngle))/2;

        this.patternTerminusX = this.patternOriginX * -1;
        this.patternTerminusY = nozzle.yPos + (nozzle.yPos - this.patternOriginY);

        this.patternSlope = (this.patternTerminusY - this.patternOriginY)/(this.patternTerminusX - this.patternOriginX);
    }

    //take in a position and output the spray density (volume/(area*time)) at that position
    //TIME-AGNOSTIC FUNCTION! DO NOT CALL IN A NOZZLE-DISABLED TIME STEP!
    density(x : number, y : number) : number{
        //in my old terminology, nearestSpine = Ps
        const nearestSpineX = ( this.patternSlope*this.patternOriginX + x/this.patternSlope - this.patternOriginY + y )/( this.patternSlope + 1/this.patternSlope)
        const nearestSpineY = this.patternSlope*(nearestSpineX - this.patternOriginX) + this.patternOriginY;

        const distOrigToNs = distance(nearestSpineX, nearestSpineY, this.patternOriginX, this.patternOriginY);

        if (distance(x,y, nearestSpineX, nearestSpineY) >= this.sprayWidth/2){
            return 0;
        }
        else if(distOrigToNs >= this.sprayLength || distance(nearestSpineX,nearestSpineY,this.patternTerminusX,this.patternTerminusY) >= this.sprayLength ){
            return 0;
        }
        else if( 0.3*this.sprayLength <= distOrigToNs && distOrigToNs <= 0.7*this.sprayLength){
            return this.maxDensity;
        }
        else if(distOrigToNs <= 0.3*this.sprayLength){
            return this.maxDensity * distOrigToNs / (0.3*this.sprayLength);
        }
        else if(distOrigToNs >= 0.7*this.sprayLength){
            return this.maxDensity * (this.sprayLength - distOrigToNs) / (0.3*this.sprayLength);
        }
        else{
            throw Error("Unreachable state: nearest spine point is neither inside nor outside the spray pattern");
        }
    }
}

function InitializeProductArray() : ProductElement[][]{
    let product : ProductElement[][] = [];

    //Based on the way we defined our coordinates, we're going to have to resort to some shenanigans to make our array look how we want.
    //x=0,y=0 is at the bottom right, so lengthIndex=0 in the array will map to the MAXIMUM x-index when instantiating the ProductElement.
    //so x-index is #lengthElements-1-lengthIndex

    //to make matters worse, we can get serious efficiency gains by treating our inner arrays as columns rather than rows
    // so our coordinate pairs go product[y][x]

    let lengthIndex : number = 0;

    while (lengthIndex < LocalConstants.NUM_LENGTH_ELEMENTS){
        let widthIndex = 0;
        let xIndex = LocalConstants.NUM_LENGTH_ELEMENTS - 1 - lengthIndex;
        product.push([])

        while(widthIndex < LocalConstants.NUM_WIDTH_ELEMENTS){
            let yIndex = LocalConstants.NUM_WIDTH_ELEMENTS - 1 - widthIndex;

            const thisElement = new ProductElement(xIndex, yIndex);
            product[lengthIndex].push(thisElement);

            widthIndex++
        }

        lengthIndex++;
    }

    return product
}

function getMinSprayedX(nozzleFunctions : NozzleFunction[]) : number {
    let minSprayedX = 0;
    for(let nozzleFunc of nozzleFunctions){
        const originToOutside = 0.5*nozzleFunc.sprayWidth * Math.cos(toRadians(nozzleFunc.parentNozzle.twistAngle));
        const thisNozzleMin = nozzleFunc.patternOriginX - originToOutside; //origin.x <= 0

        if( thisNozzleMin < minSprayedX){
            minSprayedX = thisNozzleMin;
        }
    }
    return minSprayedX;
}

function nozzles_active() : Boolean {
    return true;
}

export function computeSprayPattern(parameterMap:Map<String, UtilityInterfaces.Parameter>) : ProductElement[][]{
    //console.log("computing spray pattern");
    
    //update the local copies of global parameters
    updateGlobalParams(parameterMap);

    //create product array
    let productASPRAY = InitializeProductArray();

    //find array of all nozzle functions
    let nozzleFunctions : NozzleFunction[] = [];
    for(let nozzle of GlobalParams.NOZZLE_LIST){
        nozzleFunctions.push(new NozzleFunction(nozzle));
    }

    //find the leftmost point covered by any spray nozzle
    const minSprayedX = getMinSprayedX(nozzleFunctions);
    //symmetry is handy for finding the max X value sprayed
    const maxSprayedX = -1*minSprayedX;

    //begin the simulation loop!
    let t = GlobalParams.SPRAY_START_TIME;

    while(t < GlobalParams.SPRAY_END_TIME){
        let productFrontX = t * GlobalParams.LINE_SPEED - GlobalParams.SENSOR_DISTANCE;


        //only try to apply spray to the product if the nozzles are active
        if(nozzles_active()){
            //iterate through the rows of product elements
            //checking every product element at every timestep is extremely slow! Find optimizations.
            for(let col of productASPRAY){
                const colX = productFrontX + col[0].xOffset;
                if(colX > minSprayedX && colX < maxSprayedX){
                    for(let elem of col){
                        //apply spray from every nozzle to every element
                        for(let noz of nozzleFunctions){
                            const densityToAdd = noz.density(colX, elem.yPos);
                            elem.addSpray(densityToAdd);
                        }
                    }
                }
            }
        }
        t += LocalConstants.TIME_STEP;
    }
    return productASPRAY;
}