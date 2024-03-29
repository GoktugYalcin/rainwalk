import ReactPlayer from "react-player";
import { fetchStations, updateIsFetching } from "../modules/IsFetchingReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCurrentRadio,
  updateRadios,
  updateSelected,
} from "../modules/DrawerReducer";

export const Video = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.locations);
  const isFetching = useSelector((state) => state.isFetching);
  const selectedIndex = useSelector((state) => state.selectedIndex);
  const volume = useSelector((state) => state.volume);
  const radioChannels = useSelector((state) => state.radioChannels);

  return (
    <div className="rainwalk-main">
      <div className="rainwalk__video">
        {isFetching && <div className="rainwalk__video-loader" />}
        <ReactPlayer
          controls={false}
          url={locations[selectedIndex].link}
          width="100%"
          height="100%"
          light={false}
          muted={false}
          volume={volume.video}
          pip={false}
          progressInterval={1000}
          playing={true}
          playbackRate={1}
          playsinline={false}
          onPlay={() => {
            dispatch(updateIsFetching(false));
          }}
          onReady={() => {
            dispatch(updateIsFetching(true));
          }}
          onEnded={() => {
            //There a need of skip mechanism.
            dispatch(updateSelected(selectedIndex + 1));
            dispatch(updateRadios([]));
            dispatch(updateCurrentRadio(null));
            fetchStations(selectedIndex, (radios) => {
              dispatch(updateRadios(radios));
              dispatch(updateCurrentRadio(0));

              console.log(radioChannels[selectedIndex]);
            });
          }}
          config={{
            youtube: {
              playerVars: {},
              embedOptions: {
                playsinline: 1,
                autoplay: 1,
                autohide: 1,
                showinfo: 0,
                cc_load_policy: 0,
                controls: 0,
                disablekb: 1,
                modestbranding: 1,
                rel: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
