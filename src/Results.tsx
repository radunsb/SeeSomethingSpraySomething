import { NavLink, Link } from "react-router";
import { computeSprayPattern } from "./utility/SpraySimulation";
import {UtilityInterfaces} from "./utility/models.ts"

interface ResultsProps{
    params: Map<string, UtilityInterfaces.Parameter>;
}

const Results = ({params}:ResultsProps) => {
    const productAspray = computeSprayPattern(params);
    return (
        <div>
            <table>
                <tbody>
                {productAspray.map((row, rowIndex) => <tr key={rowIndex}>{row.map((element, eIndex) => <td key={eIndex}>{element.getVolumeApplied().toFixed(4)}</td>)}</tr>)}
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
  