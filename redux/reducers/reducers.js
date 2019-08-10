import {SWITCH_FIRST_TIME} from '../actions/actions'
const initialState = {
	firstTime: false
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
        case SWITCH_FIRST_TIME:
                return {
                    ...state,
                    firstTime: action.value
                }
		default:
			return state
	}
}

export {reducer}
