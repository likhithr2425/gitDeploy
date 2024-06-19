import path, { resolve } from "path";
import fs from "fs";
import {S3} from "aws-sdk";
const s3=new S3({
    accessKeyId:"c09d11264f40db14f857b0347cec1e86",
    secretAccessKey:"7814f5561ef49ad4f430ce01084b274011a79620471d13ab199eb09e14c3eab6",
    endpoint:"https://5f91fd819c3226824f13f60d17e1f3dc.r2.cloudflarestorage.com"
})
export async function downloadFolder(folderPath:string){
    console.log(folderPath);
    const allFiles=await s3.listObjectsV2({
        Bucket:"gitdep",
        Prefix:folderPath
    }).promise();

    const allPromises=allFiles.Contents?.map(async({Key})=>{
        return new Promise(async(resolve)=>{
            if(!Key){
                resolve("");
                return;
            }
            const finalOutputPath=path.join(__dirname,Key);
            const dirname=path.dirname(finalOutputPath);
            if(!fs.existsSync(dirname)){
                fs.mkdirSync(dirname,{recursive:true})
            }
            const outputStream=fs.createWriteStream(finalOutputPath);
            s3.getObject({
                Bucket:"gitdep",
                Key:Key
            }).createReadStream().pipe(outputStream).on("finish",()=>{
                resolve("");
            })
        })
    })||[]
    console.log("awating");
    await Promise.all(allPromises?.filter(x=>x!==undefined));
}

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}

const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    fileName=fileName.replace(/\\/gi,"/")
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "gitdep",
        Key: fileName,
    }).promise();
    console.log(response);
}