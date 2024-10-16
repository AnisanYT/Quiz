import React from "react";
import Button from "./button";
import { Link } from "react-router-dom";


const MainContent = () => {

    const styles = {
        mainCon: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 60px)',
            backgroundColor: '#EAEAEA',
        },
        linkTo: {
            textDecoration: 'none',
            color: 'white',
            backgroundColor: '#F4A261',
            padding: '15px 25px',
            borderRadius: '5px',
            fontSize: '1.2rem',
            margin: '10px'
        }
    }
    const sayHi = () => {
        console.log("Hola")
    }
    return(
        <div style={styles.mainCon}>
            <Link style={styles.linkTo} to={'/creatingRoom'}>Crear sala</Link>
            <Link style={styles.linkTo} to={'/joinRoomPlayer'}>Unirse a Sala</Link>
        </div>
    )
}



export default MainContent