import { useEffect, useState } from "react";
import calculatePercentile from "../utils/calculatePercentile.js";

// This is a super nice feature of latest versions of TypeScript
type Percentile = `percentile${number}`;
type PercentileRecord = Record<Percentile, number>;

type PortCallStats = {
	portId: string;
	numPortCalls: number;
} & PercentileRecord;

const percentileValues = [0.05, 0.2, 0.5, 0.75, 0.9];

export default function usePortCallStats() {
	const [appState, setAppState] = useState("Retrieving data...");
	const [portCallStats, setPortCallStats] = useState<PortCallStats[]>([]);

	useEffect(() => {
		const portCallsByPort: Record<Port["id"], PortCall[]> = {};
		const getVessels = async () => {
			const startTime = Date.now();
			try {
				const vesselsData = (await fetch(
					"https://import-coding-challenge-api.portchain.com/api/v2/vessels"
				).then((response) => response.json())) as Vessel[];
				const promises = vesselsData.map((vessel) => {
					const vesselData = fetch(
						`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${vessel.imo}`
					).then((response) => response.json()) as Promise<Schedule>;
					return vesselData;
				});
				const vesselsWithPortCalls = await Promise.all(promises);
				const dataRetrievedTime = Date.now();
				const dataRetrievalTime = dataRetrievedTime - startTime;

				setAppState(`Data retrieved in ${dataRetrievalTime}ms!`);

				vesselsWithPortCalls.forEach((schedule) => {
					schedule.portCalls.forEach((portCall) => {
						if (!portCallsByPort[portCall.port.id]) {
							portCallsByPort[portCall.port.id] = [];
						}
						if (!portCall.isOmitted) {
							// extend the port call with the duration in port
							portCall.duration =
								new Date(portCall.departure).getTime() -
								new Date(portCall.arrival).getTime();
							portCallsByPort[portCall.port.id]!.push(portCall);
						}
					});
				});
				const _portCallStats = Object.entries(portCallsByPort)
					.map(([portId, portCalls]) => {
						// sort the port calls by duration in port
						portCalls.sort((a, b) => a.duration! - b.duration!);

						const percentileRecord: PercentileRecord = {};
						// calculate the percentiles
						percentileValues.forEach((percentile) => {
							percentileRecord[`percentile${percentile * 100}`] =
								calculatePercentile(percentile, portCalls);
						});

						return {
							portId,
							numPortCalls: portCalls.length,
							...percentileRecord,
						};
					})
					.sort((a, b) => b.numPortCalls - a.numPortCalls);

				setAppState(
					(prev) =>
						prev +
						"\n" +
						`Data digested in ${Date.now() - dataRetrievedTime}ms!`
				);
				setPortCallStats(_portCallStats);
			} catch {
				setAppState("Error retrieving data! Try again later.");
			}
		};
		getVessels();
	}, []);

	return [portCallStats, appState] as const;
}
