import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { setUser, setMessage } from "../../actions";
import Breadcrumb from "../common/breadcrumb";
import { withFirebase } from "../firebase";
import { injectIntl } from "react-intl";

const SignOutPage = () => (
  <div>
    <Breadcrumb title={"Login account"} />
    <section className="register-page section-b-space">
      <div className="container">
        <div className="row">
          <div className="col-md-5 mx-auto">
            <h3>create account</h3>
            <div className="theme-card">
              <SignOutForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const INITIAL_STATE = {
  error: null,
};

class SignOutFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    try {
      await this.props.firebase.doSignOut();
      this.setState({ ...INITIAL_STATE, message: "" });
      setUser(null);
      setMessage("Signed out");
      this.props.history.push("/login");
    } catch (error) {
      console.log(error);
      this.setState({ error });
    }
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const error = this.state;
    const { intl } = this.props;

    return (
      <form onSubmit={this.onSubmit} className="theme-form">
        <div className="form-row">
          <div className="text-center">
            <button className="btn btn-solid" type="submit">
              {intl.formatMessage({ id: "log_out" })}
            </button>
          </div>
        </div>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignOutForm = compose(withRouter, withFirebase)(SignOutFormBase);

export default injectIntl(SignOutForm);
