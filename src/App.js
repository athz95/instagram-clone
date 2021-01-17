import React, {useState, useEffect} from 'react';
import './App.css';
import Post from "./Post";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./imageUpload";
import InstagramEmbed from 'react-instagram-embed';



function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    
  },
}));

function App() {
  
  const classes = useStyles();
  const {modalStyle} = useState(getModalStyle);
  
  const [post, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  
     
  useEffect(() => {
     const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(authUser) {
          //user has logged in
           console.log(authUser);
           setUser(authUser);
  
        } else {
          //user has logged out
           setUser(null);
        }

      })
      return() => {
        //perfrom some cleanups
        unsubscribe();
      }

  }, [user, username]);


    useEffect(() => {
         
     db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
       setPost(snapshot.docs.map(doc => ({
         id: doc.id,
         post: doc.data()
        })));
     })
    }, []);
  

    const signUp = (event) => {
      event.preventDefault();
      auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        }) 
      }) 
      .catch((error) => alert(error.message))

      setOpen (false);
    }

    const  signIn = (event) => {
      event.preventDefault();
      auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

      setOpenSignIn(false);
    }

  return (
    <div className="App">
    
    <Modal
    open={open}
    onClose={() => setOpen(false)} 
    >

   <div style={modalStyle} className={classes.paper}>
     <form className="app-signup"> 
     <center>
     <img 
       className="app-header-image"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt="instagram-logo"
    />
     </center>
    <Input
       placeholder="Username"
       type="username"
       value={username}
       onChange={(e) => setUsername(e.target.value)}
    />
    <Input
       placeholder="Email"
       type="text"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
    />

   <Input
       placeholder="Password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
    />

    <Button type="submit" onClick={signUp}>Sign Up</Button>
    </form>

     </div>  
    </Modal>

    <Modal
    open={openSignIn}
    onClose={() => setOpenSignIn(false)} 
  >

   <div style={modalStyle} className={classes.paper}>
     <form className="app-signup"> 
     <center>
     <img 
       className="app-header-image"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt="instagram-logo"
    />
     </center>
    <Input
       placeholder="Email"
       type="text"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
    />

   <Input
       placeholder="Password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
    />

    <Button type="submit" onClick={signIn}>Sign In</Button>
    </form>

     </div>  
    </Modal>


     <div className="app_header">
    <img 
       className="app-header-image"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt="instagram-logo"
    />
     {user ? (
         <Button onClick={() => auth.signOut()}> Log Out </Button>
    ) : (
      <div className="app-loginContainer">
         <Button onClick={() => setOpenSignIn(true)}> Sign In </Button>
         <Button onClick={() => setOpen(true)}> Sign Up </Button>
      </div>
    )}
   </div>

   <div className="app_posts">

     <div className="app-postsLeft">
   {
     post.map(({id, post}) => (
       <Post
       key={id}  
       postId={id}
       user={user}
       username={post.username} 
       caption={post.caption} 
       imageUrl={post.imageUrl}
       />
     ))
   }

</div>

<div className="app-postsRight">


<InstagramEmbed
     url='https://www.instagram.com/p/CEuHr-EsehV/?utm_source=ig_web_copy_link'
     maxWidth={320}
     hideCaption={false}
     containerTagName='div'
     protocol=''
     injectScript
     onLoading={() => {}}
     onSuccess={() => {}}
     onAfterRender={() => {}}
     onFailure={() => {}}
  />
   </div>
</div>

   

   { user?.displayName ? (
     <ImageUpload username={user.displayName} />
   ): (
     <h3 className="warning-text"> Sorry you need to login to upload</h3>
   )}

  
    </div>
  );
}

export default App;




