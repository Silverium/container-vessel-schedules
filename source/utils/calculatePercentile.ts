/**
 * Calculates the percentile for a given array of port calls using the nearest-rank method
 * as described here: https://en.wikipedia.org/wiki/Percentile#The_nearest-rank_method
 * With an ascending ordered array of portCalls by the duration in port.
 */
function calculatePercentile(
	percentile: number,
	portCalls: Partial<PortCall>[]
) {
	if (percentile < 0 || percentile > 1) {
		throw new Error("Percentile must be between 0 and 1");
	}
	if (portCalls.length === 0) {
		return 0;
	}

	return portCalls[Math.floor(portCalls.length * percentile)]?.duration || 0;
}
export default calculatePercentile;
