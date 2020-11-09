import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Breadcrumb from "../../common/breadcrumb";
import { withFirebase } from '../../firebase';
import { TextField, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { setName, setToken } from '../../../actions';


const SignUpPage = () => (
  <div className="container-fluid">
    <div className="form form-label-center row">
      <SignUpForm />                
    </div>
  </div>
);

const INITIAL_STATE = {
  name: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onChange = event => {
      //console.log( this.state );
      this.setState({ [event.target.name]: event.target.value });
    };

    createCustomer = async (info) => {
      const response = await fetch('https://bathtimestories.com/apim/user/new.php', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(info),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      console.log(data);
      setToken(info.token);
      setName(info.name)
      
      //console.log(address);
    }

    onSubmit = async (event) => {
      event.preventDefault();
      const { name, email, passwordOne } = this.state;
      try{
        const authUser = await this.props.firebase.doCreateUserWithEmailAndPassword(email, passwordOne);
        console.log(authUser);
        this.setState({ ...INITIAL_STATE });
        await this.props.firebase.doSendVerificationEmail();
        const token = await this.props.firebase.getUser().getIdToken();
        await this.createCustomer({name, email, uid: authUser.user.uid, token: token});
        this.props.history.push('/menu');
      }
      catch(error){
        this.setState({ error });
      }
  };

    render (){
      const {
        name,
        email,
        passwordOne,
        passwordTwo,
        error,
      } = this.state;

      const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        email === '' ||
        name === '';

        return ( 
          <Box display="flex" flexDirection="column" m="auto">
            <Helmet>
              <meta charSet="utf-8" />
              <title>Register</title>
            </Helmet>
            <TextField 
              name="name"
              label="Name"
              value={name}
              margin="normal"
              variant="outlined"
              onChange={this.onChange} />
            <TextField 
              name="email"
              label="Email"
              variant="outlined"
              value={email}
              margin="normal"
              onChange={this.onChange}
              type="text" />
            <TextField 
              name="passwordOne"
              variant="outlined"
              margin="normal"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password" />
            <TextField 
              name="passwordTwo"
              margin="normal"
              value={passwordTwo}
              variant="outlined"
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password" />
          <Button 
            onClick={this.onSubmit}
            disabled={isInvalid} 
            type="submit" >
            Sign Up
          </Button>
          <Typography>{error ? error.message : ''}</Typography>
        </Box>
        )
    }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={'/register'}>Sign Up</Link>
  </p>
);
 
const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;
 
export { SignUpForm, SignUpLink };