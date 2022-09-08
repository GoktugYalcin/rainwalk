import { Group } from "@mantine/core";
import AudioPlayer from "react-h5-audio-player";
import { updateCurrentRadio } from "../../modules/DrawerReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const LocationRadio = () => {
  const dispatch = useDispatch();
  const radioChannels = useSelector((state) => state.radioChannels);
  const currentRadio = useSelector((state) => state.currentRadio);
  return (
    <>
      <Group position="left" style={{ marginTop: "60px" }}>
        <h3>Also enjoy the radio!</h3>
      </Group>
      <div
        className={
          radioChannels[currentRadio]?.urlResolved
            ? "rainwalk__radio"
            : "rainwalk__radio-disabled"
        }
      >
        <AudioPlayer
          style={{ borderRadius: "1rem" }}
          autoPlay
          src={radioChannels[currentRadio]?.urlResolved}
          showSkipControls={true}
          showJumpControls={false}
          customAdditionalControls={[]}
          customControlsSection={["VOLUME_CONTROLS"]}
          customProgressBarSection={["MAIN_CONTROLS"]}
          header={
            radioChannels[currentRadio]?.name
              ? `${radioChannels[currentRadio]?.name}`
              : "Searching..."
          }
          footer={null}
          onClickPrevious={(currentTrack) => {
            if (radioChannels[currentRadio - 1]?.urlResolved) {
              dispatch(updateCurrentRadio(currentRadio - 1));
            }
          }}
          onClickNext={(currentTrack) => {
            if (radioChannels[currentRadio + 1]?.urlResolved) {
              dispatch(updateCurrentRadio(currentRadio + 1));
            }
          }}
          onEnded={(currentTrack) => {
            if (radioChannels[currentRadio + 1]?.urlResolved) {
              dispatch(updateCurrentRadio(currentRadio + 1));
            }
          }}
        />
      </div>
    </>
  );
};

export default LocationRadio;
