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

  const arrowIcon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjMwMC4yMjJweCIgaGVpZ2h0PSIzMDAuMjIxcHgiIHZpZXdCb3g9IjAgMCAzMDAuMjIyIDMwMC4yMjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMwMC4yMjIgMzAwLjIyMTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPHBhdGggZD0iTTI5OS4yMDEsOTMuMTg4Yy0xNC42ODgtMjUuNzA0LTI5Ljk4OC01MC4xODQtNDMuNDUyLTc2LjVjLTMuMDYtNi4xMi0xMi44NTItNC4yODQtMTQuNjg4LDEuODM2DQoJCWMtNy4zNDUsMjYuMzE2LTE2LjUyNCw1OC4xNC0xNS4zMDEsODUuMDY4YzAsNi4xMiw2LjczMiw3LjM0NCwxMC40MDQsNC4yODRjMC42MTIsMC42MTIsMS44MzYsMC42MTIsMy4wNjEsMC42MTINCgkJYzYuNzMxLTAuNjEyLDEzLjQ2NC0xLjgzNiwxOS41ODQtMi40NDhjMjIuMDMxLDU1LjY5MiwzOS43NzksMTUyLjM4OC00NC42NzcsMTU4LjUwOGMtOC41NjcsMC42MTItMTUuMy0xLjIyNC0yMC4xOTUtNC44OTYNCgkJYzExLjYyOC05Ljc5MiwyMS40Mi0yMi4wMzEsMjYuMzE1LTM2LjEwN2M2LjczMi0xOC4zNi02LjczMS01Ny41MjgtMzEuODI0LTQ2LjUxMmMtMjAuMTk1LDkuMTgtMjQuNDc5LDQ1Ljg5OS0yMC44MDgsNjQuMjYNCgkJYzEuMjI0LDUuNTA4LDMuMDYsMTAuNDAzLDQuODk2LDE0LjY4OGMtMS44MzcsMS4yMjUtMy4wNjEsMS44MzYtNC44OTYsMy4wNjFjLTE1LjkxMiw5LjE4LTM0Ljg4MywxMy40NjQtNTMuMjQ0LDEyLjg1Mg0KCQljLTEzLjQ2NC0wLjYxMi0yMS40Mi03Ljk1Ni0yNi4zMTYtMTcuNzQ4YzE2LjUyNC04LjU2NywyOS45ODgtMjIuMDMyLDMzLjY2LTM2LjEwN2M3LjM0NC0yOS45ODgtMzEuMjEyLTQ5LjU3Mi00Ny4xMjQtMjAuMTk2DQoJCWMtNy4zNDQsMTMuNDY0LTguNTY4LDMyLjQzNi00LjI4NCw0OC45NmMtMC42MTIsMC42MTItMS44MzYsMC42MTItMi40NDgsMS4yMjRjLTUyLjYzMiwyMS40Mi02OC41NDQtNDUuMjg4LTM4LjU1Ni03OC4zMzYNCgkJYzIuNDQ4LTMuMDYtMC42MTItNy45NTYtNC4yODQtNS41MDhjLTM2LjEwOCwyNS43MDQtMzMuMDQ4LDgwLjc4NCw4LjU2OCw5OC41MzJjMTEuMDE2LDQuODk2LDI2LjkyOCwzLjA2LDQxLjYxNi0xLjgzNg0KCQljNi43MzIsMTMuNDY0LDE3Ljc0OCwyMy44NjgsMzMuNjYsMjUuNzA0YzIzLjg2OCwzLjA2LDUxLjQwOC0zLjY3Myw3My40NC0xNy4xMzdjMTIuODUyLDEwLjQwNCwzMS4yMTIsMTIuODUzLDUwLjE4NCw4LjU2OA0KCQljODAuMTcyLTE1LjkxMiw2NS40ODQtMTEzLjgzMiw0Mi4yMjgtMTcxLjk3MmM2LjEyLTAuNjEyLDExLjYyOS0wLjYxMiwxNy43NDgtMC42MTINCgkJQzI5Ny45NzgsMTA1LjQyNywzMDIuMjYxLDk4LjA4MywyOTkuMjAxLDkzLjE4OHogTTgzLjE2NiwyNDAuMDY3Yy0wLjYxMi00LjI4My0xLjIyNC04LjU2Ny0xLjIyNC0xMi44NTINCgkJYzAtNi43MzIsMS4yMjQtMTMuNDY0LDMuMDYtMTkuNTg0YzQuMjg0LTE0LjY4OCwyOS45ODgtOS43OTIsMjIuMDMyLDkuNzkyQzEwMi4xMzgsMjI2LjYwMyw5Mi45NTgsMjM0LjU1OSw4My4xNjYsMjQwLjA2N3oNCgkJIE0xODAuNDczLDIyOS42NjRjMC04LjU2OCwzLjY3My0zOS4xNjgsMTYuNTI0LTM5Ljc4YzkuNzkyLTAuNjEyLDkuNzkyLDI2LjMxNiw5LjE4LDMwLjZjLTIuNDQ3LDExLjYyOS0xMS4wMTYsMjEuNDItMjEuNDIsMjguNzY1DQoJCUMxODEuNjk3LDI0My4xMjcsMTgwLjQ3MywyMzYuMzk1LDE4MC40NzMsMjI5LjY2NHogTTI1Mi4wNzcsNDMuNjE1YzguNTY4LDE1LjkxMiwxNy43NDgsMzEuMjEyLDI2LjkyOCw0Ni41MTINCgkJYy0xMi44NTIsMS44MzYtMjUuNzA0LDQuMjg0LTM3Ljk0Myw3LjM0NEMyNDYuNTY5LDgwLjk0NywyNDkuMDE4LDYxLjk3NSwyNTIuMDc3LDQzLjYxNXoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K"
  const [video, setVideo] = useState(null);
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
    getRadioStations(places[value]).then((fetch)=>{console.log(fetch);setIndex(0);setStations(fetch);});
    setStation(stations[stationIndex])
    setVisible(false);
  }

  return(
    <>
      <div className="video-background">
        <div className="tooltip">
          <Button type="primary" style={{"background-color": "#C9A690", "border": "0"}} icon={<MenuOutlined />} size={'large'} onClick={showDrawer} />
          <Drawer title="☂RainWalk Menu" size={"large"} placement="left" onClose={onClose} visible={visible}>
            <Divider>Select the city</Divider>
              <Select style={{ "margin-left": "30%", "margin-bottom": "10%", width: 180 }} size={ "large" } onChange={(e) => handleOnChange(e)}>
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
        {video?.link ? (<ReactPlayer url={video.link} 
                          volume={volume}
                          playing={true}
                          onReady={()=>{setMuted(0);}}
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
                                muted: muted
                              }
                            }
                          }} 
                        />
      ) : (<div className="placeholder-container"><p className="placeholder-text">Just choose the city <br />and start to experience</p><img src={arrowIcon} alt="icon" className="img-container" /></div>)}
      
      </div>
      <audio controls id={"radio"} src={station ? station.url_resolved : "http://cheetah.streemlion.com:1320/stream"} autoPlay> </audio>
    </>
  )
}

export default App;