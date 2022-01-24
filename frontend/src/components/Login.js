import { Room, Cancel } from '@material-ui/icons'
import axios from 'axios';
import React, { useRef, useState } from 'react'
import './login.css'

export const Login = ({setShowLogin, myStorage, setCurrentUser}) => {

   
    
    const [error, setError] = useState(false);
    const nameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        };

        try {
            const res = await axios.post("/api/users/login", user)
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username)
            setShowLogin(false)
            setError(false)
        } catch (err) {
            setError(true)
        }

    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room />
                UltraInstinto Viajero
            </div>
            <form onSubmit={handleSubmit} >
                <input type="text" className="data" placeholder="Usuario" ref={nameRef}/>
                <input type="password" className="data" placeholder="Clave" ref={passwordRef} />
                <button className="loginBtn">Login</button>
                {error && (
                    <span className="failure">Ohhh Lo sentimos, Algo salio mal Intentalo De nuevo</span>
                )}
            </form>
            <Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>
        </div>
    )
}