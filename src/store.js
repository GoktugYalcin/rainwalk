import { applyMiddleware, createStore } from 'redux'
import reduxPromise from 'redux-promise'
import rootReducer from './modules/index'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
    locations: [
        {
            link: 'https://www.youtube.com/watch?v=VUWrTQ97804',
            label: 'Istanbul, Türkiye',
            countryCode: 'TR'
        },
        {
            link: 'https://www.youtube.com/watch?v=CZE1CzdkEJQ',
            label: 'Amsterdam, the Netherlands',
            countryCode: 'NL'
        },
        {
            link: 'https://www.youtube.com/watch?v=N787WRdI35A&t=118s',
            label: 'London, United Kingdom',
            countryCode: 'UK'
        },
        {
            link: 'https://youtu.be/PZ5SQbXBwhg?t=30',
            label: 'Vienna, Austria',
            countryCode: 'AT'
        },
        {
            link: 'https://youtu.be/a-yUAFJbQtM?t=286',
            label: 'New York, the United States',
            countryCode: 'US'
        },
        {
            link: 'https://youtu.be/UiOV3VQWVQo?t=192',
            label: 'Moscow, Russian Federation',
            countryCode: 'RU'
        },
        {
            link: 'https://www.youtube.com/watch?v=2zMXZoFg4bc',
            label: 'Oslo, Norway',
            countryCode: 'NO'
        },
        {
            link: 'https://youtu.be/LFOx-vmYrts?t=201',
            label: 'Zermatt, Switzerland',
            countryCode: 'CH'
        }
    ],
    selectedIndex: 0,
    volume: {
        radio: 1,
        video: 0
    },
    radioChannels: [],
    currentRadio: 0,
    isDrawerOpen: false,
    isFetching: false,
    isPlaying: false,
}

const composeEnhancers = composeWithDevTools({})

const middleware = applyMiddleware(reduxPromise, thunk)

export default createStore(
    rootReducer,
    initialState,
    composeEnhancers(middleware)
)