import React from 'react';


class Register extends React.Component{

   constructor(props){
     super(props);
       this.state = {
         name:'',
         email:'',
         password:''
       }
     }

    
     onEmailChange = (event)=>{ // function to update 'email' state
        this.setState({email:event.target.value});
     }

     onPasswordChange = (event) => { //func to update the 'passwrd' state
       this.setState({password:event.target.value});
     }

     onNameChange = (event) => { //func to update the 'name' state
       this.setState({name:event.target.value});
     }
     
     onSubmitRegister = () => {
       fetch('https://morning-island-74263.herokuapp.com/register',{
         method:'post',
         headers:{'Content-Type':'application/json'},
         body:JSON.stringify({
           email:this.state.email,
           password:this.state.password,
           name:this.state.name
         })
       })
       .then((response)=>response.json())
       .then((data)=>{
         if(data){
           this.props.loadUser(data); // loading the 'user-profile' on registering
              
            console.log('returning array',data);

          this.props.onRouteChange('home');
         }
       })
      
     }

  render(){
    // const{onRouteChange} = this.props;
    return(
      <article className="br3 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5">
       <main className="pa4 black-80">
        <div className="measure">
         <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f2 fw6 ph0 mh0">Register</legend>
          <div className="mt3">
           <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
           <input 
           className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
           type="text" 
           name="name"  
           id="name"
           onChange = {this.onNameChange}
           />
         </div>
          <div className="mt3">
           <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
           <input 
           className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
           type="email" 
           name="email-address"  
           id="email-address"
           onChange = {this.onEmailChange}
           />
         </div>
         <div className="mv3">
          <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
          <input 
          className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
          type="password" 
          name="password"  
          id="password"
          onChange = {this.onPasswordChange}
          />
       </div>
    
  </fieldset>
  <div className="">
    <input onClick={this.onSubmitRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register"/>
  </div>
  
</div>
</main>
</article>
  )
  }
}

export default Register;