/*global describe it beforeEach after */
'use strict';

let expect = require('chai').expect;
let request = require('supertest');
let fixture = require('../fixtures/users.json');

module.exports = (app, db) => {
  describe('User API', () => {
    // setup the model
    let Model = db.User;
    let user1 = new Model(fixture[0]);
    let user2 = new Model(fixture[1]);

    beforeEach((done) => {
      Model.remove()
        .then(() => { user1 = new Model(fixture[0]); })
        .then(user1.save())
        .then(() => { user2 = new Model(fixture[1]); })
        .then(user2.save)
        .then(done());
    });

    after((done) => done());

    it('should list all users', (done) => {
      request(app)
        .get('/api/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body[0].name).to.equal(user1.name);
          expect(res.body[1].name).to.equal(user2.name);
          done();
        });
    });

    it('should get a user by id', (done) => {
      request(app)
        .get('/api/users/' + user1._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body.name).to.equal(user1.name);
          done();
        });
    });

    it('should create a user', (done) => {
      let user = new Model(fixture[2]);
      request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body.name).to.equal(user.name);
          done();
        });
    });

    it('should update a user\'s name', (done) => {
      let user = { name: 'Marcus Badass Aurelius' };
      request(app)
        .put('/api/users/' + user1._id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send(user)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.body.name).to.equal(user.name);
          done();
        });
    });

    it('should delete a user', (done) => {
      request(app)
        .delete('/api/users/' + user1._id)
        .set('Accept', 'application/json')
        .expect(204)
        .end((err, res) => {
          expect(err).to.be.null;
          done();
        });
    });
  });
};
