process.env.NODE_ENV = 'test'; // Set environment to 'test'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { expect } = chai;

chai.use(chaiHttp); // Enable chai-http middleware for HTTP requests

describe('Photos API', function () {
    // Increase timeout in case of longer response times
    this.timeout(60000);

    it('should list ALL photos on / GET', async function () {
        const res = await chai.request(server).get('/'); // Send GET request to root endpoint

        // Assert that response status is 200
        expect(res).to.have.status(200);

        // Check response is HTML
        expect(res).to.be.html;

        // Check response body is an object
        expect(res.body).to.be.an('object');
    });
});
