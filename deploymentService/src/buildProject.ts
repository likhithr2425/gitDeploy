import {exec,spawn} from "child_process";
import path from "path";

export async function buildProject(id:string){
    return new Promise((resolve)=>{
        const child=exec(`cd ${path.join(__dirname,`output/${id}`)} && npm install && npm run build`)
        child.stdout?.on("data",(data)=>{
            console.log("stdout:"+data);
        })
        child.stderr?.on("error",(err)=>{
            console.log("stderr:"+err);
        })
        child.on("close",(data)=>{
            resolve("")
        })
    })
}