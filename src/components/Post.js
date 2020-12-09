import React,{useState,useEffect} from 'react'
import '../Post.css'
import { Avatar } from '@material-ui/core'
import {db} from '../firebase'
import firebase from 'firebase'

const Post = ({postId,username,imageUrl,caption,user,post}) => {

    const date = Date(post.timestamp).split(' ').slice(1,4)

    const [comments,setComments] = useState([])
    const [comment,setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => doc.data()))
            })
        }
        return () => {
            unsubscribe();
        }
    },[postId])

    const postComment = (event) => {
        event.preventDefault()
        db.collection('posts').doc(postId).collection('comments').add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className="post">

            <div className="post__header">
                <Avatar 
                    className="post__avatar" 
                    alt={username}
                    src={username}
                    >
                </Avatar>
                <h6>{username}</h6>
            </div>
            
            {/* Header -> avatar + username */}

            {/* Image */}
            <img className="post__image" src={imageUrl}/>

            {/* username + caption */}
            <h5 className="post__text"><strong>{username} </strong>{caption}</h5>

            <div className="post__comments">                
                    {comments.map(comment => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))}
            </div>

                    <small className="text-muted" style={{ padding:20 }}>{
                        date.map(d => d+ ' ')
                    }</small>
           {user && (
                <form className="form__commentBox">
                <input 
                    value={comment}
                    className="post__input"
                    type="text"
                    placeholder="Enter a comment"
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={postComment} disabled={!comment} className="post__button">Post</button>
            </form>
           )}
        </div>
    )
}

export default Post
