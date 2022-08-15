import { Store } from '@reduxjs/toolkit';

export type MeasurementCallback = (
	store: Store,
	topic: string,
	message: string,
) => void;

export interface Listener {
	key: string;
	topic: string;
	callback: MeasurementCallback;
}

export interface MQTTHandler {
	temperatureCallback: MeasurementCallback;
	lightCallback: MeasurementCallback;
}

export interface MQTTAuth {
	username: string;
	password: string;
}

export interface MQTTOptions {
	brokerUrl: string;
	auth: MQTTAuth;
	clientId: string;
}
