import React from "react";
import IfNotAccount from "../components/ifNotAccount"
import ProfileInfo from "../components/profileInfo";
const isAuth = () => {
    const token = localStorage.getItem('token') 
    return !!token
}
const ProfilePage = () => {

    return(
        <>
            {
                isAuth() !== true 
                ? <IfNotAccount/>
                : <ProfileInfo/>
            }
        </>
    ) 
}

export default ProfilePage