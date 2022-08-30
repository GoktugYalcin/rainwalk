export const SET_IS_FETCHING = 'RAINWALK/SET_IS_FETCHING'
export const SET_IS_PLAYING = 'RAINWALK/SET_IS_PLAYING'

export function updateIsFetching(data) {
    return {
        type: SET_IS_FETCHING,
        payload: {
            isFetching: data
        }
    }
}

export function updateIsFetchingReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_IS_FETCHING:
            return payload.isFetching
        default:
            return state
    }
}

export function updateIsPlaying(data) {
    return {
        type: SET_IS_PLAYING,
        payload: {
            isPlaying: data
        }
    }
}

export function updateIsPlayingReducer(state = '', { type, payload }) {
    switch (type) {
        case SET_IS_PLAYING:
            return payload.isPlaying
        default:
            return state
    }
}