import React, { useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    onSnapshot, // Import onSnapshot for real-time updates
} from 'firebase/firestore';
import { firestore } from '../firebase';

function Comments({ blogId, user }) {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch comments for the current blog post
        const fetchComments = async () => {
            const commentsCollection = collection(firestore, 'comments');
            const commentsQuery = query(commentsCollection, where('blogId', '==', blogId));
            const commentsSnapshot = await getDocs(commentsQuery);
            const commentsData = commentsSnapshot.docs.map((commentDoc) => commentDoc.data());
            setComments(commentsData);
        };

        fetchComments();

        const fetchUsername = async () => {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                setUsername(userDocSnapshot.data().username);
            }
        };

        if (user && user.uid) {
            fetchUsername();
        }

        const commentsCollection = collection(firestore, 'comments');
        const commentsQuery = query(commentsCollection, where('blogId', '==', blogId));
        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const updatedComments = snapshot.docs.map((commentDoc) => commentDoc.data());
            setComments(updatedComments);
        });

        return () => {
            unsubscribe();
        };
    }, [blogId, user]);

    const handleAddComment = async () => {
        if (comment.trim() === '') {
            return;
        }

        try {
            const commentData = {
                blogId,
                userId: user.uid,
                username, 
                content: comment,
                timestamp: serverTimestamp(),
            };

            await addDoc(collection(firestore, 'comments'), commentData);
            setComment('');
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    return (
        <div>
            <h3>Add a Comment</h3>
            <textarea
                placeholder="Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Add Comment</button>
            <div>
                <h3>Comments:</h3>
                <ul>
                    {comments.map((commentData) => (
                        <li key={commentData.timestamp?.toDate()?.getTime()}>
                            <p>{commentData.content}</p>
                            <p>Username: {commentData.username}</p>
                            <p>Timestamp: {commentData.timestamp ? commentData.timestamp.toDate().toLocaleString() : 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Comments;
