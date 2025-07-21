import request from 'supertest';
import {app} from './index';
// Mock user data
const userId = '123';
const userName = 'John Doe';
const userEmail = 'john.doe@example.com';
// Mock session object
const mockSession = {
  user: {
    id: userId,
    name: userName,
    email: userEmail,
  },
  touch: jest.fn()
};
// Mock isAuthenticated middleware
jest.mock('./utils/util', () => ({
  isAuthenticated: (req, res, next) => {
    req.session = mockSession;
    next();
  },
}));
describe('GET /api/me', () => {
  it('should return 401 if not authenticated', async () => {
    const response = await request(app).get('/api/me');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('You must be logged in to perform this action. ');
  });
  it('should return user data if authenticated', async () => {
    const response = await request(app).get('/api/me');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User found!');
    expect(response.body.user).toEqual(mockSession.user);
  });
});