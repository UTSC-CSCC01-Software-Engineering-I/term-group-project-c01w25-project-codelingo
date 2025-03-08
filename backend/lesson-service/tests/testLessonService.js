import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

const { expect } = chai;
chai.use(chaiHttp);

describe('Lesson Service', () => {

  // Test for adding a lesson successfully
  it('should add a lesson successfully', (done) => {
    chai.request(server)
      .post('/api/lessons/add')
      .send({
        topic: 'Math',
        description: 'A basic algebra lesson',
        problemDifficulty: 5,   // Adjust based on how you want to fetch problems
        problemType: 'typeA',   // Adjust based on your problem-type logic
        problemTags: ['array', 'loop'], // Tags for problem fetching
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.text).to.equal('Lesson added successfully.');
        done();
      });
  });

  // Test for missing fields when adding a lesson
  it('should fail when required fields are missing', (done) => {
    chai.request(server)
      .post('/api/lessons/add')
      .send({
        description: 'A lesson with no topic'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.equal('Fields (topic, description) are required.');
        done();
      });
  });



  // Test for fetching lessons by topic
  it('should get lessons by topic', (done) => {
    chai.request(server)
      .get('/api/lessons/topic?topic=Math')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object'); // Assuming response is an object of lessons
        done();
      });
  });

  it('should return 404 when no lessons are found for the specified topic', (done) => {
    chai.request(server)
      .get('/api/lessons/topic?topic=NonExistentTopic') // Assuming this topic doesn't exist
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.equal('No lessons found for the specified topic.');
        done();
      });
  });

  // Test for fetching all lessons
  it('should get all lessons', (done) => {
    chai.request(server)
      .get('/api/lessons/all')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object'); // Assuming response is an object of lessons
        done();
      });
  });
});