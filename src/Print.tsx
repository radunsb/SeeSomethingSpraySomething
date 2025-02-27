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
        <div>
            <h2>Parameters</h2>
            {parameterList}
            <h2>Results</h2>
            <img src={String(img)}></img>
        </div>      
        <Link to={"/results/"}>
            <button> Back </button>
        </Link>
        </div>
    );
}
