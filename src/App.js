import React, {useState, useEffect} from "react";
import ReactPlayer from 'react-player'
import places from "./places";
import './styles/App.css';
import 'antd/dist/antd.css';
import { Button, Drawer, Select, Divider, Slider, Space } from 'antd';
import { MenuOutlined, BackwardOutlined, ForwardOutlined } from '@ant-design/icons';
import RadioBrowser from 'radio-browser'

const { Option } = Select

const App = () => {

  const [video, setVideo] = useState(places[0]);
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(1);

  const [stations, setStations] = useState([]);
  const [stationIndex, setIndex] = useState(0);
  const [station, setStation] = useState(null);

  const [volumeRadio, setVolumeRadio] = useState(0);

  useEffect(() => {
    getRadioStations(places[0]).then((fetched)=>{
      setStations(fetched);
      setIndex(0)
      setStation(fetched[0])
      document.getElementById('radio').volume = 0
    })
  }, [])

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const getRadioStations = (video) => {
    const filter = {
      limit: 10,
      codec: "mp3",
      by: "country",
      searchterm: video.country
    }
    return RadioBrowser.getStations(filter)
  }

  const handleOnChange = (value) => {
    console.log(value)
    console.log(value);
    setVideo(places[value]);
    getRadioStations(places[value]).then((fetch)=>{console.log(fetch);setIndex(0);setStations(fetch);setStation(stations[stationIndex])});
    setVisible(false);
  }

  return(
    <>
      <div className="video-background">
        <div className="tooltip">
          <Button type="primary" style={{"background-color": "#C9A690", "border": "0"}} icon={<MenuOutlined />} size={'large'} onClick={showDrawer} />
          <Drawer title="☂RainWalk Menu" size={"large"} placement="right" onClose={onClose} visible={visible}>
            <Divider>Select the city</Divider>
              <Select defaultValue={video.place} style={{ "margin-left": "30%", "margin-bottom": "10%", width: 180 }} size={ "large" } onChange={(e) => handleOnChange(e)}>
                {places.map((value, index) => {
                  return(<Option key={index} value={index}> {value.place} </Option>)
                })}
              </Select>
            <Divider>Change the volume</Divider>
            <Slider defaultValue={50} onChange={(value) => {setVolume(value/100)}} />
            <Divider style={{"marginTop": "10%"}}>Radio Controls</Divider>
              <div style={{"display": "flex", "justifyContent": "center", "width": "100%"}}>
                <Space size={100} >
                  <BackwardOutlined style={{"fontSize": "40px"}} onClick={()=>{setIndex(stationIndex === 0 ? (0) : (stationIndex-1)); setStation(stations[stationIndex]); document.getElementById('radio').play();}} />
                  <label>{station && (station.name)}</label>
                  <ForwardOutlined style={{"fontSize": "40px"}} onClick={()=>{setIndex(stationIndex === stations.length ? (stations.length) : (stationIndex+1)); setStation(stations[stationIndex]); document.getElementById('radio').play();}} />
                </Space>
              </div>
              <Slider defaultValue={0} onChange={(value) => {setVolumeRadio(value/100); document.getElementById('radio').volume=volumeRadio}} />
          </Drawer>
        </div>
      <ReactPlayer url={video.link} 
      volume={volume}
      playing={true}
      onReady={()=>{setMuted(0)}}
      className='react-player'
      config={{
        youtube: {
          playerVars: {
            rel: 0,
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            showinfo: 0,
            autohide: 1,
            loop: 1,
            muted: muted
          }
        }
      }} 
      />
      </div>
      <audio controls id={"radio"} src={station ? station.url_resolved : "http://cheetah.streemlion.com:1320/stream"} autoPlay> </audio>
    </>
  )
}

export default App;