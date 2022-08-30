export const SET_DRAWER_OPEN = 'RAINWALK/SET_DRAWER_OPEN'
export const SET_SELECTED = 'RAINWALK/SET_SELECTED'
export const SET_RADIOS = 'RAINWALK/SET_RADIOS'
export const SET_CURRENT_RADIOS = 'RAINWALK/SET_CURRENT_RADIOS'

export function updateIsDrawerOpen(data) {
    return {
        type: SET_DRAWER_OPEN,
        payload: {
            isDrawerOpen: data
        }
    }
}

export function updateIsDrawerOpenReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_DRAWER_OPEN:
            return payload.isDrawerOpen
        default:
            return state
    }
}

export function updateSelected(data) {
    return {
        type: SET_SELECTED,
        payload: {
            selectedIndex: data
        }
    }
}

export function updateSelectedReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_SELECTED:
            return payload.selectedIndex
        default:
            return state
    }
}

export function updateRadios(data) {
    return {
        type: SET_RADIOS,
        payload: {
            radioChannels: data
        }
    }
}

export function updateRadiosReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_RADIOS:
            return payload.radioChannels
        default:
            return state
    }
}

export function updateCurrentRadio(data) {
    return {
        type: SET_CURRENT_RADIOS,
        payload: {
            currentRadio: data
        }
    }
}

export function updateCurrentRadioReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_CURRENT_RADIOS:
            return payload.currentRadio
        default:
            return state
    }
}


export function updateRadioRef(data) {
    return {
        type: SET_CURRENT_RADIOS,
        payload: {
            currentRadio: data
        }
    }
}

export function updateRadioRefReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_CURRENT_RADIOS:
            return payload.currentRadio
        default:
            return state
    }
}
