import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Measurement, MeasurementType } from '../types';

interface MeasurementState {
	[type: string]: { [device: string]: Measurement[] };
}

const initialState: MeasurementState = {};

function ensureHierarchy(
	state: Draft<MeasurementState>,
	measurementType: MeasurementType,
	deviceHostname: string,
) {
	if (!state[measurementType]) {
		state[measurementType] = {};
	}

	if (!state[measurementType][deviceHostname]) {
		state[measurementType][deviceHostname] = [];
	}
}

export const measurementSlice = createSlice({
	name: 'measurements',
	initialState,
	reducers: {
		addMeasurement: (state, action: PayloadAction<Measurement>) => {
			const { measurementType, deviceHostname } = action.payload;

			ensureHierarchy(state, measurementType, deviceHostname);

			state[measurementType] = {
				...state[measurementType],
				[deviceHostname]: [
					...(state[measurementType][deviceHostname] || []),
					...[action.payload],
				],
			};
		},
	},
});

export const { addMeasurement } = measurementSlice.actions;

export const measurementsSelector =
	(measurementType: MeasurementType, deviceHostname: string) =>
	(state: RootState) => {
		if (
			!state.measurements[measurementType] ||
			!state.measurements[measurementType][deviceHostname]
		)
			return [];
		return state.measurements[measurementType][deviceHostname];
	};

export default measurementSlice.reducer;
