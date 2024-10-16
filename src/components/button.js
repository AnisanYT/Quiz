import { Component } from "react";

const ButtonStyle = {
    color: 'white',
    backgroundColor: '#F4A261',
    padding: '15px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'backgroundColor 0.3s ease',
    margin: '5px',
}


class button extends Component{
    
    render(){
        return(
            <button 
                style={ButtonStyle}
                {...this.props}
                
            >
                {this.props.children}
            </button>
            
        )
    }
}

export default button