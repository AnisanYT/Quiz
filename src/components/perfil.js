import React from "react";
import { Link } from "react-router-dom";

const Perfil = () => {

    
    const styles = {
        estilo: {
            backgroundColor: 'transparent',
            cursor: 'pointer',
            border: 'none',    
            color: '#00A896',
            textDecoration: 'none',
        }
    }

    return(
        <Link to={'/profile'} style={styles.estilo}><h1>Perfil</h1></Link>
    )
}



export default Perfil