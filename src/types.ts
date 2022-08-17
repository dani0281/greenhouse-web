export class MeasurementType {
	public static TEMPERATURE = new MeasurementType('temperature');
	public static LIGHT = new MeasurementType('light');
	public static HUMIDITY = new MeasurementType('humidity');

	constructor(public readonly name: string) {}

	public static values(): MeasurementType[] {
		return [
			MeasurementType.TEMPERATURE,
			MeasurementType.LIGHT,
			MeasurementType.HUMIDITY,
		];
	}

	public static get(name: string): MeasurementType | undefined {
		return MeasurementType.values().find((type) => type.name === name);
	}

	public toString(): string {
		return this.name;
	}
}

export interface Measurement {
	measurementType: string;
	date: string;
	deviceHostname: string;
	value: string;
}

export interface MeasurementCollection {
	date: string;
	deviceHostname: string;
	temperature?: string;
	light?: string;
}
