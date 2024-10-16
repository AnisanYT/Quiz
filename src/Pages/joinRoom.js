import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, deleteDoc, updateDoc, deleteField, collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../FireBaseConfigure";
import ViewPlayers from "../components/viewPlayers";
const styles = {
    container: {
        backgroundColor: '#EAEAEA',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 60px)'
    },
    buttonCancel: {
        backgroundColor: '#f39e9e',
        color: 'white',
        padding: '10px 20px',
        margin: '5px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    buttonStart: {
        backgroundColor: '#89c092',
        color: 'white',
        padding: '10px 20px',
        margin: '5px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
}

const JoinRoom = () => {
    const { roomCode } = useParams()
    const navigate = useNavigate()
    const [owner, setOwner] = useState('')
    const [ userCurrent, setUserCurrent ] = useState('')
    const [ statusRoom, setStatusRoom ] = useState('')

    useEffect(() => {
        const unSuscribe = auth.onAuthStateChanged((user) => {
            user ? setUserCurrent(user.uid) : setUserCurrent(null)
        });
        return () => unSuscribe()
    }, []);

    useEffect(() => {
        if (!roomCode) return

        const roomDocRefer = query(collection(db, 'salas'), where('codigo', '==', roomCode))
        const unsuscribe = onSnapshot(roomDocRefer, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const salaData = querySnapshot.docs[0].data();
                setOwner(salaData.ownerId); 
                setStatusRoom(salaData.estado)
            } else {
                console.log('No such sala with the provided roomCode');
            }
        }, (error) => {
            console.error(`Error fecthing sala data: ${error}`)
        });
        return () => unsuscribe()
    }, [roomCode])

    const changeState = async () => {
        const roomDef = query(collection(db, 'salas'), where('codigo', '==', roomCode))
        try {
            const querySnapshot = await getDocs(roomDef)
            if(!querySnapshot.empty) {
                const roomDoc = querySnapshot.docs[0]
                const roomDef = doc(db, 'salas', roomDoc.id)
                
                await updateDoc(roomDef, {
                    estado: 'en curso'
                })
    
            }
        } catch (error) {
            alert('Ha ocurrido un error cambiando el estado de la sala')
            console.error(`Ha ocurrido un error cambiando el estado de la sala: ${error}`)
        }
    }
    const handleStartGame = () => {
        changeState()
    }

    useEffect(() => {
        if(statusRoom === 'en curso' && roomCode){
            navigate(`/game/${roomCode}`)
        }
    }, [statusRoom, roomCode, navigate])

    const handleCancelGame = async () => {
        try {
            const q = query(collection(db, 'salas'), where('codigo', '==', roomCode));
            const querySnapshot = await getDocs(q);
            if(userCurrent !== owner) 
                return alert('Para realizar esta accion debes de ser el Owner de la sala!')     

            if (!querySnapshot.empty) {
                querySnapshot.forEach(async (docSnapshot) => {  
                    await deleteDoc(doc(db, 'salas', docSnapshot.id));
                    console.log('Sala eliminada:', docSnapshot.id);
                });
                alert('Sala eliminada!')
                navigate('/')
            } 
        } catch (error) {
            alert('Ocurrio un error al intentar cancelar la partida...')
            console.error(`Error al intentar cancelar la partida: ${error}`)
        }
    }

    return(
        <div style={styles.container}>
            <h2> Codigo de la sala: </h2>
            <h1> {roomCode} </h1>
            <h2>{statusRoom}</h2>
            {
                userCurrent === owner ?
                <button style={styles.buttonStart}
                    onClick={handleStartGame}>
                    Empezar
                </button>
                : 
                <button style={styles.buttonStart}>
                    Esperando a que el anfitrion empiece el juego...
                </button>
            }
            {
                userCurrent === owner ?
                <button 
                    onClick={handleCancelGame}
                    style={styles.buttonCancel}
                >
                    Cancelar la sala
                </button>
                : null
            }
            <ViewPlayers/>
        </div>
    )
}

export default JoinRoom