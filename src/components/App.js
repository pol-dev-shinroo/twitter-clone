import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);
    useEffect(() => {
        // firebase observer to see if user is logged in:
        authService.onAuthStateChanged((user) => {
            if (user) {
                // if user is logged in:
                setIsLoggedIn(true);
                setUserObj(user);
            } else {
                // user is not logged in:
                setIsLoggedIn(false);
            }
            setInit(true);
        });
    }, []);
    return (
        <>
            {init ? (
                <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
            ) : (
                "Initializing..."
            )}
            <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
        </>
    );
}

export default App;
