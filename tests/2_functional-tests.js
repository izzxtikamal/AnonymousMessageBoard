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

  // Viewing the 10 most recent threads with 3 replies each
  describe('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function () {
    it('should return the 10 most recent threads with 3 replies each', function (done) {
      chai
        .request(server)
        .get('/api/threads/{board}') // Replace {board} with the actual board name
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array'); // Assuming the response is an array of threads
  
          // Assuming each thread has a 'replies' property that contains an array of replies
          res.body.forEach((thread) => {
            expect(thread).to.have.property('replies').that.is.an('array');
            expect(thread.replies).to.have.lengthOf(3); // Assuming each thread should have 3 replies
          });
  
          // Ensure that you're getting the 10 most recent threads
          expect(res.body).to.have.lengthOf(10);
  
          done();
        });
    });
  });
  
  // Deleting a thread with the incorrect password
  describe('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', function () {
    it('should not delete the thread and return an error', function (done) {
      // Assuming you have a thread ID and an invalid password
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
      const invalidPassword = 'incorrect_password'; // Replace with an incorrect password
  
      chai
        .request(server)
        .delete(`/api/threads/{board}/${threadId}`)
        .send({ delete_password: invalidPassword })
        .end(function (err, res) {
          expect(res).to.have.status(401); // Unauthorized status code
          expect(res.body).to.have.property('error').that.equals('Incorrect password');
  
          done();
        });
    });
  });
  
  // Deleting a thread with the correct password
  describe('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', function () {
    it('should delete the thread', function (done) {
      // Assuming you have a thread ID and a valid password
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
      const validPassword = 'correct_password'; // Replace with the correct password
  
      // Create the thread with the valid password (for testing)
      chai
        .request(server)
        .post(`/api/threads/{board}`) // Create a new thread
        .send({
          text: 'This is a test thread',
          delete_password: validPassword,
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
  
          // Now, attempt to delete the thread with the valid password
          chai
            .request(server)
            .delete(`/api/threads/{board}/${threadId}`)
            .send({ delete_password: validPassword })
            .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('message').that.equals('Thread deleted successfully');
  
              done();
            });
        });
    });
  });
  
  // Reporting a thread
  describe('Reporting a thread: PUT request to /api/threads/{board}', function () {
    it('should report the thread', function (done) {
      // Assuming you have a thread ID
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
  
      chai
        .request(server)
        .put(`/api/threads/{board}/${threadId}`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').that.equals('Thread reported');
  
          done();
        });
    });
  });
  
  // Creating a new reply
  describe('Creating a new reply: POST request to /api/replies/{board}', function () {
    it('should create a new reply', function (done) {
      // Assuming you have a thread ID and reply data
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
      const replyData = {
        text: 'This is a test reply',
        delete_password: 'reply_password', // Replace with an appropriate password
      };
  
      chai
        .request(server)
        .post(`/api/replies/{board}/${threadId}`)
        .send(replyData)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').that.equals('Reply created successfully');
          // You may also want to extract the reply ID from the response for further testing
  
          done();
        });
    });
  });
  
  // Viewing a single thread with all replies
  describe('Creating a new reply: POST request to /api/replies/{board}', function () {
    it('should create a new reply', function (done) {
      // Assuming you have a thread ID and reply data
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
      const replyData = {
        text: 'This is a test reply',
        delete_password: 'reply_password', // Replace with an appropriate password
      };
  
      chai
        .request(server)
        .post(`/api/replies/{board}/${threadId}`)
        .send(replyData)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').that.equals('Reply created successfully');
          // You may also want to extract the reply ID from the response for further testing
  
          done();
        });
    });
  });
  
  // Deleting a reply with the incorrect password
  describe('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', function () {
    it('should not delete the reply and return an error', function (done) {
      // Assuming you have a thread ID, reply ID, and an invalid password
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
      const replyId = 'your_reply_id'; // Replace with an actual reply ID
      const invalidPassword = 'incorrect_password'; // Replace with an incorrect password
  
      chai
        .request(server)
        .delete(`/api/replies/{board}/${threadId}`)
        .send({
          reply_id: replyId,
          delete_password: invalidPassword,
        })
        .end(function (err, res) {
          expect(res).to.have.status(401); // Unauthorized status code
          expect(res.body).to.have.property('error').that.equals('Incorrect password');
  
          done();
        });
    });
  });
  
  // Deleting a reply with the correct password
  describe('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', function () {
    it('should delete the reply', function (done) {
      // Assuming you have a thread ID, reply ID, and a valid password
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
      const replyId = 'your_reply_id'; // Replace with an actual reply ID
      const validPassword = 'correct_password'; // Replace with the correct password
  
      // Create a reply with the valid password (for testing)
      chai
        .request(server)
        .post(`/api/replies/{board}/${threadId}`)
        .send({
          text: 'This is a test reply',
          delete_password: validPassword,
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
  
          // Now, attempt to delete the reply with the valid password
          chai
            .request(server)
            .delete(`/api/replies/{board}/${threadId}`)
            .send({
              reply_id: replyId,
              delete_password: validPassword,
            })
            .end(function (err, res) {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('message').that.equals('Reply deleted successfully');
  
              done();
            });
        });
    });
  });
  
  // Reporting a reply
  describe('Reporting a reply: PUT request to /api/replies/{board}', function () {
    it('should report the reply', function (done) {
      // Assuming you have a thread ID and a reply ID
      const threadId = 'your_thread_id'; // Replace with an actual thread ID
      const replyId = 'your_reply_id'; // Replace with an actual reply ID
  
      chai
        .request(server)
        .put(`/api/replies/{board}/${threadId}`)
        .send({ reply_id: replyId })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').that.equals('Reply reported');
  
          done();
        });
    });
  });
  

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
