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
            this.flowRate = flowrate_galpermin*231/60; //comes in as gallons/minute -> gal/min * 1min/60sec * 231cin/1gal
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
        console.log(`old line speed: ${GlobalParams.LINE_SPEED}\nnew line speed:${new_line_speed.value}`);
        GlobalParams.LINE_SPEED = Number(new_line_speed.value);
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
    
    //Nozzles!
    let new_nozzle_count = parameterMap.get("nozzle_count");
    let new_nozzle_spacing = parameterMap.get("nozzle_spacing:number");
    let new_nozzle_id = parameterMap.get("nozzle");
    if(typeof new_nozzle_id !== "undefined"){
        //do stuff to get the spray + twist angles of this nozzle
    }

    if(typeof new_nozzle_count !== "undefined" && typeof new_nozzle_spacing !== "undefined"){
        GlobalParams.NOZZLE_LIST = [];
        for (let i = 0; i < Number(new_nozzle_count.value); i++){
            const this_pos = 0.5 * GlobalParams.LINE_WIDTH + Number(new_nozzle_spacing.value) * (0.5 - 0.5*Number(new_nozzle_count.value) + i);
            const new_nozzle = new GlobalParams.Nozzle(100,3,5,2,this_pos);//read and replace parameters
            GlobalParams.NOZZLE_LIST.push(new_nozzle);
        }
    }
}

namespace LocalConstants{
    export const TIME_STEP = 0.0001; //second

    export const NUM_WIDTH_ELEMENTS = 20;
    export const ELEMENT_WIDTH = GlobalParams.PRODUCT_WIDTH/NUM_WIDTH_ELEMENTS;

    export const NUM_LENGTH_ELEMENTS = 20;
    export const ELEMENT_LENGTH = GlobalParams.PRODUCT_LENGTH/NUM_LENGTH_ELEMENTS;

    export const ELEMENT_AREA = ELEMENT_LENGTH*ELEMENT_WIDTH;
}

class ProductElement{
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

    //send in the spray density that this element is receiving in units of (cubic inches of spray)/((square inch of product)(second))
    //add that amount of spray to this productElement for one timestep
    addSpray(sprayDensity:number){
        this.volumeApplied += sprayDensity*LocalConstants.TIME_STEP*LocalConstants.ELEMENT_AREA;
    }

    //return how many cubic inches of spray have been applied to this product element
    getVolumeApplied() : number{
        return this.volumeApplied;
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
    let widthIndex : number = 0;

    //Based on the way we defined our coordinates, we're going to have to resort to some shenanigans to make our array look how we want.
    //x=0,y=0 is at the bottom right, so lengthIndex=0 in the array will map to the MAXIMUM x-index when instantiating the ProductElement.
    //so x-index is #lengthElements-1-lengthIndex
    while (widthIndex < LocalConstants.NUM_WIDTH_ELEMENTS){
        let lengthIndex : number = 0;
        let yIndex = LocalConstants.NUM_WIDTH_ELEMENTS - 1 - widthIndex;
        product.push([]);
        while(lengthIndex < LocalConstants.NUM_LENGTH_ELEMENTS){
            let xIndex = LocalConstants.NUM_LENGTH_ELEMENTS - 1 - lengthIndex;
            const thisElement = new ProductElement(xIndex, yIndex);
            product[widthIndex].push(thisElement);
            lengthIndex++;
        }
        widthIndex++;
    }

    return product
}

export function computeSprayPattern(parameterMap:Map<String, UtilityInterfaces.Parameter>) : ProductElement[][]{
    console.log("computing spray pattern");
    
    //update the local copies of global parameters
    updateGlobalParams(parameterMap);

    //create product array
    let productASPRAY = InitializeProductArray();

    //find array of all nozzle functions
    let nozzleFunctions : NozzleFunction[] = [];
    for(let nozzle of GlobalParams.NOZZLE_LIST){
        nozzleFunctions.push(new NozzleFunction(nozzle));
    }

    let nozzles_active : boolean = true; //once timing modes are implemented, this will not always be true;

    //find the leftmost point covered by any spray nozzle
    let minSprayedX = 0;
    for(let nozzleFunc of nozzleFunctions){
        const originToOutside = 0.5*nozzleFunc.sprayWidth * Math.cos(toRadians(nozzleFunc.parentNozzle.twistAngle));
        const thisNozzleMin = nozzleFunc.patternOriginX - originToOutside; //origin.x <= 0

        if( thisNozzleMin < minSprayedX){
            minSprayedX = thisNozzleMin;
        }
    }

    //symmetry is handy for finding the max X value sprayed
    const maxSprayedX = -1*minSprayedX;

    //calculate the distance the product will have to cover, and therefore the time range we care about simulating
    const xRange = GlobalParams.PRODUCT_LENGTH + GlobalParams.SENSOR_DISTANCE + maxSprayedX;
    const tRange = xRange / GlobalParams.LINE_SPEED;

    //begin the simulation loop!
    let t = 0;
    let anyProductInSprayZone = false;
    while(t < tRange){
        let productFrontX = t * GlobalParams.LINE_SPEED - GlobalParams.SENSOR_DISTANCE;

        //debugging statement:
        if(productFrontX > minSprayedX){
            anyProductInSprayZone = true;
        }
        if(productFrontX - GlobalParams.PRODUCT_LENGTH > maxSprayedX){
            anyProductInSprayZone = false;
        }

        //only apply spray to the product if the nozzles are active
        if(nozzles_active && anyProductInSprayZone){
            //iterate through the rows of product elements
            //checking every product element at every timestep is extremely slow! Find optimizations.
            for(let row of productASPRAY){
                for(let elem of row){
                    //apply spray from every nozzle to every element
                    for(let noz of nozzleFunctions){
                        const elemXpos = productFrontX + elem.xOffset;
                        const densityToAdd = noz.density(elemXpos, elem.yPos);
                        //console.log(`element x position: ${elemXpos}\nelement y position: ${elem.yPos}\nAdding density: ${densityToAdd}`);
                        elem.addSpray(densityToAdd);
                    }
                }
            }
        }
        t += LocalConstants.TIME_STEP;
    }
    //console.log(productASPRAY);
    return productASPRAY;
}

/*
function displaySprayPattern(){
    const productASPRAY = computeSprayPattern();

    const table = document.createElement("table");

    for(let row of productASPRAY){
        const thisRow = document.createElement("tr");
        for(let elem of row){
            const thisData = document.createElement("td");
            thisData.innerText = elem.getVolumeApplied().toFixed(4);
            thisRow.appendChild(thisData);
        }
        table.appendChild(thisRow);
    }
}

document.addEventListener("DOMContentLoaded",displaySprayPattern);
*/