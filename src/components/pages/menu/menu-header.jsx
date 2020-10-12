import React from 'react';
import { Button } from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
const Header = (props) => {
    const goHome = () => {
        props.history.push(`/menu/${props.match.params.title}/`);
    }

    const showCategories = () => {
        props.history.push(`/menu/${props.match.params.title}/categories/`);
      };
    
      const showItems = () => {
        props.history.push({
          pathname: `/menu/${props.match.params.title}/items/`
        });
      };
    
      const showDesign = () => {
        props.history.push(`/menu/${props.match.params.title}/design/`);
      };

return <>
    <Button className="m-2" onClick={goHome}>
        Acasa
    </Button>
    <Button className="m-2" onClick={showCategories}>
        Categorii
    </Button>
    <Button className="m-2" onClick={showItems}>
        Produse
    </Button>
    <Button className="m-2" onClick={showDesign}>
        Design
    </Button>
    </>
}

export default compose(withRouter)(Header);


