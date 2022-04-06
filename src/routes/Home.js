import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import Tweet from "components/Tweet";

const Home = ({ userObj }) => {
    // for adding tweet to database
    const [tweet, setTweet] = useState("");
    // for getting tweets from database
    const [tweets, setTweets] = useState([]);
    // get tweets from database in real time
    useEffect(() => {
        const q = query(
            collection(dbService, "tweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(nweetArr);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        // upload tweet to databse (firebase)
        try {
            const docRef = await addDoc(collection(dbService, "tweets"), {
                text: tweet,
                createdAt: new Date(),
                creatorId: userObj.uid,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.log(error);
        }
        // after submit make tweet empty again
        setTweet("");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setTweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                    value={tweet}
                    onChange={onChange}
                />
                <input type="submit" />
            </form>
            {/* Get tweets from database */}
            <div>
                {tweets.map((tweet) => (
                    <Tweet
                        key={tweet.id}
                        tweetObj={tweet}
                        isOwner={tweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
