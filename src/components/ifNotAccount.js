import { addDoc, collection } from "firebase/firestore";
import React, {useState} from "react";
import { db, auth } from "../FireBaseConfigure";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

const styles = {
    container: {
        fontSize: '1.2rem',
        display: 'flex',
        height: 'calc(100vh - 60px)',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAEAEA',
        padding: '10px'
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
    inputs: {
        border: '1px solid black',
        padding: '5px 10px',
        borderRadius: '5px',
        margin: '5px'
    }
}




const CreateAccount = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    



    const handleSumbit = (e) => {
        e.preventDefault()
        const action = e.nativeEvent.submitter.className
        action === 'LogIn'
        ? logIn()
        : createAccountAction()
    }

    const logIn = async () =>{
        try {
            const userCredential = await 
                signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user
            const token = await user.getIdToken()
            localStorage.setItem('token', token)
            console.log(user)
            alert('Inicio de sesión exitoso!', user.uid)
            window.location.reload()
        } catch (error) {
            alert('Ocurrio un error.')
        }
    }

    const createAccountAction = async () => {
    
        try {
            const userCredential = 
                await createUserWithEmailAndPassword(
                    auth, 
                    email,
                    password
                )
            const user = userCredential.user
            const token = await user.getIdToken()
            localStorage.setItem('token', token)
            console.log(user)
            alert('Usuario creado para: ',
                user.email
            )
            window.location.reload()
        } catch (error) {
            alert('Error a la hora de crear la cuenta.')
            console.error(error)
        }
    }

    return(
        <>
            <div style={styles.container}>
                <form style={styles.container} onSubmit={handleSumbit}>
                    <h1>Crea una cuenta o inicia sesion</h1>
                    <label>
                        Correo:
                    </label>
                    <input 
                        type="text" 
                        style={styles.inputs} 
                        required
                        onChange={(e) => setEmail(e.target.value)}    
                    />
                    <label>
                        Contraseña: 
                    </label>
                    <input 
                        type="text" 
                        style={styles.inputs} 
                        required
                        onChange={(e) => setPassword(e.target.value)}    
                    />
                    <button
                        className="CreateAccount"
                        style={styles.buttons}
                        type="submit"
                    >
                        Crear cuenta
                    </button>                    
                    <button
                        className="LogIn"
                        style={styles.buttons}
                        type="submit"
                    >
                        Iniciar sesión
                    </button>
                </form>
            
            </div>
        </>
    )
}


export default CreateAccount