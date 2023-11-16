import React from "react";
import { Box, Text } from "ink";
import formatPortCallDuration from "./utils/formatPortCallDuration.js";
import usePortCallStats from "./hooks/usePortCallStats.js";

const percentileValues = [0.05, 0.2, 0.5, 0.75, 0.9];
export default function App() {
	const [portCallStats, appState] = usePortCallStats();

	return (
		<Box flexDirection="column">
			<Text color="cyanBright">{appState}</Text>
			<Text>Total ports: {portCallStats.length}</Text>
			<Box gap={5} justifyContent="space-around">
				<Box flexDirection="column" borderStyle="single">
					<Box borderStyle="doubleSingle">
						<Text color="green">Top 5 ports with most port calls:</Text>
					</Box>
					<Box flexDirection="column">
						{portCallStats.slice(0, 5).map((vessel: any, index: number) => {
							return (
								<Box
									flexDirection="row"
									key={`port-${vessel.portId}-${index}`}
									justifyContent="center"
								>
									<Text color="green">{vessel.portId}:</Text>
									<Text color="magenta">{vessel.numPortCalls}</Text>
								</Box>
							);
						})}
					</Box>

				</Box>
				<Box flexDirection="column" borderStyle="single">
					<Box borderStyle="doubleSingle">
						<Text color="gray">Bottom 5 ports with fewest port calls:</Text>
					</Box>
					<Box flexDirection="column">
						{portCallStats.slice(-5).map((vessel: any, index: number) => {
							return (
								<Box
									flexDirection="row"
									key={`port-${vessel.portId}-${index}`}
									justifyContent="center"
								>
									<Text color="green">{vessel.portId}:</Text>
									<Text color="magenta">{vessel.numPortCalls}</Text>
								</Box>
							);
						})}
					</Box>
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
											{formatPortCallDuration(
												vessel[`percentile${percentile * 100}`]
											)}
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
