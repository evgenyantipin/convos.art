import * as actionTypes from "./actionTypes"

import fullScreenToggle from "./toggleFullScreen"

export const touchCanvas = () => ({
    type: actionTypes.TOUCH_CANVAS
})

export const releaseCanvas = () => ({
    type: actionTypes.RELEASE_CANVAS
})

export const toggleDrawer = () => ({
    type: actionTypes.TOGGLE_DRAWER
})

export const setDrawer = show => ({
    type: actionTypes.SET_DRAWER,
    show
})

export const toggleWebcam = () => ({
    type: actionTypes.TOGGLE_WEBCAM
})

export const toggleFullScreen = () => {
    fullScreenToggle()
    return { type: actionTypes.TOGGLE_FULLSCREEN }
}

export const toggleStrokeConfig = () => ({
    type: actionTypes.TOGGLE_STROKE_CONFIG
})

export const toggleFillConfig = () => ({
    type: actionTypes.TOGGLE_FILL_CONFIG
})

export const toggleParticleConfig = () => ({
    type: actionTypes.TOGGLE_PARTICLE_CONFIG
})

export const setCanvas = canvas => ({
    type: actionTypes.SET_CANVAS,
    canvas
})

export const setShapeType = shapeType => ({
    type: actionTypes.SET_SHAPE_TYPE,
    shapeType
})

export const setStrokeStyle = style => ({
    type: actionTypes.SET_STROKE_STYLE,
    style
})

export const setFillStyle = style => ({
    type: actionTypes.SET_FILL_STYLE,
    style
})

export const setFillImage = image => ({
    type: actionTypes.SET_FILL_IMAGE,
    image
})

export const setParticleColor = color => ({
    type: actionTypes.SET_PARTICLE_COLOR,
    color
})

export const toggleParticles = () => ({
    type: actionTypes.TOGGLE_PARTICLES
})

export const toggleRecording = () => ({
    type: actionTypes.TOGGLE_RECORDING
})

export const toggleFilterConfig = () => ({
    type: actionTypes.TOGGLE_FILTERCONFIG
})

export const toggleFilter = filter => ({
    type: actionTypes.TOGGLE_FILTER,
    filter
})
