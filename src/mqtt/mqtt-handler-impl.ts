import { Store } from '@reduxjs/toolkit';
import moment from 'moment';
import { addMeasurement } from '../slices/measurementSlice';
import { Measurement, MeasurementType } from '../types';
import { Listener, MQTTHandler, MQTTOptions } from './mqtt-handler';
const mqtt = require('mqtt/dist/mqtt');

/**
 * MQTT handler implementation.
 */
export class MQTTHandlerImpl implements MQTTHandler {
	private store: Store;
	private client: any | undefined;

	private listeners: Listener[] = [];

	/**
	 * MQTT handler constructor
	 * @param store The redux store to dispatch the measurement to
	 * @param options Options to connect to the broker
	 */
	constructor(store: Store, options: MQTTOptions) {
		this.store = store;

		this.connect(options);
	}

	/**
	 * Add listeners, instanciate a client with a connection, subscribe to listeners and start listening
	 * @param options Options to connect to the broker
	 */
	private connect(options: MQTTOptions): void {
		this.addListeners();

		this.client = mqtt.connect(`ws://${options.brokerUrl}:9001`, {
			clientId: options.clientId,
			connectTimeout: 60000,
			...options.auth,
		});

		this.subscribeToListeners();

		this.listen();
	}

	/**
	 * Add listeners to the listeners array
	 */
	private addListeners(): void {
		this.listeners.push(
			...[
				{
					key: 'temperature',
					topic: 'temperature/+',
					callback: this.temperatureCallback,
				},
				{ key: 'light', topic: 'light/+', callback: this.lightCallback },
			],
		);
	}

	/**
	 * Get a listener from the listeners array
	 * @param topic The topic to get the listener for
	 * @returns The desired listener or undefined if no listener was found
	 */
	private getListener(topic: string): Listener | undefined {
		return this.listeners.find((listener) => topic.startsWith(listener.key));
	}

	/**
	 * Subscribe to the listeners
	 */
	private subscribeToListeners(): void {
		if (!this.client) return;
		this.listeners.forEach((listener) => {
			console.log('Subscribing to', listener.topic);
			this.client.subscribe(listener.topic);
		});
	}

	/**
	 * Listen to the client and dispatch the message to the correct listener
	 */
	private listen(): void {
		if (!this.client) return;

		this.client.on('message', (topic: string, buffer: any) => {
			const listener = this.getListener(topic);

			if (listener) {
				const message: string = buffer.toString();
				listener.callback(this.store, topic, message);
			}
		});
	}

	/**
	 * Callback for the temperature topic
	 * @param store The redux store to dispatch the measurement to
	 * @param topic The topic of the message
	 * @param message The message
	 */
	public temperatureCallback(
		store: Store,
		topic: string,
		message: string,
	): void {
		const measurement = {
			measurementType: MeasurementType.TEMPERATURE.toString(),
			date: moment().format('YYYY-MM-DD HH:mm:ss'),
			deviceHostname: topic.split('/')[1],
			value: message,
		} as Measurement;

		store.dispatch(addMeasurement(measurement));
	}

	/**
	 * Callback for the light topic
	 * @param store The redux store to dispatch the measurement to
	 * @param topic The topic of the message
	 * @param message The message
	 */
	public lightCallback(store: Store, topic: string, message: string): void {
		const measurement = {
			measurementType: MeasurementType.LIGHT.toString(),
			date: moment().format('YYYY-MM-DD HH:mm:ss'),
			deviceHostname: topic.split('/')[1],
			value: message,
		} as Measurement;

		store.dispatch(addMeasurement(measurement));
	}
}
