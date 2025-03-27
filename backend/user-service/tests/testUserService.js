import request from 'supertest';
import server from '../server.js';

describe('User Service', () => {
  const usersAndRanks = [
    { username: 'user1', email: 'user1@example.com', rank: 1 },
    { username: 'user2', email: 'user2@example.com', rank: 2 },
    { username: 'user3', email: 'user3@example.com', rank: 3 },
    { username: 'user4', email: 'user4@example.com', rank: 4 },
    { username: 'user5', email: 'user5@example.com', rank: 5 },
    { username: 'user6', email: 'user6@example.com', rank: 6 },
    { username: 'user7', email: 'user7@example.com', rank: 7 },
    { username: 'user8', email: 'user8@example.com', rank: 8 },
    { username: 'user9', email: 'user9@example.com', rank: 9 },
    { username: 'user10', email: 'user10@example.com', rank: 10 },
  ];

  beforeAll(async () => {
    await Promise.all(
      usersAndRanks.map(user =>
        request(server)
          .post('/api/user/rank')
          .send(user)
          .expect(200)
      )
    );
  });

  it('should retrieve top 10 ranked users', async () => {
    const res = await request(server).get('/api/user/top-users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const expectedUsers = usersAndRanks.map(({ username, rank }) => ({ username, rank }));
    expect(res.body.length).toBe(expectedUsers.length);

    res.body.forEach((user, index) => {
      expect(user.username).toBe(expectedUsers[index].username);
      expect(user.rank).toBe(expectedUsers[index].rank);
    });
  });

  it('should add a new user successfully', async () => {
    const res = await request(server)
      .post('/api/user/rank')
      .send({ username: 'user11', email: 'user11@example.com', rank: 11 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Rank '11' updated/added for user 'user11'");
  });

  it('should retrieve the rank for a specific user', async () => {
    const res = await request(server).get('/api/user/rank?username=user3');
    expect(res.status).toBe(200);
    expect(res.body.rank).toBe(3);
  });

  it('should update the rank for an existing user', async () => {
    const res = await request(server)
      .post('/api/user/rank')
      .send({ username: 'user3', email: 'user3@example.com', rank: 5 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Rank '5' updated/added for user 'user3'");
  });

  it('should return an error for a non-existent user when retrieving rank', async () => {
    const res = await request(server).get('/api/user/rank?username=nonExistentUser');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});

describe('User Service - Game Score', () => {
  const testUsername = 'user1';
  let currentScore = 0;
  let currentWins = 0;
  let currentLosses = 0;

  beforeEach(async () => {
    const res = await request(server).get(`/api/user/gamescore?username=${testUsername}`);
    if (res.status === 200) {
      currentScore = res.body.score || 0;
      currentWins = res.body.wins || 0;
      currentLosses = res.body.losses || 0;
    }
  });

  it('should add a win successfully', async () => {
    const newScore = currentScore + 5;
    const res = await request(server)
      .post('/api/user/gamescore')
      .send({ username: testUsername, score: newScore, isWin: true });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Game score and record updated successfully for user '${testUsername}'`);
  });

  it('should record the win in lastMatchResult', async () => {
    const res = await request(server).get(`/api/user/gamescore?username=${testUsername}`);
    expect(res.status).toBe(200);
    expect(res.body.lastMatchResult).toBe('win');
  });

  it('should add a loss successfully', async () => {
    const newScore = currentScore + 3;
    const res = await request(server)
      .post('/api/user/gamescore')
      .send({ username: testUsername, score: newScore, isWin: false });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(`Game score and record updated successfully for user '${testUsername}'`);
  });

  it('should record the loss in lastMatchResult', async () => {
    const res = await request(server).get(`/api/user/gamescore?username=${testUsername}`);
    expect(res.status).toBe(200);
    expect(res.body.lastMatchResult).toBe('loss');
  });

  it('should fail to set game score if user not found', async () => {
    const res = await request(server)
      .post('/api/user/gamescore')
      .send({
        username: 'nonexistentUser',
        score: 50,
        isWin: true
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  it('should fail to get game score if user not found', async () => {
    const res = await request(server).get('/api/user/gamescore?username=nonexistentUser');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });
});
