import calculatePercentile from './calculatePercentile.js';
import { describe, expect, it } from 'vitest';

describe('calculatePercentile', () => {
	it('should return the correct percentile for an array of port calls', () => {
		const portCalls = [
			{ duration: 10 },
			{ duration: 20 },
			{ duration: 30 },
			{ duration: 40 },
			{ duration: 50 },
		];

		expect(calculatePercentile(0.5, portCalls)).toEqual(30);
		expect(calculatePercentile(0.9, portCalls)).toEqual(50);
	});

	it('should return 0 for an empty array of port calls', () => {
		expect(calculatePercentile(0.5, [])).toBe(0);
	});

	it('should return throw for a percentile outside the range of 0 to 1', () => {
		const portCalls = [
			{ duration: 10 },
			{ duration: 20 },
			{ duration: 30 },
			{ duration: 40 },
			{ duration: 50 },
		];

		expect(() => { calculatePercentile(-1, portCalls) }).toThrow();
		expect(() => { calculatePercentile(1.2, portCalls) }).toThrow();
	});
});
