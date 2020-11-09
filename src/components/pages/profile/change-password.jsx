import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { setUser, setMessage } from '../../../actions';
import Breadcrumb from "../../common/breadcrumb";
import { withFirebase } from '../../firebase';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/styles';
import SimpleReactValidator from 'simple-react-validator';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


const INITIAL_STATE = {
  validator: new SimpleReactValidator(),
  password1: '',
  password2: '',
  error: null,
};

const useStyles = (theme => ({
  form:{
    maxWidth: 500,
    flexWrap: 'wrap',
    '& .MuiFormControl-root':{
      marginLeft: 16,
      marginRight: 16,
      flex: [[1, 0, '200px']],

    }
  },
  // edit: {
  //   '&:not(.Mui-disabled)': {
  //     cursor: 'pointer',
  //     color: '#ffffff',
  //     backgroundColor: '#4caf50',
  //   }
  // },
  delete: {
    cursor: 'pointer',
    color: '#ffffff',
    backgroundColor: '#f44336',
  }

}))

class ChangePasswordFormBase extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

onSubmit = async (event) => {
  event.preventDefault();
  if (!this.state.validator.allValid()) {
    this.state.validator.showMessages();
    this.forceUpdate();
    return "";
  }
   const password1 = this.state.password1;
  try {
    await this.props.firebase.doPasswordUpdate(password1);
    this.setState({ ...INITIAL_STATE, message: '' });
    setUser(null);
    setMessage('Password changed');
    //this.setState({email:''});
    this.props.history.push('/log-in');
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

      const { classes } = this.props
        return ( 
          <form onSubmit={this.onSubmit} className="theme-form">
              { this.props.token ? '' : <Redirect to='/log-in' /> }
              <Box display="flex" className={classes.form}>
                <TextField 
                  label="Password" 
                  name="password1"
                  value={password1}
                  onChange={this.onChange}
                  variant="outlined" 
                  size="small" 
                  margin="normal"/>
                { this.state.validator.message(
                  "password",
                  this.state.password1,
                  "required"
                )}
                <TextField 
                  label="Confirm password" 
                  name="password2"
                  value={password2}
                  onChange={this.onChange}
                  variant="outlined" 
                  size="small" 
                  margin="normal"/>
                 { this.state.validator.message(
                  "password",
                  this.state.password2,
                  "required"
                )}                 
              </Box>
              <Box>
                <Button 
                  align="center"
                  className={classes.edit}
                  disabled={isInvalid} 
                  variant="outlined"
                  type="submit" >
                  Change password
                </Button>
              </Box>

            {error && <p>{error.message}</p>}
          </form>
        )
    }
}

const mapStateToProps = (state) => ({
  token: state.account.token
});

export default compose(
  connect(mapStateToProps),
  withStyles(useStyles, { withTheme: true }),
  withRouter,
  withFirebase,
)(ChangePasswordFormBase);

 