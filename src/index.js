import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { IntlProvider, addLocaleData } from "react-intl";
import { ScrollContext } from "react-router-scroll-4";
import "./index.scss";
import "./components/common/index.scss";
import "./fonts.css";
import AdminLayout from "./components/App.jsx";
import MenuLayout from "./components/App-menu.jsx";
import * as serviceWorker from "./serviceWorker";

import store from "./store";
import MenuForm from "./components/pages/menu/form.jsx";
//import MenuShow from "./components/pages/menu";

import Menus from "./components/pages/menu/";
import PlaceItems from "./components/pages/menu/items/";
import Categories from "./components/pages/category/";
import Items from "./components/pages/items/";
import Design from "./components/pages/menu/design/";
import CustomerMenu from "./components/pages/menu/view/";
import Login from "./components/pages/profile/log-in";
import Register from "./components/pages/profile/register";
import Profile from "./components/pages/profile/profile.jsx";
import Settings from "./components/pages/profile/settings.jsx";
import ChangePassword from "./components/pages/profile/change-password.jsx";

import messages from "./language.json";

//import Products from "./components/products/products.jsx";

import ScanQR from "./components/pages/scan-qr";

//import { Container } from "./components/test/test";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import {blue, red} from '@material-ui/core/colors';
import { PlayCircleFilledWhite } from "@material-ui/icons";
import { colors, rgbToHex } from "@material-ui/core";
import { FirebaseContext } from "./components/firebase";
import Firebase from './components/firebase/firebase';
import ForgetPassword from './components/pages/profile/forgot-password';
import QrCode from './components/pages/menu/qr-code';
import Home from './components/pages/home';


class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
    this.theme = createMuiTheme({
      palette: {
        primary: {
          main: 'rgb(241,241,241)'
        },
        /*secondary: {
          main: red[50],
        }*/
        text: {
          //secondary: 'rgb(255,255,255)',
        },
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 500,
          md: 600,
          lg: 900,
          xl: 1300
        }
      },
      overrides: {
        MuiCheckbox: {
          root: {
            //color: 'black'
          }
        }
      }
    });
  }

  componentDidMount() {}
  /*
    /menu/  - all menus
    /menu/:title  - admin menu
    /my-menu/:title - visitor menu




  */
  render() {
    const locale = store.getState().settings.language;
    console.log(locale);
    return (
      <Provider store={store}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <ThemeProvider theme={this.theme}>
            <BrowserRouter basename={"/"}>
              <ScrollContext>
                <Switch>
                  <Route
                      path={`${process.env.PUBLIC_URL}/scan-qr/`}
                      component={ScanQR}/>
                  <MenuLayout path={`${process.env.PUBLIC_URL}/my-menu/`}>
                    {/* <Route exact path={`${process.env.PUBLIC_URL}/menu/`} component={MenuShow}/> */}                                      
                    <Route 
                      exact
                      path={[`/my-menu/:title/:category/`,`/my-menu/:title/`]}
                      component={CustomerMenu}
                    />
                  </MenuLayout>
                  <AdminLayout>
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/new/`}
                      component={MenuForm}
                    />

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/`}
                      component={Menus}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/`}
                      component={MenuForm}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/categories/`}
                      component={Categories}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/categories/:id/`}
                      component={Categories}
                    />

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/edit-category/:category/`}
                      component={PlaceItems}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/items/`}
                      component={Items}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/items/:id/`}
                      component={Items}
                    />

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/design/`}
                      component={props => <Design {...props} />}
                    />

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title/qr-code/`}
                      component={QrCode}
                    />
                    <Route
                      exact
                      path={'/home'}
                      component={Home}

                      />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/log-in`}
                      component={Login}
                    />  
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/register`}
                      component={Register}
                    />  
                   <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/forgot-password`}
                      component={ForgetPassword}
                    />                
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/my-account/profile`}
                      component={Profile}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/my-account/settings`}
                      component={Settings}
                    /> 
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/my-account/change-password`}
                      component={ChangePassword}
                    />                                                  
                  </AdminLayout>
                </Switch>
              </ScrollContext>
            </BrowserRouter>
          </ThemeProvider>
        </IntlProvider>
      </Provider>
    );
  }
}



ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Root />
  </FirebaseContext.Provider>, 
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
