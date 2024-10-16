import { querySnapshot, collection, doc, getDoc, onSnapshot, query, where, updateDoc, setDoc } from "firebase/firestore";
import { cloneElement, useEffect, useState } from "react";
import { auth, db } from "../FireBaseConfigure";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const styles = {
    container: {
        backgroundColor: '#EAEAEA',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        fontSize: '1.2rem'
    },
    lista: {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    opciones: {
        border: 'none',
        padding: '5px',
        width: '20rem'
    },
    button: {
        margin: '10px 0px'
    }
}

const Game = () => {
    const {roomCode} = useParams()
    const navigate = useNavigate()
    const [timeLeft, setTimeLeft] = useState(180)
    const [roomName, setRoomName] = useState('')
    const [ question, setQuestion ] = useState([])
    const [ preguntasId, setPreguntasId ] = useState('')
    const [ currentUser, setCurrentUser ] = useState('')
    const [selectedAnswers, setSelectedAnswers] = useState({});

    useEffect (() => {
        const fetchSalas = async () => {
            try {
                if (!currentUser) return
                const docRef = doc(db, 'usuarios', currentUser.uid)
                const docSnapshot = await getDoc(docRef)
                if(!docSnapshot.exists()){
                    return
                }
                const fecthSalasData = docSnapshot.data().salas 
                if (!fecthSalasData || Object.keys(fecthSalasData).length === 0) {
                    return;
                }

                const roomData = fecthSalasData[roomCode]
                if (roomData && roomData.respuestaCorrectas){
                    alert('Ya has participado y enviado tus respuestas... >:D')
                    navigate(`/profile`)
                }
                
            } catch (error) {
                console.error(error)
            }
        }
        fetchSalas()
    }, [currentUser, roomCode, navigate])

    useEffect(() => {
        if (!preguntasId) return 

        const docRef = query(collection(db, 'preguntas'),
                            where('testId', '==', preguntasId))
        const unSuscribe = onSnapshot(docRef, (querySnapshot) => {
            if(!querySnapshot.empty) {
                const datosPreguntas = querySnapshot.docs[0].data()
                setQuestion(datosPreguntas.preguntas)
            }
        })
    })

    useEffect(() => {
        const unSuscribe = auth.onAuthStateChanged((user) => {
            user ? setCurrentUser(user) : setCurrentUser(null)
        })

        return () => unSuscribe()
    }, [])

    useEffect(() => {
        if (!roomCode) return
        const docRef = query(collection(db, 'salas'), 
        where('codigo', '==', roomCode))
        const unSuscribe = onSnapshot(docRef, (querySnapshot) =>{
            if(!querySnapshot.empty){
                const salaData = querySnapshot.docs[0].data()
                setPreguntasId(salaData.testId)
                setRoomName(salaData.nombreSala)
            }
        })
        return () => unSuscribe() 
    }, [roomCode])



    useEffect(() => {
        if (timeLeft === 0) {
            setTimeLeft(30)
        } 

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [timeLeft])

    const handleAnswerChange = (e, index) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [index]: e.target.value, 
        }));
    };
    const enviarRespuestas = async (roomId, roomName, preguntas, selectedAnswers) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("Debes estar autenticado para enviar tus respuestas.");
                return;
            }
    
            let respuestasCorrectas = 0;
            const totalPreguntas = preguntas.length;
            
            preguntas.forEach((pregunta, index) => {
                if (selectedAnswers[index] === pregunta.correcta) {
                    respuestasCorrectas += 1;
                }
            });
    
            const puntos = respuestasCorrectas * 10;
    
            const resultado = {
                nombre: roomName,
                respuestaCorrectas: `${respuestasCorrectas}/${totalPreguntas}`,
                puntos: puntos,
            };
    
            const userDocRef = doc(db, 'usuarios', user.uid);
    
            await setDoc(userDocRef, {
                salas: {
                    [roomId]: resultado
                }
            }, { merge: true });
    
            alert(`¡Respuestas enviadas! Obtuviste ${respuestasCorrectas}/${totalPreguntas} respuestas correctas y ${puntos} puntos.`);
            navigate('/profile')
        } catch (error) {
            console.error("Error enviando respuestas: ", error);
            alert("Hubo un error al enviar tus respuestas. Inténtalo de nuevo.");
        }
    };
    return (
        <div style={styles.container}>
            <h1>Repondan el Quiz! :D</h1>
            <p>Tienes <strong>{timeLeft}</strong> segundotes!</p>
            {
                question.length > 0 && currentUser ?
                    question.map((q, index) => (
                        <li key={index}
                            style={styles.lista}>
                            <h3>
                                {q.pregunta}
                            </h3>
                            <select
                                value={selectedAnswers[index] || ''}
                                onChange={(e) => handleAnswerChange(e, index)}
                                style={styles.opciones}
                            >
                                <option value='' disabled>Selecciona una respuesta</option>
                                {
                                    q.respuestas.map((ans, index) => (
                                        <option key={index} value={ans}>
                                            {ans}
                                        </option>
                                    ))
                                }
                            </select>
                        </li>
                    ))
                : <h1>Cargando preguntas...</h1>
            }
            <button 
            onClick={()=>enviarRespuestas(roomCode, roomName, question, selectedAnswers)}
            style={styles.button}>
                Enviar respuestas
            </button>
        </div>
        
    )
}

export default Game