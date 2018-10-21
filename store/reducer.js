import { combineReducers } from "redux"
import * as actionTypes from "./actionTypes"

const showGui = (state = true, action) => {
    switch (action.type) {
        case actionTypes.TOUCH_CANVAS:
            return !action.touching
        default:
            return state
    }
}

const showDrawer = (state = false, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_DRAWER:
            return action.show
        default:
            return state
    }
}

const canvas = (state = null, action) => {
    switch (action.type) {
        case actionTypes.SET_CANVAS:
            return action.canvas
        default:
            return state
    }
}

export default combineReducers({
    showGui,
    showDrawer,
    canvas
})