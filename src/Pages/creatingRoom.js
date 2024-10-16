import { auth, db } from '../FireBaseConfigure'
import { collection, addDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const createRoom = async (userId, roomName, testId, nameOwner, navigate) => {
    const roomCode = uuidv4().slice(0,6).toUpperCase()

    try {
        const docRef = await addDoc(collection(db, 'salas'), {
            ownerId: userId,
            codigo: roomCode,
            nombreSala: roomName,
            jugadores: [{id: userId, nombre: nameOwner }],
            estado: 'esperando',
            testId: testId,
        })
        alert('Sala creada exitosamente!')
        navigate(`/joinRoom/${roomCode}`)
    } catch (error) {
        alert('Hubo un error a la hora de crear la sala!')
        console.error('No se pudo crear la sala: ', error)
    }
}

const styles = {
    contentDiv: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 60px)',
        flexDirection: 'column',
        fontSize: '1.2rem',
        backgroundColor: '#EAEAEA'
    },
    inputs: {
        border: '1px solid black',
        padding: '5px 10px',
        borderRadius: '5px',
        margin: '5px'
    },
    buttons: {
        margin: '5px',
        border: 'none',
        padding: '5px 10px',
        backgroundColor: '#F4A261',
        color: '#fff',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    buttonDisabled: {
        margin: '5px',
        border: 'none',
        padding: '5px 10px',
        backgroundColor: '#AAA661',
        color: '#fff',
        borderRadius: '5px',
        cursor: 'pointer'
    }
}

const CreatingRoom = () => {
    const [roomName, setRoomName] = useState('')
    const [testId, setTestId] = useState('')
    const [userId, setUserId] = useState(null)
    const [userNameOwner, setUserNameOwner] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const unSuscribe = auth.onAuthStateChanged((user) => {
            user ? setUserId(user.uid) : setUserId(null)
            user ? setUserNameOwner(user.email.split('@')[0]) : setUserNameOwner(null)
        });
        return () => unSuscribe()
    }, []);

    const handleSubmitCreateRoom = () => {
        createRoom(userId, roomName, testId, userNameOwner, navigate)
    }

    return(
        <div style={styles.contentDiv}>
            <h1>Crear sala</h1>
            <input
                style={styles.inputs}
                placeholder='Nombre de la sala'
                type='text'
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <input
                style={styles.inputs}
                placeholder='Preguntas ID'
                type='text'
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
            />
            {userId ? (
            <button
                style={styles.buttons}
                onClick={handleSubmitCreateRoom}
            >
                Crear
            </button>
            ) : (
                <button
                style={styles.buttonDisabled}
            >
                Crear
            </button>
            )
            }
        </div>
    )
}

export default CreatingRoom