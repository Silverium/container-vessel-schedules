import formatPortCallDuration from "./formatPortCallDuration.js";
import { describe, expect, it } from "vitest";

describe("formatPortCallDuration", () => {
	it("should return '0.00h' for 0ms", () => {
		expect(formatPortCallDuration(0)).toBe("0.00h");
	});

	it("should return '1.00h' for 3600000ms", () => {
		expect(formatPortCallDuration(3600000)).toBe("1.00h");
	});

	it("should return '25.00h' for 90000000ms", () => {
		expect(formatPortCallDuration(90000000)).toBe("25.00h");
	});

	it("should return '52.50h' for 189000000ms", () => {
		expect(formatPortCallDuration(189000000)).toBe("52.50h");
	});
});
