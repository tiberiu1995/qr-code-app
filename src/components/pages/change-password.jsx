import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { setUser, setMessage } from '../../actions';
import Breadcrumb from "../common/breadcrumb";
import { withFirebase } from '../firebase';


const INITIAL_STATE = {
  password1: '',
  password2: '',
  error: null,
};

class ChangePasswordFormBase extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

onSubmit = async (event) => {
  event.preventDefault();
   const password1 = this.state.password1;
  try {
    await this.props.firebase.doPasswordUpdate(password1);
    this.setState({ ...INITIAL_STATE, message: '' });
    setUser(null);
    setMessage('Password changed');
    //this.setState({email:''});
    this.props.history.push('/login');
  } catch (error) {
    console.log(error);
    this.setState({ error })
  }
};
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 

    render (){
      const {
        password1,
        password2,
        error,
      } = this.state;

      const isInvalid =
        password1 !== password2 ||
        password1 === '';

        return ( 
          <form onSubmit={this.onSubmit} className="theme-form">
                       <div className="form-row">
              <div className="col-md-10 mx-auto">
                <label htmlFor="review">Password</label>
                <input
                  className="form-control"
                  name="password1"
                  value={password1}
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
                  name="password2"
                  value={password2}
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
                Change password
              </button>
            </div>
            {error && <p>{error.message}</p>}
          </form>
        )
    }
}

 
const ChangePasswordForm = compose(
  withRouter,
  withFirebase,
)(ChangePasswordFormBase);

export default ChangePasswordForm;
 