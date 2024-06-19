import express from "express";
import {S3} from "aws-sdk"

const app=express()
const s3=new S3({
    accessKeyId:"c09d11264f40db14f857b0347cec1e86",
    secretAccessKey:"7814f5561ef49ad4f430ce01084b274011a79620471d13ab199eb09e14c3eab6",
    endpoint:"https://5f91fd819c3226824f13f60d17e1f3dc.r2.cloudflarestorage.com"
})

app.get("/*",async(req,res)=>{
    const host=req.hostname;
    const id=host.split(".")[0];
    console.log(id);
   const filePath=req.path;
    const contents= await s3.getObject({
        Bucket:"gitdep",
        Key:`dist/${id}${filePath}`
    }).promise();
    
    const type=filePath.endsWith("html")?"text/html":filePath.endsWith("css")?"text/css":"application/javascript"
    res.set("Content-Type",type)
    res.send(contents.Body)
})
app.listen(3001,()=>{
    console.log("listening on port 3001")
})