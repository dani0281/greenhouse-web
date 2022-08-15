import React from 'react';
import {
	CartesianGrid,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { useAppSelector } from './hooks';
import { MQTTHandlerImpl } from './mqtt/mqtt-handler-impl';
import { measurementsSelector } from './slices/measurementSlice';
import store from './store';
import { MeasurementType } from './types';

const MeasurementChart: React.FC<{
	measurementType: MeasurementType;
	deviceHostname: string;
}> = (p) => {
	const measurements = useAppSelector(
		measurementsSelector(p.measurementType, p.deviceHostname),
	);

	return (
		<LineChart width={500} height={300} data={measurements}>
			<CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
			<XAxis dataKey="date" angle={30} />
			<YAxis />
			<Line type="monotone" dataKey="value" stroke="#8884d8" />
			<Tooltip />
		</LineChart>
	);
};

function App() {
	new MQTTHandlerImpl(store, {
		brokerUrl: '192.168.1.2',
		clientId: 'dk25-web',
		auth: {
			username: 'dk25',
			password: 'dk25Pass',
		},
	});

	return (
		<div className="App">
			<div>
				<h3>dk25-1</h3>
				<MeasurementChart
					measurementType={MeasurementType.TEMPERATURE}
					deviceHostname="dk25-1"
				/>
				<MeasurementChart
					measurementType={MeasurementType.LIGHT}
					deviceHostname="dk25-1"
				/>
			</div>
			<div>
				<h3>dk25-2</h3>
				<MeasurementChart
					measurementType={MeasurementType.TEMPERATURE}
					deviceHostname="dk25-2"
				/>
				<MeasurementChart
					measurementType={MeasurementType.LIGHT}
					deviceHostname="dk25-2"
				/>
			</div>
		</div>
	);
}

export default App;
