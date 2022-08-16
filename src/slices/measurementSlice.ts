import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Measurement, MeasurementType } from '../types';

interface MeasurementState {
	values: Measurement[];
}

const initialState: MeasurementState = {
	values: [],
};

export const measurementSlice = createSlice({
	name: 'measurements',
	initialState,
	reducers: {
		addMeasurement: (state, action: PayloadAction<Measurement>) => {
			state.values.push(action.payload);
		},
	},
});

export const { addMeasurement } = measurementSlice.actions;

export const measurementsSelector =
	(measurementType: MeasurementType, deviceHostname: string) =>
	(state: RootState) => {
		return state.measurements.values
			.filter(
				(measurement) =>
					measurement.measurementType === measurementType.toString(),
			)
			.filter((measurement) => measurement.deviceHostname === deviceHostname);
	};

export default measurementSlice.reducer;
