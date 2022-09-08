import { combineReducers } from "redux";
import { updateLocationsReducer } from "./LocationsReducer";
import {
  updateCurrentRadioReducer,
  updateIsDrawerOpenReducer,
  updateRadiosReducer,
  updateSelectedReducer,
} from "./DrawerReducer";
import {
  updateIsFetchingReducer,
  updateIsPlayingReducer,
} from "./IsFetchingReducer";
import { updateVolumeReducer } from "./VideoReducer";

export default combineReducers({
  locations: updateLocationsReducer,
  isDrawerOpen: updateIsDrawerOpenReducer,
  isFetching: updateIsFetchingReducer,
  isPlaying: updateIsPlayingReducer,
  selectedIndex: updateSelectedReducer,
  volume: updateVolumeReducer,
  radioChannels: updateRadiosReducer,
  currentRadio: updateCurrentRadioReducer,
});
