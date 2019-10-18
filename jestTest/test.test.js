
let request = require("supertest");

request = request("http://localhost:3000");

describe("Test module", function () {
    test("createTest", function (done) {
        request
            .get("/syncEvent?eventName=createTest")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done)
    })

    test("findTest", function (done) {
        request
            .get("/syncEvent?eventName=findTest")
            .send({
                id: "5d9bfb065770a33588f1a2aa",
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done)
    })
})