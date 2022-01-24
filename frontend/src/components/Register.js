import { Room, Cancel } from '@material-ui/icons'
import axios from 'axios';
import React, { useRef, useState } from 'react'
import './register.css'

export const Register = ({setShowRegister}) => {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async(e) =>{
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        };

        try {
            await axios.post("/api/users/register", newUser)
            setError(false)
            setSuccess(true)
        } catch (err) {
            setError(true)
        }

    }

    return (
        <div className="registerContainer">
            <div className="logo">
                <Room />
                UltraInstinto Viajero
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" className="data" placeholder="Usuario" ref={nameRef} required/>
                <input type="email" className="data" placeholder="Email" ref={emailRef} required/>
                <input type="password" className="data" placeholder="Clave" ref={passwordRef}  required/>
                <button className="registerBtn">Registrarse</button>
                {success && (
                    <span className="success">Bien hecho,Ahora puedes Iniciar Sesion</span>
                )}
                {error && (
                    <span className="failure">Ohhh Lo sentimos, Algo salio mal Intentalo De nuevo</span>
                )}
            </form>
            <Cancel className="registerCancel" onClick={()=>setShowRegister(false)}/>
        </div>
    )
}
