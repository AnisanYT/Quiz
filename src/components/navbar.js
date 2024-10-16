import { Component } from "react";
import Perfil from "./perfil"
import { Link } from "react-router-dom";
const styles ={
    navbar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '100px',
        justifyContent: 'space-between',
        position: 'relative',
        padding: '0 50px',
        boxShadow: '0 2px 3px rgb(0,0,0,0.1)'
    },
    title: {
        color: '#264653',
        textDecoration: 'none'
    },
    lista: {
        listStyle: 'none',
        textDecoration: 'none',
    }
}
class navbar extends Component{
    render(){
        return(
            <nav style={styles.navbar}>
                <h1 >
                    <Link style={styles.title} to={'/'}>Quiz :D</Link>
                </h1>
                <li style={styles.lista}>
                    <Perfil/>
                </li>
            </nav>
        )
    }
}
export default navbar