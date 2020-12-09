import React,{useState} from 'react'
import {Button,Input} from '@material-ui/core'
import {db,storage} from '../firebase'
import firebase from 'firebase'
import '../ImageUpload.css'

const ImageUpload = ({username}) => {

    const [caption,setCaption] = useState('')
    const [image,setImage] = useState(null)
    const [progress,setProgress] = useState(0)

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = (e) => {
        // You are putting the selected image under this url
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => {
                console.log(error)
                alert(error.message)
            },
            () => {
                //Completed function
                storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection('posts').add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username
                    })
                    setProgress(0)
                    setCaption('')
                    setImage(null)
                })
            }
        )
    }

    return (
    <div className="wrap">
        <div className='imageupload'>
            <progress value={progress} max="100" />
            <Input type="text" value={caption} placeholder="Enter a caption" onChange={(e) => setCaption(e.target.value)} />
            <div className="image__submit">
                
                <input className="mt-3" onChange={handleChange} type="file"/>
                <Button type="submit" disabled={!caption || !image} onClick={handleUpload}>Upload</Button>
            </div>
        </div>
    </div>

    )
}

export default ImageUpload
