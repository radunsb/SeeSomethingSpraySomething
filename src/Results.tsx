import { Link, useNavigate} from "react-router";
import { computeSprayPattern, updateParams, getPatternDimensions } from "./utility/FullConveyorSimulation.ts";
import {UtilityInterfaces} from "./utility/models.ts"
import "./styles/Results.css"
import * as htmlToImage from "html-to-image";
import { useRef } from "react";
interface ResultsProps{
    params: [Map<string, UtilityInterfaces.Parameter>, React.Dispatch<React.SetStateAction<Map<string, UtilityInterfaces.Parameter>>>];
    timingMode: string
}

const BASE_GRANULARITY = 100;
const SCREEN_WIDTH_FRACTION = 0.7;

const Results = ({params, timingMode}:ResultsProps) => {
    const [parameterMap] = params;

    //pass the parametermap to the simulation
    updateParams(parameterMap, timingMode);

    //get the spray pattern dimensions
    const [patternLength, patternWidth] = getPatternDimensions(); 

    //assume length is greater than width
    const widthToLengthRatio = patternWidth / patternLength;
   
    //determine display dimensions
    const productImageWidth = SCREEN_WIDTH_FRACTION * window.innerWidth;
    const productImageHeight = widthToLengthRatio * productImageWidth;

    //determine granularity
    const widthElements = BASE_GRANULARITY;
    const lengthElements = widthElements * (1 / widthToLengthRatio);

    //determine the width and height of each displayed element as a percentage
    const elemHeight = 100 / widthElements;
    const elemWidth = 100 / lengthElements;

    //calculate the spray pattern
    const sprayPattern = computeSprayPattern(lengthElements, widthElements)
    const productAspray = sprayPattern.pattern;

    let maxSpray = 0;
    for (let col of productAspray){
        for(let element of col){
            const thisDensity = element.getElementSprayDensity();
            if (thisDensity > maxSpray){
                maxSpray = thisDensity;
            }
        }
    }

    //detect product edges
    for(let colI = 1; colI < productAspray.length-1; colI++ ){
        for(let rowI = 1; rowI < productAspray[colI].length; rowI++){
            for(let colOffset = -1; colOffset < 2; colOffset+=2){
                for(let rowOffset = -1; rowOffset < 2; rowOffset+=2){
                    if( productAspray[colI][rowI].isProduct && !productAspray[colI+colOffset][rowI+rowOffset].isProduct){
                        productAspray[colI+colOffset][rowI+rowOffset].isProductBorder = true;
                    }
                }
            }
        }
    }

//////////// code to export a screenshot ////////////////////////////////////////////////////////////////


    const screenshotArea = useRef(null);
    async function takeScreenshot(){
        if(!screenshotArea.current) return;
        await htmlToImage.toPng(screenshotArea.current, {quality:0.01, pixelRatio:0.5}).then(navigatePrint);
    }

    const navigate = useNavigate();
    function navigatePrint(dataURL: string){
        const img = new Image();
        img.src = dataURL;
        navigate('/print/', {state:{img:dataURL}});
    }


    return (
        <div id="results-root">
            <div id="results-container" className="centered" role="region" aria-description="A gradient representing the spray density on the product's surface" aria-label="spray pattern">
                <div id="product-image" style={{width:productImageWidth, height:productImageHeight}} ref={screenshotArea}>
                    {productAspray.map((col, colIndex) => 
                        <div className="spray-column" key={colIndex} style={{width:`${elemWidth}%`}}>
                            {col.map((element, rowIndex) => 
                                <div className='spray-element' style={
                                    {height:`${elemHeight}%`,
                                        backgroundColor:!element.isProductBorder ? 
                                            `rgb(${255 - (element.getElementSprayDensity()/maxSpray * 235 + 20)},${255 - (element.getElementSprayDensity()/maxSpray * 235 + 20)},255)`
                                            : 'rgb(0,0,0)'}
                                }
                                key={rowIndex}>
                                    {/*element.getVolumeApplied().toFixed(4)*/}
                                </div>)}
                        </div>)
                    }
                </div>
                <div>
                    <Link to={"/"}>
                        <button> Back </button>
                    </Link>
                    <button onClick={takeScreenshot}> Export as PDF/Print </button>
                </div>
            </div>
        </div>
    );
};
  
export default Results;
  