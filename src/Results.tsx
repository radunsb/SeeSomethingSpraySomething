import { NavLink, Link } from "react-router";
import { computeSprayPattern, ProductElement } from "./utility/SpraySimulation";
import {UtilityInterfaces} from "./utility/models.ts"
import "./styles/Results.css"

interface ResultsProps{
    params: Map<string, UtilityInterfaces.Parameter>;
}

const Results = ({params}:ResultsProps) => {
    const productAspray = computeSprayPattern(params);

    let maxSpray = 0;
    let maxRow = -1;
    let maxCol = -1;

    let curRow = 0;
    for (let row of productAspray){
        let curCol = 0;
        curRow += 1;
        for(let element of row){
            if (element.getVolumeApplied() > maxSpray){
                maxSpray = element.getVolumeApplied();
                maxRow = curRow;
                maxCol = curCol;
            }
            curCol += 1;
        }
    }

    const numGradientShades = 5;
    const gradInterval = maxSpray / numGradientShades;

    return (
        <div id="results-container" className="centered">
            <table>
                <tbody>
                {productAspray.map((row, rowIndex) => <tr key={rowIndex}>{row.map((element, eIndex) => <td className={`spray-element spray-gradient-${Math.floor(element.getVolumeApplied() / gradInterval)}`} key={eIndex}>{element.getVolumeApplied().toFixed(4)}</td>)}</tr>)}
                </tbody>
            </table>
            <div>
                <Link to="/">
                    <button> Back </button>
                </Link>
            </div>
        </div>
    );
};
  
export default Results;
  