import { collection, getDoc, getDocs, query, snapshotEqual, where, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../FireBaseConfigure";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const styles = {
    container:{
        fontSize: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 60px)',
        backgroundColor: '#EAEAEA',
    },
    input: {
        border: 'none',
        borderRadius: '5px',
        margin: '5px 0',
        padding: '15px 25px',
    },
    button: {
        textDecoration: 'none',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#F4A261',
        padding: '15px 25px',
        borderRadius: '5px',
        margin: '10px'
    }
}
const JoinRoomPlayer = () => {
    const [errorMessage,setErrorMessage] = useState('')
    const [roomCode, setRoomCode] = useState('')
    const navigation = useNavigate()
    const joinRoomFunction = async (roomCode) => {
        try {
            const q = query(collection(db, 'salas'), 
                            where('codigo', '==', roomCode))
            const querySnapshot = await getDocs(q)
            if(!querySnapshot.empty){ 
                const user = auth.currentUser
                if (!user) return alert('Necesitas estar autenticado para unirte a la sala')
                
                const roomDoc = querySnapshot.docs[0]
                const roomDef = doc(db, 'salas', roomDoc.id)
        
                await updateDoc(roomDef, {
                    jugadores: arrayUnion({
                        id: user.uid, 
                        nombre: user.email.split('@')[0] 
                    })
                })
                alert(`Te has unido a la sala ${roomDoc.data().nombreSala}`)
                navigation(`/joinRoom/${roomCode}`)
            }else{
                setErrorMessage('No hay resultados')
            } 

        } catch (error) {
            alert('Algo malo paso en el proceso')
            console.error(`Error en el proceso ${error}`)
        }
    }

    const handleErrorMessage = () => {
        roomCode.trim() === '' 
        ? setErrorMessage('Por favor inserte el codigo.')
        : joinRoomFunction(roomCode)
    }
    return(
        <div style={styles.container}>
            <h1> Ingresar a una sala </h1>
            <label> Ingresa el codigo de la sala: </label>
            <input
                onChange={(e) => setRoomCode(e.target.value)}
                style={styles.input}       
            />
            <button
                onClick={handleErrorMessage}
                style={styles.button}
            >
                Ingresar
            </button>    
            {errorMessage !== ''
                ? (<p style={{color:'red'}}>{errorMessage}</p>)
                : null
            }
        </div>
    )
}

export default JoinRoomPlayer