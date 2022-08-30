export const SET_LOCATIONS = 'RAINWALK/SET_LOCATIONS'

export function updateLocations(data) {
    return {
        type: SET_LOCATIONS,
        payload: {
            locations: data
        }
    }
}

export function updateLocationsReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_LOCATIONS:
            return payload.locations
        default:
            return state
    }
}
