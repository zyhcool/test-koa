

 async function async1() {
    console.log("aysnc11");
    let aha = async2();
    console.log(aha)
}
 function async2(){
    return;
}
async function async() {
    console.log("aysnc");
}

async1();

/*
async11
async21
async
async22
async12
*/