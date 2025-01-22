import { NavLink, Link } from "react-router";
import { computeSprayPattern } from "./utility/SpraySimulation";

const Results = () => {
    const productAspray = computeSprayPattern();
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
  