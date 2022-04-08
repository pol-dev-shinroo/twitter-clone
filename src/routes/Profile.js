import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Profile = ({ userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, { displayName: newDisplayName });
        }
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    onChange={onChange}
                    placeholder="Display Name"
                    value={newDisplayName}
                />
                <input
                    type="submit"
                    value="Update Profile"
                    onSubmit={onSubmit}
                />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
