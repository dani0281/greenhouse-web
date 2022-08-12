/* import mqtt from 'mqtt'; */
const mqtt = require('mqtt/dist/mqtt');

export interface MQTTAuth {
    username: string;
    password: string;
}

export interface MQTTOptions {
    brokerUrl: string;
    auth: MQTTAuth;
    clientId: string;
}

export interface Listener {
    key: string;
    topic: string;
    callback: (topic: string, message: string) => void;
}

export default class MQTTClient {
    private client: any | undefined;
    private listeners: Listener[] = [];

    public static instance: MQTTClient | undefined;

    constructor(options?: MQTTOptions) {
        if (options) {
            this.init(options);
        }
    }

    // SINGLETON
    public static getInstance(): MQTTClient {
        if (!MQTTClient.instance) {
            MQTTClient.instance = new MQTTClient();
        }

        return MQTTClient.instance;
    }

    public init(options: MQTTOptions): void {
        this.addListeners([
            { key: 'temperature', topic: 'temperature/+', callback: this.temperatureCallback },
            { key: 'light', topic: 'light/+', callback: this.lightCallback },
        ]);

        this.subscribeToListeners();

        this.client = mqtt.connect(`mqtt://${options.brokerUrl}:9001`, {
            clientId: options.clientId,
            connectTimeout: 60000,
            ...options.auth,
        });

        this.listen();
    }

    public subscribeToListeners(): void {
        if (!this.client) return;

        this.listeners.forEach((listener) => this.client.subscribe(listener.topic));
    }

    public listen(): void {
        if (!this.client) return;

        this.client.on('message', (topic: string, buffer: any) => {
            const listener = this.getListener(topic);

            if (listener) {
                const message: string = buffer.toString();

                listener.callback(topic, message);
            }

            this.client.end();
        });
    }

    public getListener(topic: string): Listener | undefined {
        return this.listeners.find((listener) => topic.startsWith(listener.key));
    }

    public addListeners(listeners: Listener[]): void {
        this.listeners.push(...listeners);
    }

    private temperatureCallback(topic: string, message: string): void {
        console.log(topic, message);
    }

    private lightCallback(topic: string, message: string): void {
        console.log(topic, message);
    }
}