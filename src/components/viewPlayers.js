import { query, collection, where, onSnapshot } from "firebase/firestore";
import { db } from "../FireBaseConfigure";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const styles = {
    lista: {
        listStyle: 'none',
        alignItems: 'center'
    }
}
const ViewPlayers = () => {
    const { roomCode } = useParams()
    const [listPlayers, setListPlayer] = useState([])
    useEffect(() => {
        if (!roomCode) return

        const roomDocRefer = query(collection(db, 'salas'), where('codigo', '==', roomCode))
        const unsuscribe = onSnapshot(roomDocRefer, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const salaData = querySnapshot.docs[0].data();
                setListPlayer(salaData.jugadores)
            } else {
                console.log('No such sala with the provided roomCode');
            }
        }, (error) => {
            console.error(`Error fecthing sala data: ${error}`)
        });
        return () => unsuscribe()
    }, [roomCode])

    return(
        <>  
            <h3>Lista de jugadores</h3>
            <ul style={styles.lista}>
                {listPlayers.length > 0 ?
                    listPlayers.map((jugador, index) => (
                        <li key={index}>
                            {jugador.nombre}
                        </li>
                    ))
                    : <p>No hay jugadores aun</p>
                }
            </ul>
        </>
    )
}

export default ViewPlayers