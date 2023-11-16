import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";

// This is a super nice feature of latest versions of TypeScript
type Percentile = `percentile${number}`;
type PercentileRecord = Record<Percentile, string>;

type PortCallStats = {
	portId: string;
	numPortCalls: number;
} & PercentileRecord;

const percentileValues = [0.05, 0.2, 0.5, 0.75, 0.9];
/**
 * Calculates the percentile for a given array of port calls using the nearest-rank method
 * as described here: https://en.wikipedia.org/wiki/Percentile#The_nearest-rank_method
 * With an ascending ordered array of portCalls by the duration in port.
 * The returned value is in hours with 2 decimal places.
 */
function calculatePercentile(percentile: number, portCalls: PortCall[]) {
	return (
		(portCalls[Math.floor(portCalls.length * percentile)]?.duration || 0) /
		1000 /
		60 /
		60
	).toFixed(2);
}
export default function App() {
	const [appState, setAppState] = useState("Retrieving data...");
	const [portCallStats, setPortCallStats] = useState<PortCallStats[]>([]);
	const portCallsByImo = React.useRef<Record<Vessel["imo"], Vessel>>({});
	const portCallsByPort = React.useRef<Record<Port["id"], PortCall[]>>({});
	useEffect(() => {
		const getVessels = async () => {
			const vesselsData = (await fetch(
				"https://import-coding-challenge-api.portchain.com/api/v2/vessels"
			).then((response) => response.json())) as Vessel[];
			const promises = vesselsData.map((vessel) => {
				const vesselData = fetch(
					`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${vessel.imo}`
				).then((response) => response.json());
				return vesselData as Promise<Schedule>;
			});
			const vesselsWithPortCalls = await Promise.all(promises);
			setAppState("Data retrieved!");
			// create a helper object to store the port calls for each vessel
			vesselsWithPortCalls.forEach((schedule) => {
				portCallsByImo.current[schedule.vessel.imo] = schedule.vessel;
				schedule.portCalls.forEach((portCall) => {
					if (!portCallsByPort.current[portCall.port.id]) {
						portCallsByPort.current[portCall.port.id] = [];
					}
					if (!portCall.isOmitted) {
						// extend the port call with the duration in port
						portCall.duration =
							new Date(portCall.departure).getTime() -
							new Date(portCall.arrival).getTime();
						portCallsByPort.current[portCall.port.id]!.push(portCall);
					}
				});
			});

			setAppState("Data processed!");
			const portCallsByPortArray = Object.entries(portCallsByPort.current)
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

			setPortCallStats(portCallsByPortArray);
		};
		getVessels();
	}, []);
	return (
		<Box flexDirection="column">
			<Text color="cyanBright">{appState}</Text>
			<Text>Total ports: {portCallStats.length}</Text>
			<Box gap={5}>
				<Box flexDirection="column" gap={2} borderStyle="single">
					<Box borderStyle="doubleSingle">
						<Text color="green">Top 5 ports with most port calls:</Text>
					</Box>

					{portCallStats.slice(0, 5).map((vessel: any, index: number) => {
						return (
							<Box
								flexDirection="row"
								key={`port-${vessel.portId}-${index}`}
								gap={1}
							>
								<Text color="green">{vessel.portId}:</Text>
								<Text color="magenta">{vessel.numPortCalls}</Text>
							</Box>
						);
					})}
				</Box>
				<Box flexDirection="column" gap={2} borderStyle="single">
					<Box borderStyle="doubleSingle">
						<Text color="gray">Bottom 5 ports with fewest port calls:</Text>
					</Box>
					{portCallStats.slice(-5).map((vessel: any, index: number) => {
						return (
							<Box
								flexDirection="row"
								key={`port-${vessel.portId}-${index}`}
								gap={1}
							>
								<Text color="green">{vessel.portId}:</Text>
								<Text color="magenta">{vessel.numPortCalls}</Text>
							</Box>
						);
					})}
				</Box>
			</Box>
			<Box flexDirection="column">
				<Box
					flexDirection="column"
					borderStyle="doubleSingle"
					alignItems="center"
				>
					<Text color="yellow">Duration of percentiles for each port</Text>
				</Box>
				<Box flexDirection="column" borderStyle="classic" paddingX={2}>
					<Box
						flexDirection="row"
						borderStyle="doubleSingle"
						borderRight={false}
						borderLeft={false}
						justifyContent="space-between"
					>
						<Text color="cyanBright">Port</Text>
						{percentileValues.map((percentile) => {
							return (
								<Text color="cyanBright" key={`percentile-${percentile}`}>
									{percentile * 100}%
								</Text>
							);
						})}
					</Box>
					{portCallStats.map((vessel, index: number) => {
						return (
							<Box
								flexDirection="row"
								key={`port-${vessel.portId}-${index}`}
								justifyContent="space-between"
							>
								<Text color="green">{vessel.portId}</Text>
								{percentileValues.map((percentile) => {
									return (
										<Text
											color="magenta"
											key={`percentile-${percentile}-${index}`}
										>
											{
												vessel[
												`percentile${percentile * 100
												}` as `percentile${number}`
												]
											}
											h
										</Text>
									);
								})}
							</Box>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
}
