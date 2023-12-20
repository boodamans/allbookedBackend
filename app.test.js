const supertest = require('supertest');
const app = require('./app');

describe('Express App Tests', () => {
  it('should handle 404 errors', async () => {
    const response = await supertest(app).get('/nonexistent-route');

    expect(response.status).toBe(404);
  });

});
