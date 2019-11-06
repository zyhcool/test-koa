

async function a() {
    console.log("a start")
    await b();
    console.log("a end");
}

async function b() {
    console.log("b");
}
a();
console.log("script")
Promise.resolve().then((value) => {
    console.log("then")
})

