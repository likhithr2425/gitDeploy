const max=7;

export function generateID(){
    let id="";
    const subset="1234567890qwertyuiopasdfghjklzxcvbnm";
    for(let i=0;i<max;i++){
        id +=subset[Math.floor(Math.random()*subset.length)];
    }
    return id;
}