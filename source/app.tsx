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
					portCallsByPort.current[portCall.port.id]!.push(portCall);
				});
			});
			setVessels(vesselsData);

			setAppState("Data processed!");
			const portCallsByPortArray = Object.entries(portCallsByPort.current).map(([portId, portCalls]) => {
				return {
					portId,
					numPortCalls: portCalls.length,
				};
			}).sort((a, b) => b.numPortCalls - a.numPortCalls);
			setVessels(portCallsByPortArray);
		}
		getVessels();
	}, []);
	return (
		<Box flexDirection='column'>
			<Text color="green">
				{appState}
			</Text>

			<Text>
				{JSON.stringify(vessels, null, 2)}
			</Text>
		</Box>
	);
}
