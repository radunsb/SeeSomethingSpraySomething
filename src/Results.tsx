import { Link } from "react-router";
import { computeSprayPattern } from "./utility/SpraySimulation";
import {UtilityInterfaces} from "./utility/models.ts"
import "./styles/Results.css"

interface ResultsProps{
    params: [Map<string, UtilityInterfaces.Parameter>, React.Dispatch<React.SetStateAction<Map<string, UtilityInterfaces.Parameter>>>];
}

const Results = ({params}:ResultsProps) => {
    const [parameterMap] = params;

    const productAspray = computeSprayPattern(parameterMap);

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

    return (
        <div id="results-root">
            <div id="results-container" className="centered" role="region" aria-description="A gradient representing the spray density on the product's surface" aria-label="spray pattern">
                <table>
                    <tbody>
                    {productAspray.map((row, rowIndex) => <tr key={rowIndex}>{row.map((element, eIndex) => <td className={`spray-element`} style={{backgroundColor:`rgb(${255 - (element.getElementSprayDensity()/maxSpray * 235 + 20)},${255 - (element.getElementSprayDensity()/maxSpray * 235 + 20)},255)`}} key={eIndex}>{/*element.getVolumeApplied().toFixed(4)*/}</td>)}</tr>)}
                    </tbody>
                </table>
                <div>
                    <Link to={"/"}>
                        <button> Back </button>
                    </Link>
                </div>
                <p>Max Application Rate: {maxSpray.toFixed(5)} gallons / square inch</p>
                <p>Min Application Rate: {minSpray.toFixed(5)} gallons / square inch</p>
            </div>
        </div>
    );
};
  
export default Results;
  