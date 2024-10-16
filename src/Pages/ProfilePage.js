import React from "react";
import IfNotAccount from "../components/ifNotAccount"
import ProfileInfo from "../components/profileInfo";
const isAuth = () => {
    const token = localStorage.getItem('token') 
    return !!token
}

const ProfilePage = () => {

    return(
        <div>
            {
                isAuth() !== true 
                ? <IfNotAccount/>
                : <ProfileInfo/>
            }
        </div>
    ) 
}

export default ProfilePage