import './App.css';
import Post from './components/Post'
import {useState,useEffect,} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {db,auth} from './firebase'
import {Modal,Button,Input,Avatar} from '@material-ui/core'
import ImageUpload from './components/ImageUpload'

const App = () => {

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '0.34px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  function getModalStyle() {
    const top = 50 ;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const [posts,setPosts] = useState([])
  const [open,setOpen] = useState(false)
  const [openSignIn,setOpenSignIn] = useState(false)
  const [modalStyle] = useState(getModalStyle)
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const classes = useStyles()

  // User details
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser){
        //User is logged in
        setUser(authUser)
      }else{
        //User is logged out
        setUser(null)
      }
    })
    return () => {
      unsubscribe()
    }
  },[user,username])

  // Data from Firestore
  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data()})))
      // posts = [ id:docId, post:{caption:'', username:'', imageUrl:"https://..."}]
    })
  },[])

  const signUp = (event) => {
    event.preventDefault()

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      console.log(authUser)
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) => {
      alert(error.message)
      
    })
   
      setOpen(false)
      setUsername('')
      setEmail('')
      setPassword('')
    
  }

  const signIn = (event) => {
    event.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }

  return (
    <div className="app">
  
    {/* Modal for Sign Up */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
            </center>
            
            <Input 
              placeholder="Username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input 
              placeholder="Email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />          
            <Input 
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

    {/* Modal for Sign In */}
    <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
            </center>
            
            <Input 
              placeholder="Email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />          
            <Input 
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
    </Modal>
    
      {/* Header */}
     <div className="app__header">
       <div className="container">
         <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
       </div>

        {user ?
          <Button onClick={() => auth.signOut()}>Logout</Button>:
        (
          <div className='login__container'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>   
          </div>  
        )   
        }
        {user && (
          <Avatar 
          className="post__avatar" 
          alt={user.displayName}
          src={user.displayName}
          >
          </Avatar>
        )}
     </div>

        <div className="app__posts">
          <div className="app__postsLeft">
            {/* Posts */}
            {posts.map(({id,post}) => (
              <Post key={id} postId={id} post={post} user={user} caption={post.caption} imageUrl={post.imageUrl} username={post.username} />
            ))}
          </div>
          <div className="app__postsRight">
          </div>
        </div>

  {user?.displayName ? (
      <ImageUpload username={user.displayName} />
    ): (
      <div className="alert alert-info" role="alert">
       You need to <span id="click" onClick={(e) => setOpenSignIn(true)}>sign in</span> to upload Posts and comments.
    </div>
    )}
    
    </div>
  );
}

export default App;
