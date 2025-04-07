import {UtilityInterfaces} from './utility/models'
import { Link, useLocation} from "react-router";
import { useEffect } from 'react';
import './styles/Print.css';
interface printProps{
    parameters: [Map<string, UtilityInterfaces.Parameter>, React.Dispatch<React.SetStateAction<Map<string, UtilityInterfaces.Parameter>>>]
}


export default function Print({parameters}: printProps){
    const [parameterMap] = parameters;
    const {state} = useLocation();
    const {img} = state;
    const parameterList = [];
    for(const [key, value] of parameterMap){
        parameterList.push(
            <p className="pdf-params">{key}: {value.value}</p>
        );
    }
    useEffect(() => {
        window.print();
    });
    return(
        <div>
            <Link className="back_button" to={"/results/"}>
            <button className='hide_on_print back_button'> Back </button>
            </Link>
        <div>
            <h2>Parameters</h2>
            {parameterList}
            <div className="page-break"></div>
            <h2>Results</h2>
            <img src={String(img)}></img>
        </div>      
        </div>
    );
}
