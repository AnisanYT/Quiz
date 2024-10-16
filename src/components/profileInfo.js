import React, { useState, useEffect } from "react";
import { auth, db } from "../FireBaseConfigure";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#EAEAEA',
        height: 'calc(100vh - 60px)'
    }
}

const ProfileInfo = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [salasData, setSalasData] = useState(null);  
    const [loading, setLoading] = useState(true);

    const addP = async () => {
        const preguntas = [
            {
                pregunta: "¿Cuando se la accion de reducir a los indigenas en poblados denominados 'Pueblos indigenas'?",
                respuestas: ["Entre 1520 a 1525", "Entre 1570 a 1575", "Entre 1560 a 1565", "Entre 1523 a 1528"],
                correcta: "Entre 1570 a 1575"
            },
            {
                pregunta: "En pocas palabras el 'Encomendero' tenia el deber de...",
                respuestas: ["Independizar a los indigenas...", "Comunicar al virreinato sobre las desiciones del pueblo", "Supervisar a los indígenas, cobrar tributos y evangelizarlos bajo el sistema cristiano", "Hacer justicia y hacer cumplir las leyes del Rey"],
                correcta: "Supervisar a los indígenas, cobrar tributos y evangelizarlos bajo el sistema cristiano."
            },
            {
                pregunta: "¿Quién dirigio la gran rebelion?",
                respuestas: ["Pablo presberre", "Pablo Picasso", "Fray Pablo", "Fray Antonio"],
                correcta: "Pablo presberre"
            },
            {
                pregunta: "Una de las influencias en la estructura social por la evangelizacion fue...",
                respuestas: ["Sistemas democraticos locales entre los pueblos nativos", 
                    "Expansion del uso de armas de fuego entre comunidades indigenas", 
                    "Diminucion de la poblacion", 
                    "Casamiento"],
                correcta: "Casamiento"
            },
            {
                pregunta: "Proceso en el cual se fusionan dos o mas culturas: ",
                respuestas: ["Homogenizacion cultural", "Sincretismo", "Mimetismo", "Culturismo"],
                correcta: "Sincretismo"
            },
            {
                pregunta: "Segun el poder, seleccione la jerarquia de la politica en la colonia:",
                respuestas: ["Audiencia, gobernador, virrey", "virrey, audiencia, gobernador", "virrey, gobernador, audiencia", "audiencia, virrey, gobernador"],
                correcta: "virrey, gobernador, audiencia"
            },
            {
                pregunta: "¿En que año hubo indicios de presencia misionera en Talamanca?",
                respuestas: ["1544", "1502", "1531", "1534"],
                correcta: "1544"
            },
        ];

        try {
            const docRef = await addDoc(collection(db, 'preguntas'), {
                testId: 'test123', //Por el momento se guardara asi...
                preguntas: preguntas
            });

            alert("Preguntas insertadas correctamente");
        } catch (error) {
            console.error("Error al insertar las preguntas: ", error);
        }
    }

    useEffect(() => {
        const unSuscribe = auth.onAuthStateChanged((user) => {
            user ? setUserInfo(user) : setUserInfo(null)
        });
        return () => unSuscribe()
    }, []);

    const userButtonAdmin = () => {
        if(userInfo) {
            if (userInfo.uid === 'dNdDd4NHbhd5I89EDkHkeN9URPO2'){
                return(
                    <button onClick={addP}>
                        Add
                    </button>
                )
            }
        }
        return null
    }

    useEffect(() => {
        const fetchSalasData = async () => {
            try {
                if (!userInfo) return;

                const docRef = doc(db, 'usuarios', userInfo.uid);
                const userSnapshot = await getDoc(docRef);
                
                if (!userSnapshot.exists()) {
                    setSalasData([]);
                    return;
                }

                const fetchedSalasData = userSnapshot.data().salas || {};
                setSalasData(fetchedSalasData);
            } catch (error) {
                console.error("Error obteniendo los puntajes: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalasData();
    }, [userInfo]);

    return(
        <div style={styles.container}>
            {userInfo ? (
                    <h1>Cuenta de {userInfo.email.split('@')[0]}</h1>
                )
                :( 
                    <h1>Cargando datos...</h1>
                )
            }
            <h1>Actividad:</h1>
            {loading ? (
                <h3>Cargando puntajes...</h3>
            ) : salasData && Object.keys(salasData).length > 0 ? (
                <ul>
                    {Object.entries(salasData).map(([roomId, roomData]) => (
                        <li key={roomId}>
                            <h2>{`Sala: ${roomData.nombre}`}</h2>
                            <h3>{`Puntos: ${roomData.puntos}`}</h3>
                            <h3>{`Respuestas correctas: ${roomData.respuestaCorrectas}`}</h3>
                        </li>
                    ))}
                </ul>
            ) : (
                <h3>Aún no has participado en una sala...</h3>
            )}
            {userButtonAdmin()}
            
            
        </div>
    )
}

export default ProfileInfo