import { NavLink, Link } from "react-router";
// import displaySprayPattern from '../backend/SpraySimulation.ts'

const Results = () => {
    return (
        <div>
            <div>
                Results
                {/* {displaySprayPattern()} */}
            </div>
            <div>
                <Link to="/">
                    <button> Back </button>
                </Link>
            </div>
        </div>
    );
};
  
export default Results;
  