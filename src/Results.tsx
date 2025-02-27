import { Link, useNavigate} from "react-router";
import { computeSprayPattern } from "./utility/SpraySimulation";
import {UtilityInterfaces} from "./utility/models.ts"
import "./styles/Results.css"
import * as htmlToImage from "html-to-image";
import { useRef } from "react";
interface ResultsProps{
    params: [Map<string, UtilityInterfaces.Parameter>, React.Dispatch<React.SetStateAction<Map<string, UtilityInterfaces.Parameter>>>];
    timingMode: string
}

const Results = ({params, timingMode}:ResultsProps) => {
    const [parameterMap] = params;

    const productAspray = computeSprayPattern(parameterMap, timingMode);

    let maxSpray = 0;
    let minSpray = Number.MAX_VALUE;

    let curRow = 0;
    for (let row of productAspray){
        let curCol = 0;
        curRow += 1;
        for(let element of row){
            const thisDensity = element.getElementSprayDensity();
            if (thisDensity > maxSpray){
                maxSpray = thisDensity;
            }
            if(thisDensity < minSpray){
                minSpray = thisDensity;
            }
            curCol += 1;
        }
    }

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
                <div id="product-image" ref={screenshotArea}>
                    {productAspray.map((col, colIndex) => 
                        <div className="spray-column" key={colIndex}>
                            {col.map((element, eIndex) => 
                                <div className={`spray-element`} style={
                                    {backgroundColor:`rgb(${255 - (element.getElementSprayDensity()/maxSpray * 235 + 20)},${255 - (element.getElementSprayDensity()/maxSpray * 235 + 20)},255)`}
                                }
                                key={eIndex}>
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
                <p>Max Application Rate: {maxSpray.toFixed(5)} gallons / square inch</p>
                <p>Min Application Rate: {minSpray.toFixed(5)} gallons / square inch</p>
            </div>
        </div>
    );
};
  
export default Results;
  