import fs from "fs"

function parseINIFile(data: string){
    const regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    const toReturn: Map<string, Map<string, string>> = new Map();
    toReturn.set("DEFAULT", new Map());
    const lines = data.split(/[\r\n]+/);
    let section: string = "DEFAULT";
    lines.forEach(function(line: string){
        if(regex.comment.test(line)){
            return;
        }
        else if(regex.param.test(line)){
            const match = line.match(regex.param);
            if(match){
                const param = match[1];
                const value = match[2];
                toReturn.get(section)!.set(param, value);
            }           
        }
        else if(regex.section.test(line)){
            const match = line.match(regex.section);
            if(match){
                section = match[1];
                toReturn.set(section, new Map());
            }           
        }
        else if(line.length == 0){
            section = "DEFAULT";
        }
    })
    return toReturn;
}

function getINIFile(){
    try{
        const data = fs.readFileSync('./backend/.ini', 'utf-8');
        const typescript_ini = parseINIFile(data);
        return typescript_ini;
    }
    catch(e){
        console.log(e);
    }
}

export function getFrontEndHost(){
    const frontEndInfo = getFrontEndInfo();
    if(frontEndInfo && frontEndInfo.host){
        return frontEndInfo.host;
    }
    return 'localhost';
}

export function getFrontEndPort(){
    const frontEndInfo = getFrontEndInfo();
    if(frontEndInfo && frontEndInfo.port){
        return frontEndInfo.port;
    }
    return 5000;
}

function getFrontEndInfo(){
    const typescript_ini = getINIFile();
    if(typescript_ini){
        return {"host": String(typescript_ini.get("PROD")?.get("FRONTEND_HOST")),
            "port": Number(typescript_ini.get("PROD")?.get("FRONTEND_PORT"))
        }
    }
}

export function getBackEndURL(){
    const typescript_ini = getINIFile();
    if(typescript_ini){
        const toReturn = typescript_ini.get("PROD")?.get("BACKEND_URL");
        if(toReturn){
            return toReturn;
        }
    }
    return 'http://localhost:5000'
}
