import { Group } from "@mantine/core";
import {
  updateCurrentRadio,
  updateRadios,
  updateSelected,
} from "../../modules/DrawerReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStations } from "../../modules/IsFetchingReducer";

const LocationSelector = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations);
  const isFetching = useSelector((state) => state.isFetching);
  const selectedIndex = useSelector((state) => state.selectedIndex);
  return (
    <>
      <Group position="left">
        <h3>Select the location</h3>
      </Group>
      <div
        className={
          isFetching
            ? "rainwalk__city-select-disabled"
            : "rainwalk__city-select"
        }
      >
        {locations.map((location, index) => {
          return (
            <div
              className={
                !isFetching && index === selectedIndex
                  ? "rainwalk__city-select_location-selected"
                  : "rainwalk__city-select_location"
              }
              key={index}
              onClick={() => {
                dispatch(updateSelected(index));
                dispatch(updateRadios([]));
                dispatch(updateCurrentRadio(null));
                fetchStations(selectedIndex, (radios) => {
                  console.log(radios);
                  dispatch(updateRadios(radios));
                  dispatch(updateCurrentRadio(0));
                });
              }}
            >
              {location.label}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default LocationSelector;
