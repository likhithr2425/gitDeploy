import express from "express";
import cors from "cors";
import {generateID} from "./sessionIDGenerator";
import simpleGit from "simple-git";
import path from "path";
import { getOutputFiles } from "./getFiles";
import { uploadFiles } from "./awsUpload";
import {createClient} from "redis";

const publisher=createClient();
publisher.connect();
const subscriber=createClient();
subscriber.connect();
// simple-git is an npm light weight module that use to help with git commands
//you can also create this application without using this module like spwan and other

const app=express();
//middleware
app.use(cors());
app.use(express.json());

//routes
app.post("/deploy",async (req,res)=>{
    const gitURL=req.body.gitURL;
    const id=generateID();
    await simpleGit().clone(gitURL,path.join(__dirname,`output/${id}`));
    const files=getOutputFiles(path.join(__dirname,`output/${id}`));
    files.forEach(async file=>{
        await uploadFiles(file.slice(__dirname.length+1),file);
    })
    publisher.rPush("build-queue",id);
    publisher.hSet("status",id,"uploaded")
    res.json(
        {
            "run":"successful",
            id:id
        }
    );
})
app.get("/status",async (req,res)=>{
    const id=req.query.id;
    const response=await subscriber.hGet("status",id as string)
    res.json({
        status:response
    })
})
//listening
app.listen(3000,()=>{
    console.log("listening to port 3000");
})