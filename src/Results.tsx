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
                {productAspray.map(row => <tr>{row.map(element => <td>{element.getVolumeApplied().toFixed(4)}</td>)}</tr>)}
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
  