import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);
    useEffect(() => {
        // firebase observer to see if user is logged in:
        authService.onAuthStateChanged((user) => {
            if (user) {
                // if user is logged in:

                setUserObj(user);
            } else {
                // user is not logged in:
            }
            setInit(true);
        });
    }, []);
    return (
        <>
            {init ? (
                <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
            ) : (
                "Initializing..."
            )}
            <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
        </>
    );
}

export default App;
