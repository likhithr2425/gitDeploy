import {S3} from "aws-sdk";
import fs from "fs";

const s3Bucket=new S3({
    accessKeyId:"c09d11264f40db14f857b0347cec1e86",
    secretAccessKey:"7814f5561ef49ad4f430ce01084b274011a79620471d13ab199eb09e14c3eab6",
    endpoint:"https://5f91fd819c3226824f13f60d17e1f3dc.r2.cloudflarestorage.com"
})
export const uploadFiles = async (fileName:string,localFilePath:string )=>{
    var re=/\\/gi
    fileName=fileName.replace(re,"/");
    const fileContent=fs.readFileSync(localFilePath);
    const response=await s3Bucket.upload({
        Body:fileContent,
        Bucket:"gitdep",
        Key: fileName
    }).promise();
    console.log(response);
}