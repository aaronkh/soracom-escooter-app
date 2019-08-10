const SWITCH_FIRST_TIME = 'SWITCH_FIRST_TIME'
// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export function switchFirstTime(firstTime) {
	return {
        type: SWITCH_FIRST_TIME,
        value: firstTime
	}
}

export {SWITCH_FIRST_TIME}
