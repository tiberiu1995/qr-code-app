import React from 'react';
import { Button } from '@material-ui/core';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { Paper } from '@material-ui/core';
import { BlurOn, Create, Dashboard, Fastfood} from '@material-ui/icons';
const useStyles = makeStyles(theme => ({
  container: {
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: [[0, 25, 25, 0]],
    border: '1px solid rgba(0, 0, 0, 0.23)',
    background: 'rgb(241,241,241)',
    left: 0,
    zIndex: 1000
  }

}));


const Header = (props) => {
  const {formatMessage} = props.intl;
  const classes = useStyles();
  const goHome = () => {
    props.history.push(`/menu/${props.match.params.title}/`);
  }
  const showCategories = () => {
    props.history.push(`/menu/${props.match.params.title}/categories/`);
  }
  const showItems = () => {
    props.history.push({
      pathname: `/menu/${props.match.params.title}/items/`
    });
  }
  const showDesign = () => {
    props.history.push(`/menu/${props.match.params.title}/design/`);
  }
  const showQr = () => {
    props.history.push(`/menu/${props.match.params.title}/qr-code/`);
  }

  return <Paper elevation={2}>
  <Box 
    display="flex" 
    justifyContent="center" 
    flexDirection="column"
    flexWrap="wrap"
    position="fixed"
    className={classes.container}
    >
    <Button onClick={goHome}>
      <Dashboard/>
    </Button>
    <Button onClick={showCategories}>
      <Fastfood/>
    </Button>
    <Button onClick={showItems}>
      <Fastfood/>
    </Button>
    <Button onClick={showDesign}>
      <Create/>
    </Button>
    <Button onClick={showQr}>
      <BlurOn/>
    </Button>    
    </Box>
  </Paper>
}

export default compose(withRouter)(injectIntl(Header));


