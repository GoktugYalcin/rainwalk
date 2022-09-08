import { Group } from "@mantine/core";
import {
  updateCurrentRadio,
  updateRadios,
  updateSelected,
} from "../../modules/DrawerReducer";
import { RadioBrowserApi } from "radio-browser-api";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

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
                const api = new RadioBrowserApi("RainWalk");
                api
                  .searchStations({
                    countryCode: locations[index].countryCode,
                    limit: 20,
                    offset: 0,
                    tagList: ["pop", "rock"],
                    tagExact: true,
                    hideBroken: true,
                    order: "random",
                  })
                  .then((stations) => {
                    dispatch(updateRadios(stations));
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
