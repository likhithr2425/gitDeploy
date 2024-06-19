import fs from "fs";
import path from "path";

export const getOutputFiles = (folderPath :string)=>{
    let response: string[]=[];

    const allfilesandfolders=fs.readdirSync(folderPath);
    allfilesandfolders.forEach(file=>{
        const fullpath=path.join(folderPath,file);
        if(fs.statSync(fullpath).isDirectory()){
            response=response.concat(getOutputFiles(fullpath));
        }
        else{
            response.push(fullpath);
        }
    });
    return response;
}