import React, {Component, useEffect} from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from './firebase';
import { injectIntl } from 'react-intl';
import { setToken } from '../actions';
import { Link, withRouter } from 'react-router-dom';

// Custom Components
import HeaderOne from './common/headers/header-one';
import FooterOne from "./common/footers/footer-one";

// ThemeSettings
import ThemeSettings from "./common/theme-settings"
import CookieConsent, { Cookies } from "react-cookie-consent";
import Cookie from 'js-cookie';
import { uuid } from 'uuidv4';

/*const LoadScript = props => {
    //let url = "";
    Cookie.get('cookie-consent') && 
    useEffect(() => {
    const script = document.createElement('script');

    script.src = props.url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [props.url]);
  return '';

  // rest of your component
}*/

class App extends Component {

  constructor(props) {
    super(props);
    this.authRedirect = ['checkout', 'my-account', 'orders', 'admin'];
  }

    recordConsent = async () => {
      try {
        const response = await fetch('https://bathtimestories.com/apim/cookie-consent.php', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uuid: Cookie.get('cookie-consent')}),
        });
        const data = await response.json();
        console.log(data); 
        window.location.reload(false);
        return data;
      }  catch(error){
          console.log(error)
      }  

    }

    async componentDidMount(){
      const {email, token} = this.props;
      let container = this;
      let page = this.props.location.pathname.replace('/','');//match(/^(.+?)\//);
      //page = page ? page[0].replace(/\//g,'') : null ;
      if(page && this.authRedirect.includes(page)) 
      await this.props.firebase.auth.onAuthStateChanged(user => {
        if (user) {
          user.getIdToken().then(function(idToken) {
            console.log(idToken);
            console.log(user.email);
            console.log(user.metadata.creationTime);
            setToken(idToken);
          });
          container.setState({email: user.email});
        }
        else
          container.props.history.push('/login?ref='+page);
      }); 
    }

    render() {
        const id = uuid();
        return (
            <div>
            {console.log(Cookie.get('cookie-consent'))}
            <CookieConsent
              location="bottom"
              buttonText="Accept"
              enableDeclineButton
              declineButtonText="Nu sunt de acord"
              cookieName="cookie-consent"
              cookieValue={id}
              declineCookieValue=""
              style={{ background: "#2B373B" }}
              buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
              expires={150}
              onAccept={this.recordConsent}
            >
              This website uses cookies to enhance the user experience.{" "}
              <span style={{ fontSize: "10px" }}>This bit of text is smaller :O</span>
            </CookieConsent>
            {/*<LoadScript url="https://userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/7091674c0b9318cd33984355b12b3aad28db43ba01548d4ff012bcd0b043b67c.js"/>
            <LoadScript url="https://checkout.stripe.com/checkout.js"/> */ }
                <HeaderOne logoName={'logo.png'}/>
                {this.props.children} 
                <FooterOne logoName={'logo.png'}/>

                <ThemeSettings />

            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    email: state.account.email,
    token: state.account.token
})



export default compose(
  withFirebase,
  withRouter,
  connect(mapStateToProps)
  )(injectIntl(App));
