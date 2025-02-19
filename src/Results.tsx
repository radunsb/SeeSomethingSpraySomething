import { Link } from "react-router";
import { computeSprayPattern } from "./utility/SpraySimulation";
import {UtilityInterfaces} from "./utility/models.ts"
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { createProjectMap } from "./utility/ProjectUtilities.ts";
import "./styles/Results.css"

interface ResultsProps{
    params: Map<string, UtilityInterfaces.Parameter>;
}

const Results = ({params}:ResultsProps) => {
    const [parameterMap, setParameterMap] = useState(params);
    const { pid } = useParams();
    useEffect(() => {
    async function loadMap(){
      const loadedMap = await createProjectMap(1, Number(pid));
      setParameterMap(loadedMap);
    }
    loadMap();
  }, [pid])

    const productAspray = computeSprayPattern(parameterMap);

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
        <div id="results-container" className="centered" role="region" aria-description="A gradient representing the spray density on the product's surface" aria-label="spray pattern">
            <table>
                <tbody>
                {productAspray.map((row, rowIndex) => <tr key={rowIndex}>{row.map((element, eIndex) => <td className={`spray-element spray-gradient-${Math.floor(element.getVolumeApplied() / gradInterval)}`} key={eIndex}>{/*element.getVolumeApplied().toFixed(4)*/}</td>)}</tr>)}
                </tbody>
            </table>
            <div>
                <Link to={"/"+pid}>
                    <button> Back </button>
                </Link>
            </div>
        </div>
    );
};
  
export default Results;
  