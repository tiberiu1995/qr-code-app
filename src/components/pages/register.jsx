import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Breadcrumb from "../common/breadcrumb";
import { withFirebase } from '../firebase';


const SignUpPage = () => (
  <div>
    <Breadcrumb title={'create account'}/>
    <section className="register-page section-b-space">
      <div className="container">
        <div className="row">
          <div className="col-md-5 mx-auto">
            <h3>create account</h3>
            <div className="theme-card">
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>    
    </section>                  
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
        await this.createCustomer({name, email, uid: authUser.user.uid});
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
          <form onSubmit={this.onSubmit} className="theme-form">
            <div className="form-row">
              <div className="col-md-10 mx-auto">
                <label htmlFor="username">name</label>
                <input
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  type="text"
                  placeholder="name"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-10 mx-auto">
                <label htmlFor="email">email</label>
                <input
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Email Address"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-10 mx-auto">
                <label htmlFor="review">Password</label>
                <input
                  className="form-control"
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-10 mx-auto">
                <label htmlFor="review">Confirm password</label>
                <input
                  className="form-control"
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            <div className="text-center">
              <button 
                className="btn btn-solid"
                disabled={isInvalid} 
                type="submit"
              >
                Sign Up
              </button>
            </div>
            {error && <p>{error.message}</p>}
          </form>
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