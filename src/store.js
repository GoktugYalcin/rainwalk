import { applyMiddleware, createStore } from "redux";
import reduxPromise from "redux-promise";
import rootReducer from "./modules/index";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  locations: [
    {
      link: "https://www.youtube.com/watch?v=CZE1CzdkEJQ",
      label: "Amsterdam, the Netherlands",
      countryCode: "NL",
    },
    {
      link: "https://www.youtube.com/watch?v=N787WRdI35A&t=118s",
      label: "London, United Kingdom",
      countryCode: "GB",
    },
    {
      link: "https://youtu.be/PZ5SQbXBwhg?t=30",
      label: "Vienna, Austria",
      countryCode: "AT",
    },
    {
      link: "https://youtu.be/a-yUAFJbQtM?t=286",
      label: "New York, the United States",
      countryCode: "US",
    },
    {
      link: "https://youtu.be/UiOV3VQWVQo?t=192",
      label: "Moscow, Russian Federation",
      countryCode: "RU",
    },
    {
      link: "https://www.youtube.com/watch?v=2zMXZoFg4bc",
      label: "Oslo, Norway",
      countryCode: "NO",
    },
    {
      link: "https://youtu.be/LFOx-vmYrts?t=201",
      label: "Zermatt, Switzerland",
      countryCode: "CH",
    },
    {
      link: "https://youtu.be/EVgeVtSyKyg?t=8",
      label: "Paris, France",
      countryCode: "FR",
    },
    {
      link: "https://youtu.be/dGy_6qyyY7c?t=290",
      label: "Tokyo, Japan",
      countryCode: "JP",
    },
    {
      link: "https://www.youtube.com/watch?v=VUWrTQ97804",
      label: "Istanbul, Türkiye",
      countryCode: "TR",
    },
    {
      link: "https://youtu.be/JB0A8Me8EKk?t=273",
      label: "Boston, the United States",
      countryCode: "US",
    },
  ],
  selectedIndex: 0,
  volume: {
    radio: 0.3,
    video: 0,
  },
  radioChannels: [],
  currentRadio: 0,
  isDrawerOpen: false,
  isFetching: false,
  isPlaying: false,
};

const composeEnhancers = composeWithDevTools({});

const middleware = applyMiddleware(reduxPromise, thunk);

export default createStore(
  rootReducer,
  initialState,
  composeEnhancers(middleware)
);
