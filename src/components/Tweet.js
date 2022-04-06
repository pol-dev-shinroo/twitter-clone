import React, { useState } from "react";
import { deleteDoc, getFirestore, doc, updateDoc } from "firebase/firestore";

const Tweet = ({ tweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    const onDeleteClick = async (event) => {
        const ok = window.confirm("삭제 하시겠습니까?");
        if (ok) {
            // implement delete function
            console.log(tweetObj.id);
            // doc("컬렉션이름", "문서이름")
            await deleteDoc(doc(getFirestore(), "tweets", tweetObj.id));
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(getFirestore(), "tweets", tweetObj.id), {
            text: newTweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewTweet(value);
    };
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your tweet"
                            value={newTweet}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Tweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{tweetObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>
                                Delete Tweet
                            </button>
                            <button onClick={toggleEditing}>Edit Tweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Tweet;
