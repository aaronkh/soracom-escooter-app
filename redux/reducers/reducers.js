import { SWITCH_FIRST_TIME, SWITCH_CC_TOKEN } from '../actions/actions'
const initialState = {
        firstTime: false,
        ccToken: ''
}

const reducer = (state = initialState, action) => {
        switch (action.type) {
                case SWITCH_FIRST_TIME:
                        return {
                                ...state,
                                firstTime: action.value
                        }
                case SWITCH_CC_TOKEN:
                        return {
                                ...state,
                                ccToken: action.value
                        }
                default:
                        return state
        }


}

export { reducer }
