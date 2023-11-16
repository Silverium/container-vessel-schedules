import msToHours from "./msToHours.js";
import { describe, expect, it } from "vitest";

describe("msToHours", () => {
	it("should return 0 when input is 0", () => {
		expect(msToHours(0)).toBe(0);
	});

	it("should return 1 when input is 3600000", () => {
		expect(msToHours(3600000)).toBe(1);
	});

	it("should return 0.5 when input is 1800000", () => {
		expect(msToHours(1800000)).toBe(0.5);
	});
});
