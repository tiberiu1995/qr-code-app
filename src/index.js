import React from "react";
import ReactDOM from "react-dom";
import { compose } from "recompose";
import { connect, Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { IntlProvider, addLocaleData } from "react-intl";
import { ScrollContext } from "react-router-scroll-4";
import "./index.scss";
import "./components/common/index.scss";
import Layout from "./components/App.jsx";
import * as serviceWorker from "./serviceWorker";

import store from "./store";
import MenuForm from "./components/pages/new-menu";
import MenuShow from "./components/pages/menu";

import Menus from "./components/pages/menu/";
import PlaceItems from "./components/pages/menu/items/";
import Categories from "./components/pages/category/";
import Items from "./components/pages/items/";
import Design from "./components/pages/menu/design/";
import CustomerMenu from "./components/pages/menu/view/";
import ItemReviews from "./components/pages/menu/view/review/";

import messages from "./language.json";

import Products from "./components/products/products.jsx";

import ScanQR from "./components/pages/scan-qr";

import { Container } from "./components/test/test";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import blue from '@material-ui/core/colors/blue';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
    this.theme = createMuiTheme({
      palette: {
        primary: blue,
      },
    });
  }

  componentDidMount() {}

  render() {
    return (
      <Provider store={store}>
        <IntlProvider locale="ro" messages={messages["ro"]}>
          <ThemeProvider theme={this.theme}>
            <BrowserRouter basename={"/"}>
              <ScrollContext>
                <Switch>
                  <Route
                    path={`${process.env.PUBLIC_URL}/scan-qr/`}
                    component={ScanQR}
                  />
                  {/* <Route exact path={`${process.env.PUBLIC_URL}/menu/`} component={MenuShow}/> */}
                  <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/my-menu/:title`}
                    component={CustomerMenu}
                  />
                  <Route
                    exact
                    path={`${process.env.PUBLIC_URL}/my-menu/:title/reviews/:item`}
                    component={ItemReviews}
                  />
                  <Layout>
                    {/*Routes For Extra Pages*/}
                    <Route
                      path={`${process.env.PUBLIC_URL}/test`}
                      component={Container}
                    />
                    {/* <Route path={`${process.env.PUBLIC_URL}/pages/about-us`} component={aboutUs}/>
                      <Route path={`${process.env.PUBLIC_URL}/pages/404`} component={PageNotFound}/>
                      <Route path={`${process.env.PUBLIC_URL}/pages/lookbook`} component={lookbook}/>
                      <Route path={`${process.env.PUBLIC_URL}/login`} component={Login}/>
                      <Route path={`${process.env.PUBLIC_URL}/register`} component={Register}/>
                      <Route path={`${process.env.PUBLIC_URL}/pages/search`} component={Search}/>
                      <Route path={`${process.env.PUBLIC_URL}/forget-password`} component={ForgetPassword}/>
                      <Route path={`${process.env.PUBLIC_URL}/change-password`} component={ChangePassword}/>
                      <Route path={`${process.env.PUBLIC_URL}/pages/contact`} component={Contact}/>
                      <Route path={`${process.env.PUBLIC_URL}/pages/dashboard`} component={Dashboard}/>
                      <Route path={`${process.env.PUBLIC_URL}/pages/faq`} component={Faq}/>
                      <Route path={`${process.env.PUBLIC_URL}/signout`} component={SignOut}/>
                      <Route path={`${process.env.PUBLIC_URL}/my-account`} component={MyAccount}/>
                      <Route path={`${process.env.PUBLIC_URL}/cookie-policy`} component={CookiePolicy}/> */}

                    {/* <Route exact path={`${process.env.PUBLIC_URL}/menu/:title`} component={MenuForm}/>   */}
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/new`}
                      component={MenuForm}
                    />

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu`}
                      component={Menus}
                    />
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/menu/:title`}
                      component={Menus}
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
                      component={Design}
                    />

                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}/products`}
                      component={Products}
                    />

                  </Layout>
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
  //<FirebaseContext.Provider value={new Firebase()}>
  <Root />,
  /* </FirebaseContext.Provider>*/ document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
