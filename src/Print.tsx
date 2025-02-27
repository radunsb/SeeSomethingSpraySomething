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
            {parameterList}
        </div>
        <div>
            <img src={String(img)}></img>
        </div>      
        <div>
        <Link to={"/results/"}>
            <button> Back </button>
        </Link>
        </div>
        </div>
    );
}
