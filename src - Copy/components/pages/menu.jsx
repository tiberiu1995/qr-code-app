import React, { Component,Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import SimpleReactValidator from 'simple-react-validator';
import { compose } from 'recompose';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl';
import { withFirebase } from '../firebase';
import Product from '../menu/product';
import Button from "react-bootstrap/Button";

export class Menu extends Component {
    constructor(props) {
        super(props)
        this.edit = false;
        this.state = {
            //validator : new SimpleReactValidator(),
            products: [],
            show_form : false,
        }
    }

    componentDidMount() {
        //let search = window.location.search;
        //let params = new URLSearchParams(search);
       // this.id = params.get('id');
      const title = this.props.match.params.id;
        if(title) 
          this.fetchMenu(title);
        if(this.props.location.state)
          this.setState(this.props.location.state);
    }
 
    fetchMenu = async title => {
      try{
        let response = await fetch('https://bathtimestories.com/apim/menu/get.php/?title='+title);
        let data = await response.json();
        console.log(data);
        this.setState({
          products: data.products,
          categories: data.categories.map(i => i.category),
        });
      } catch(error) {
          console.error(error);
      }
    }


    getContent = (HTML) => {
      var tmp = document.createElement('span');
      tmp.innerHTML = HTML;
      return tmp.textContent;
    }

    render() {
        //this.state.products && (document.querySelector(".loader-wrapper").style = "display: none");
        return (
          <>
          <div className="my-1 mx-auto display-menu">
            {
              this.state.categories && this.state.categories.map(i =>
              <div>
                <div dangerouslySetInnerHTML={{__html: i}}/>
              { this.state.products && this.state.products.filter(j => j.category === i).map(j => 
                <div key={j.id} className="row col-12 col-sm-12 col-lg-10 m-2">
                  <div className="col-8 col-sm-8">
                    <div dangerouslySetInnerHTML={{__html: j.name}} />
                    <div dangerouslySetInnerHTML={{__html: j.description}}/>
                    <div dangerouslySetInnerHTML={{__html: j.ingredients}}/>
                    <div dangerouslySetInnerHTML={{__html: j.size}}/>
                  </div>
                  <div className="col-4 col-sm-4">
                    <img width="100%" src={j.pictures[0] ? j.pictures[0].img : ''}/>
                  </div>
                </div>
                )
              }
              </div>
              )
            }
          </div>
          </>

        )
    }
}


/*const mapStateToProps = (state) => ({

})*/

export default compose(
  withFirebase,
  connect(
    null
  )
)(injectIntl(Menu))

