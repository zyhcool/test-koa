
const http = require("http")


function ha() {
    return new Promise((resolve, reject) => {
        http.get("http://localhost:3000/test", (res) => {
            resolve(res.statusMessage)
        })
    })
}


async function en() {
    console.time("----ha");
    let res = await Promise.all([ha(), ha(), ha(), ha(), ha(), ha(), ha(), ha(), ha(), ha(), ha(), ha()]);
    console.timeEnd("----ha");
    console.log(res)
}
en()

