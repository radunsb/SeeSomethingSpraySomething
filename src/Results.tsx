import { Link } from "react-router";
import { computeSprayPattern } from "./utility/SpraySimulation";
import {UtilityInterfaces} from "./utility/models.ts"
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { createProjectMap } from "./utility/ProjectUtilities.ts";
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
    return (
        <div>
            <table>
                <tbody>
                {productAspray.map((row, rowIndex) => <tr key={rowIndex}>{row.map((element, eIndex) => <td key={eIndex}>{element.getVolumeApplied().toFixed(4)}</td>)}</tr>)}
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
  