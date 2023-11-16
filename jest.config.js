import  {defaults} from 'jest-config';
const config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["./**/*.test.{ts,tsx}"],
	moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/source/$1",
	},
};

export default config;
