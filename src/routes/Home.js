import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
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
    //Photo Source
    const [photoSource, setPhotoSource] = useState("");
    // get tweets from database in real time
    useEffect(() => {
        const q = query(
            collection(dbService, "tweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const tweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(tweetArr);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        // upload photo to database (firebase)
        if (!tweet && photoSource === "") return;
        let photoURL = "";
        if (photoSource !== "") {
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(
                fileRef,
                photoSource,
                "data_url"
            );
            photoURL = await getDownloadURL(response.ref);
        }

        // upload tweet to databse (firebase)
        await addDoc(collection(dbService, "tweets"), {
            text: tweet,
            createdAt: new Date(),
            creatorId: userObj.uid,
            photoURL,
        });
        // after submit make tweet empty again
        setTweet("");
        onClearPhoto();
    };
    // get Photo Url
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const imageFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const {
                currentTarget: { result },
            } = e;
            setPhotoSource(result);
        };
        reader.readAsDataURL(imageFile);
    };
    // clear Photo Url with Button
    const onClearPhoto = () => {
        setPhotoSource(null);
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
                    required
                />
                <input type="submit" />
                <input type="file" accept="image/*" onChange={onFileChange} />
                {photoSource && (
                    <div>
                        <img
                            src={photoSource}
                            alt=""
                            width="50px"
                            height="50px"
                        />
                        <button onClick={onClearPhoto}>삭제</button>
                    </div>
                )}
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
