import React, {useState, createRef} from "react";
import ReactPlayer from 'react-player'
import { Button, Drawer, Select, Divider, Slider } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import RadioBrowser from 'radio-browser'
import places from "./places"
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './styles/App.css'
import 'antd/dist/antd.css'

const { Option } = Select

const App = () => {

  const player = createRef()
  const [video, setVideo] = useState(places[0]);
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(0);

  const [stations, setStations] = useState([]);
  const [stationIndex, setIndex] = useState(0);
  const [station, setStation] = useState(null);


  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const getRadioStations = (video) => {
    const filter = {
      limit: 20,
      codec: "mp3",
      by: "country",
      searchterm: video.country
    }
    return RadioBrowser.getStations(filter)
  }

  const handleOnChange = (value) => {
    setStation(null)
    setVideo(places[value]);
    getRadioStations(places[value]).then((fetch)=>{setIndex(0);setStations(fetch);setStation(stations[stationIndex]);});
    setVisible(false);
  }

  return(
    <>
      <div className="video-background">
        <div className="tooltip">
          <Button type="primary" style={{'backgroundColor': "#668F80", "border": "0"}} icon={<MenuOutlined />} size={'large'} onClick={showDrawer} />
          <Drawer title="☂ RainWalk Menu" size={"large"} placement="left" onClose={onClose} visible={visible}>
            <Divider>Select the city</Divider>
              <Select style={{ "marginLeft": "30%", "marginBottom": "10%", width: 180 }} defaultValue={0} size={ "large" } onChange={(e) => handleOnChange(e)}>
                {places.map((value, index) => {
                  return(<Option key={index} value={index}> {value.place} </Option>)
                })}
              </Select>
            <Divider>Change the volume</Divider>
            <Slider defaultValue={0} onChange={(value) => {setVolume(value/100)}} />
            {video !== null ?
            <>
            <Divider style={{"marginTop": "10%"}}>Radio Controls</Divider>
            <AudioPlayer
              className="radio"
              ref={player}
              src={station && station.url_resolved}
              header={station?.name || "Not Playing"}
              hasDefaultKeyBindings={false}
              showSkipControls={true}
              showJumpControls={false}
              customProgressBarSection={[]}
              customAdditionalControls={[]}
              volume={0.3}
              layout="stacked"
              onClickNext={()=>{(stationIndex !== stations.length-1 ? setIndex(stationIndex+1) : setIndex(0));setStation(stations[stationIndex]);}}
              onClickPrevious={()=>{(stationIndex !== 0 ? setIndex(stationIndex-1) : setIndex(stations.length-1));setStation(stations[stationIndex])}}
              autoPlayAfterSrcChange={true}
            />
            </> : <></>}
          </Drawer>
        </div>
        <ReactPlayer url={video.link}
                     ref={player}
                     volume={volume}
                     playing={true}
                     className='react-player'
                     config={{
                       youtube: {
                         playerVars: {
                           rel: 0,
                           controls: 0,
                           disablekb: 1,
                           modestbranding: 1,
                           showinfo: 0,
                           autohide: 1,
                           loop: 1,
                           muted: 1
                         }
                       }
                     }}
        />
      </div>
    </>
  )
}

export default App;