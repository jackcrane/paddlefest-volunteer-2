module.exports = {
	preset: 'ts-jest',
	transform: {
		'^.+\\.(js|jsx)$': 'babel-jest',
	},
	moduleNameMapper: {
		'^#util(.*)$': '<rootDir>/util$1',
	},
};
