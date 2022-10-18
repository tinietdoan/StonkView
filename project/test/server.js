// Imports the server.js file to be tested.
let server = require("../server");
//Assertion (Test Driven Development) and Should, Expect(Behaviour driven development) library
let chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { expect } = chai;
var assert = chai.assert;

describe("Server!", () => {

    // Sample test case given to test / endpoint. 
    it("Home page loading", done => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it("News page loading", done => {
        chai
          .request(server)
          .get("/news")
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
    });
    it("Network page loading", done => {
        chai
          .request(server)
          .get("/network")
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
    });
    it("Charts page loading", done => {
        chai
          .request(server)
          .get("/charts")
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
    });
    it("Messaging page loading", done => {
        chai
          .request(server)
          .get("/messaging")
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
    });
});