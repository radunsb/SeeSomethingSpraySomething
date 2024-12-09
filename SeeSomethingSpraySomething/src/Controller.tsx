/* eslint-disable @typescript-eslint/no-namespace */
import { useState, useEffect } from "react";
import axios from "axios";

namespace Controllers{
  export interface Controller{
    _id: number,
    controller_name:string,
    doc_link:string
  }
}
function Controller() {
  const [controllers, setControllers] = useState<Array<Controllers.Controller>>();
  useEffect(() => {
    axios.get("http://localhost:5000/api/v1/controllers")
      .then(response => setControllers(response.data.controllers))
      .catch(error => console.error(error));
  }, []);
  if(controllers){
    return (
      <div>
        <h1>Controllers</h1>
        <ul>
          {controllers.map(controller => (
            <li key={controller._id}>
              <h3>{controller.controller_name}</h3>
              <p>{controller.doc_link}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  else{
    return(
      <div>
        <p>No Controllers!!</p>
      </div>
    );
  }
}

export default Controller;
