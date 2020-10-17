import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { setUser, setMessage } from '../../actions';
import Breadcrumb from "../common/breadcrumb";
import { withFirebase } from '../firebase';
import SimpleReactValidator from 'simple-react-validator';


const INITIAL_STATE = {
  email: '',
  error: null,
  confirm: false,
};

class ForgetPasswordFormBase extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, validator : new SimpleReactValidator()  };
    }

  onSubmit = async (event) => {
    event.preventDefault();
    if(!this.state.validator.allValid()) {
      this.state.validator.showMessages();
      this.forceUpdate();
      return '';
    };    
    const email = this.state.email;
    try {
      await this.props.firebase.doPasswordReset(email);
      this.setState({ ...INITIAL_STATE, message: '', confirm: true });
      setUser(null);
      setMessage('Email sent');
      //this.props.history.push('/login');
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
        email,
        error,
        confirm
      } = this.state;

        return ( 
          confirm ? 
          <div className="col-lg-4 mx-auto text-center">
          <h4>Un email pentru resetarea parolei a fost trimis.</h4>
          <Link to="/shop">Mergi la pagina principala</Link>
          </div>
          :
          <form onSubmit={this.onSubmit} className="theme-form col-lg-4 mx-auto">
            <div className="form-row">
              <div className="col-md-10 mx-auto">
                <label htmlFor="review">Adresa de email</label>
                <input
                  className="form-control"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  type="email"
                  placeholder="Introdu adresa de email"
                />
                {this.state.validator.message('email', this.state.email, 'required|email')}
              </div>
            </div>
            <div className="text-center">
              <button className="btn btn-solid m-2" type="submit">
                Reseteaza parola
              </button>
            </div>
            {error && <p>{error.message}</p>}
          </form>
        )
    }
}

 
const ForgetPasswordForm = compose(
  withRouter,
  withFirebase,
)(ForgetPasswordFormBase);

export default ForgetPasswordForm;
 