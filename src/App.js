import React,{ Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
//importing components
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const app = new Clarifai.App({
  apiKey: '1244ce33a0c54ae882d226a91ac08a03'
 });


const particlesOptions= {
  particles: {
    number:{
      value: 300,
      density:{
        enable:true,
        value_area: 800
      }
    }
  }
}

const initialState = { // this is the 'state' stored outside the 'class component' in a variable
  input:'',
  imageUrl:'',
  box:{},
  route:'signin',
  isSignedIn: false,
  user:{
    id:'',
    email:'',
    entries:0,
    joined:'',
    name:''
  } // user profile state
}

class App extends Component{
  constructor(){
    super();
    this.state= initialState;
  }

  
  

  calculateFaceLocation = (data) => {
    const clarifaiFaceData = data.outputs[0].data.regions[0].region_info.bounding_box ;
    console.log('clarifaiFaceData',clarifaiFaceData);
    const image = document.getElementById('inputImage');//garbbing the image
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      left: clarifaiFaceData.left_col * width,
      top: clarifaiFaceData.top_row * height,
      right: width - (clarifaiFaceData.right_col * width),
      bottom: height - (clarifaiFaceData.bottom_row * height)
    } // this object contains the "dots" around the image
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box}); //updating the box state with the obj returnd by calculateFaceLocation
  }

  onInputChange=(event)=>{ //mine own function
    this.setState({input:event.target.value}); //updating the input state on changing the url in the input box.
    console.log('input',this.state.input);
  } 

  onButtonSubmit=()=>{ //mine own function 
    this.setState({imageUrl:this.state.input});//updating the imageUrl state on clicking the 'Detect' button

    console.log("input",this.state.input);
    console.log("imageUrl1",this.state.imageUrl);
   
    console.log('click');

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then((response) =>{
      if(response){
        fetch('https://morning-island-74263.herokuapp.com/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            id:this.state.user.id
          })
        })
        .then((response)=>response.json())
        .then((count)=>{
          this.setState(Object.assign(this.state.user, {entries:count[0]}))
        })
        .catch((err)=>console.log('error occurred somehow!!!'))
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch((err)=>console.log('some error occurred',err))

    this.setState({input:''});
  
  }

  onRouteChange=(route)=>{
    if(route === 'signout'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }

  loadUser = (data) => { // func to update the 'user-profile' state
    this.setState({
      user:{
        id:data.id,
        email:data.email,
        entries:data.entries,
        joined:data.joined,
        name:data.name
      }
    })
    
  }

  
  render(){
    return(
      <div className="App">
        <Particles className='particles' 
              params={particlesOptions}
              
            />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        {(this.state.route === 'home')?
        <div>
        <Logo/>
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} input={this.state.input}/>
       <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
       </div>

       :( (this.state.route === 'signin')?
            <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> :
            <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>

       )
        
        
        
       }
      </div>
    )
  }
}

export default App;
