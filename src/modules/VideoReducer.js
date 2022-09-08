export const SET_VOLUME = 'RAINWALK/SET_VOLUME'
export const SET_SELECTED_RADIO = 'RAINWALK/SET_SELECTED_RADIO'

export function updateVolume(data) {
    return {
        type: SET_VOLUME,
        payload: {
            volume: data
        }
    }
}

export function updateVolumeReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_VOLUME:
            return payload.volume
        default:
            return state
    }
}
