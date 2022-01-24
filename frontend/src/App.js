import { useEffect, useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons'
import axios from 'axios';
import { format } from 'timeago.js'

import "./app.css";
import { Register } from './components/Register';
import { Login } from './components/Login';

function App() {

  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 2.9275,
    longitude: -75.2875,
    zoom: 11
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/api/pins");//cors problema
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleAddClick = (e) => {
    // console.log(e)
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat: lat,
      long: long,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post("/api/pins", newPin)
      setPins([...pins, res.data])
      setNewPlace(null)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }


  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/dokirlens/cktde22g1197p17mimxw63dzl"//streets   -- mapbox://styles/dokirlens/cktde01eh17xk17sevdhsj89a   // navigation
      onDblClick={handleAddClick}
      transitionDuration="500"
    >
      {pins.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <Room
              style={{
                fontSize: viewport.zoom * 2,
                color: p.username === currentUser ? "#232931" : "#FF2E63",//slateblue
                cursor: "pointer"
              }}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
            />
          </Marker>
          {p._id === currentPlaceId && (
           
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
               
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="starts">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">Created By <b>{p.username}</b></span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
           
          )}
        </>
      ))}
      {newPlace && (

        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"
          onClose={() => setNewPlace(null)}
          
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Titulo</label>
              <input
                placeholder="Ingrese un Titulo"
                onChange={(e) => setTitle(e.target.value)}
                className="data"
              />
              <label>Descripcion</label>
              <textarea
                placeholder="Descripcion del Lugar "
                onChange={(e) => setDesc(e.target.value)}
                className="data"
              />
              <label>Calificacion</label>
              <select onChange={(e) => setRating(e.target.value)} className="data">
                <option vlaue="1">1</option>
                <option vlaue="2">2</option>
                <option vlaue="3">3</option>
                <option vlaue="4">4</option>
                <option vlaue="5" selected>5</option>
              </select>
              <button className="submitButton" type="submit" >Add Pin</button>
            </form>
          </div>
        </Popup>
      )}

      {currentUser ? (<button className="button logout" onClick={handleLogout} >Cerrar Sesion</button>)
        : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>Iniciar Sesion</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Registrarse</button>
          </div>
        )
      }
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}


    </ReactMapGL>
  );
}

export default App;
//slateblue