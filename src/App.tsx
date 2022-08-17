import React, { useEffect, useState } from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { useAppSelector } from './hooks';
import { MQTTHandlerImpl } from './mqtt/mqtt-handler-impl';
import { measurementsSelector } from './slices/measurementSlice';
import store from './store';
import { MeasurementType } from './types';

function getRandomColor() {
	return Math.floor(Math.random() * 16777215)
		.toString(16)
		.padStart(6, '0');
}

const MeasurementChart: React.FC<{
	measurementType: MeasurementType;
	deviceHostname: string;
	domain: number[];
}> = (p) => {
	const [color, setColor] = useState<string | undefined>();

	const measurements = useAppSelector(
		measurementsSelector(p.measurementType, p.deviceHostname),
	);

	useEffect(() => {
		setColor(getRandomColor());
	}, [p]);

	return (
		<div className="relative">
			<dt>
				<p className="ml-16 text-lg leading-6 font-medium text-gray-900">
					{`${p.deviceHostname} (${p.measurementType})`}
				</p>
			</dt>
			<dd className="mt-2 text-base text-gray-500">
				<ResponsiveContainer width="100%" height={200}>
					<AreaChart data={measurements}>
						<CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
						<XAxis dataKey="date" angle={10} interval={20} fontSize={12} />
						<YAxis domain={p.domain} />
						<Area
							type="monotone"
							dataKey="value"
							stroke={(color && `#${color}`) || undefined}
							fill={(color && `#${color}`) || undefined}
						/>
						<Tooltip />
					</AreaChart>
				</ResponsiveContainer>
			</dd>
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = new MQTTHandlerImpl(store, {
	brokerUrl: '192.168.1.2',
	clientId: 'dk25-web',
	auth: {
		username: 'dk25',
		password: 'dk25Pass',
	},
});

const App: React.FC = (p) => {
	return (
		<div className="py-12 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:text-center">
					<h2 className="text-lg text-indigo-600 font-semibold">Charts</h2>
					<p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
						Greenhouse A/S live data
					</p>
					<p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
						Inspect temperatures and "light is on"-status of the greenhouses.
					</p>
				</div>

				<div className="mt-10">
					<dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
						<MeasurementChart
							measurementType={MeasurementType.TEMPERATURE}
							deviceHostname="dk25-1"
							domain={[0, 60]}
						/>
						<MeasurementChart
							measurementType={MeasurementType.LIGHT}
							deviceHostname="dk25-1"
							domain={[0, 1]}
						/>
						<MeasurementChart
							measurementType={MeasurementType.HUMIDITY}
							deviceHostname="dk25-1"
							domain={[20, 90]}
						/>
						<MeasurementChart
							measurementType={MeasurementType.TEMPERATURE}
							deviceHostname="dk25-2"
							domain={[0, 60]}
						/>
						<MeasurementChart
							measurementType={MeasurementType.LIGHT}
							deviceHostname="dk25-2"
							domain={[0, 1]}
						/>
						<MeasurementChart
							measurementType={MeasurementType.HUMIDITY}
							deviceHostname="dk25-2"
							domain={[20, 90]}
						/>
					</dl>
				</div>
			</div>
		</div>
	);
};

export default App;
