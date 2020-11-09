import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { setUser, setMessage } from '../../../actions';
import { withFirebase } from '../../firebase';
import SimpleReactValidator from 'simple-react-validator';
import { withStyles } from '@material-ui/styles';
import { Button, TextField } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { InputLabel } from '@material-ui/core/';
import { Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';


const INITIAL_STATE = {
  email: '',
  error: null,
  confirm: false,
};

const useStyles = theme => ({
  edit: {
      backgroundColor: '#4caf50',
      color: 'white',
  },
})

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
            <Helmet>
<meta charSet="utf-8" />
<title>Change Password</title>
</Helmet>
          <Typography>An email has been sent to recover your account.</Typography>
          <Link to="/home">Go home</Link>
          </div>
          :
          <Box mt={1} align="center" display="flex" flexDirection="column">
              <InputLabel htmlFor="outlined-adornment-password">Reset password</InputLabel>
              <div className="col-md-10 mx-auto">
                <TextField 
                  margin="normal"
                  label="Email"
                  variant="outlined" 
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  type="email"/>             
                {this.state.validator.message('email', this.state.email, 'required|email')}
              </div>
            <Box align="center">
              <Button onClick={this.onSubmit} className={this.props.classes.edit} type="submit">
                Reset
              </Button>
            </Box>
          </Box>
        )
    }
}

 
export default compose(
  withStyles(useStyles),
  withRouter,
  withFirebase,
)(ForgetPasswordFormBase);

 