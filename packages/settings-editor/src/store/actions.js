import {
	DISABLE_PROGRESS_BAR,
	DISABLE_WHEEL_SWIPING,
	SETUP_STORE,
} from './constants';
export const setUpStore = ( initialPayload ) => {
	return {
		type: SETUP_STORE,
		initialPayload,
	};
};
export const disableProgressBar = ( flag ) => {
	return {
		type: DISABLE_PROGRESS_BAR,
		flag,
	};
};
export const disableWheelSwiping = ( flag ) => {
	return {
		type: DISABLE_WHEEL_SWIPING,
		flag,
	};
};
