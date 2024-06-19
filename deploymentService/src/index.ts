import {createClient,commandOptions} from "redis";
import { copyFinalDist, downloadFolder } from "./aws";
import { buildProject } from "./buildProject";

const subscriber=createClient();
subscriber.connect();
const publisher=createClient();
publisher.connect()
async function main(){
    while(1){
        const response=await subscriber.blPop(
            commandOptions({isolated:true}),
            'build-queue',
            0
        );
        var res = JSON.stringify(response)
        const id=JSON.parse(res).element;
        await downloadFolder(`output/${id}`);
        console.log("download")
        await buildProject(id);
        copyFinalDist(id);
        publisher.hSet("status",id,"deployed");
    }
}
main();