import MQTTClient, { Listener, MQTTOptions } from "./mqtt-client"

export const useMqttClient = (options?: MQTTOptions) => {
    const instance = MQTTClient.getInstance();

    if (options) {
        instance.init(options);
    }

    return instance;
}