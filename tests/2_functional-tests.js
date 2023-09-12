const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Import your Express server instance
const { expect } = chai;

chai.use(chaiHttp);

describe('Functional Tests', function () {
  // Create a thread for testing
  let threadId = '';

  describe('Creating a new thread: POST request to /api/threads/{board}', function () {
    it('should create a new thread', function (done) {
      chai
        .request(server)
        .post('/api/threads/{board}') // Replace {board} with the actual board name
        .send({
          text: 'This is a test thread',
          delete_password: 'password123', // Replace with an appropriate password
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').that.equals('Thread created successfully');
          // Extract the thread ID from the response for later tests
          threadId = res.body.thread_id;
          done();
        });
    });
  });

  // Add more test cases for the remaining functionalities as described in your question

  // Viewing the 10 most recent threads with 3 replies each
  // Deleting a thread with the incorrect password
  // Deleting a thread with the correct password
  // Reporting a thread
  // Creating a new reply
  // Viewing a single thread with all replies
  // Deleting a reply with the incorrect password
  // Deleting a reply with the correct password
  // Reporting a reply

  // After completing all tests, you can add a cleanup step (e.g., deleting the created thread)
  after(function (done) {
    // Delete the thread created during testing (if applicable)
    if (threadId) {
      chai
        .request(server)
        .delete(`/api/threads/{board}/${threadId}`)
        .send({ delete_password: 'password123' }) // Replace with the correct password
        .end(function (err, res) {
          done();
        });
    } else {
      done();
    }
  });
});
