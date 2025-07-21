import { isAuthenticated } from '../util'
describe('isAuthenticated', () => {
	it('should return 401 if not authenticated', async () => {
		const req = { session: {} }
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		}
		await isAuthenticated(req, res)
		expect(res.status).toHaveBeenCalledTimes(1)
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledTimes(1)
		expect(res.json).toHaveBeenCalledWith({
			error: 'You must be logged in to perform this action. ',
		})
	})
	it('should call next function if authenticated', async () => {
		const req = { session: { user: {} } }
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		}
		const next = jest.fn()
		await isAuthenticated(req, res, next)
		expect(next).toHaveBeenCalledTimes(1)
	})
})
