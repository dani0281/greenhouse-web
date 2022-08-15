export enum MeasurementType {
	TEMPERATURE = 'temperature',
	LIGHT = 'light',
}

export interface Measurement {
	measurementType: MeasurementType;
	date: string;
	deviceHostname: string;
	value: string;
}
