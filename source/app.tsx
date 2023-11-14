import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';


type Vessel = {
	imo: number;
	name: string;
};
type Port = {
	id: string;
	name: string;
};

type PortCall = {
	port: Port;
	arrival: string;
	departure: string;
	duration?: number;
};

type Schedule = {
	vessel: Vessel;
	portCalls: PortCall[];
}
export default function App() {
	const [appState, setAppState] = useState("Retrieving data...");
	const [vessels, setVessels] = useState<any>([]);
	const portCallsByImo = React.useRef<Record<Vessel["imo"], Vessel>>({});
	const portCallsByPort = React.useRef<Record<Port["id"], PortCall[]>>({});
	useEffect(() => {
		const getVessels = async () => {
			const vesselsData = await fetch("https://import-coding-challenge-api.portchain.com/api/v2/vessels").then(response => response.json()) as Vessel[];
			const promises = vesselsData.map((vessel) => {
				const vesselData = fetch(`https://import-coding-challenge-api.portchain.com/api/v2/schedule/${vessel.imo}`).then(response => response.json());
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
					// extend the port call with the duration in port
					portCall.duration = new Date(portCall.departure).getTime() - new Date(portCall.arrival).getTime();
					portCallsByPort.current[portCall.port.id]!.push(portCall);
				});
			});
			setVessels(vesselsData);

			setAppState("Data processed!");
			const portCallsByPortArray = Object.entries(portCallsByPort.current).map(([portId, portCalls]) => {
				// sort the port calls by duration in port
				portCalls.sort((a, b) => a.duration! - b.duration!);
				// set the percentile50th for the port
				const percentile50th = ((portCalls[Math.floor(portCalls.length * 0.5)]?.duration || 0) / 1000 / 60 / 60).toFixed(2);
				return {
					portId,
					numPortCalls: portCalls.length,
					percentile50th
				};
			}).sort((a, b) => b.numPortCalls - a.numPortCalls);
			setVessels(portCallsByPortArray);
		}
		getVessels();
	}, []);
	return (
		<Box flexDirection='column'>
			<Text color="cyanBright">
				{appState}
			</Text>
			<Text>Total ports: {vessels.length}</Text>
			<Box gap={5}>
				<Box flexDirection='column' gap={2} borderStyle="single">
					<Box borderStyle="doubleSingle">
						<Text color="green">
							Top 5 ports with most port calls:
						</Text>
					</Box>

					{vessels.slice(0, 5).map((vessel: any, index: number) => {
						return (
							<Box flexDirection='row' key={`port-${vessel.portId}-${index}`} gap={1}>
								<Text color="green">
									{vessel.portId}:
								</Text>
								<Text color="magenta">
									{vessel.numPortCalls}
								</Text>
								<Text color="magenta">
									50th: {vessel.percentile50th}h
								</Text>
							</Box>
						)
					})}

				</Box>
				<Box flexDirection='column' gap={2} borderStyle="single">
					<Box borderStyle="doubleSingle">
						<Text color="gray">
							Bottom 5 ports with fewest port calls:
						</Text>
					</Box>
					{vessels.slice(-5).map((vessel: any, index: number) => {
						return (
							<Box flexDirection='row' key={`port-${vessel.portId}-${index}`} gap={1}>
								<Text color="green">
									{vessel.portId}:
								</Text>
								<Text color="magenta">
									{vessel.numPortCalls}
								</Text>
							</Box>
						)
					})}
				</Box>
			</Box>
		</Box>
	);
}
