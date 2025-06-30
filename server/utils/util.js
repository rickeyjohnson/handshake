const isAuthenticated = (req, res, next) => {
	if (!req.session.user) {
		return res
			.status(401)
			.json({ error: 'You must be logged in to perform this action. ' })
	}

	next()
}

const generateHandshakeCode = () => {
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	let result = ''
	const codeLength = 5

	for (let i = 0; i < codeLength; i++) {
		const randomIndex = Math.floor(Math.random() * letters.length)
		result += letters.charAt(randomIndex);
	}

	return result
}

const isExpired = (startDate, secondsToAdd) => {
	const date = new Date(startDate)
	const now = new Date()

	date.setDate(date.getSeconds() + secondsToAdd)
	
	return now > date
}

export { isAuthenticated, generateHandshakeCode, isExpired }
