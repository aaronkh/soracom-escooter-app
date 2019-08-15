const SWITCH_FIRST_TIME = 'SWITCH_FIRST_TIME'
const SWITCH_CC_TOKEN = 'SWITCH_CC_TOKEN'
// This is an action creator, it simply specifies the action.
// this is what we call to send an action.
export function switchFirstTime(firstTime) {
	return {
        type: SWITCH_FIRST_TIME,
        value: firstTime
	}
}

export function switchCCToken(val) {
        return {
                type: SWITCH_CC_TOKEN,
                value: val
        }
}

export {SWITCH_FIRST_TIME, SWITCH_CC_TOKEN}
