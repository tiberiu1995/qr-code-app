import React, { useState } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Box, Button, Divider, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import { BlurOn, Create, Dashboard, Fastfood } from '@material-ui/icons';
import { Transition } from 'react-transition-group';
import { useEffect } from 'react';

const useStyles = makeStyles(theme => ({
  container: {
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: [[0, 12, 12, 0]],
    border: '1px solid rgba(0, 0, 0, 0.23)',
    background: 'rgb(241,241,241)',
    left: 0,
    zIndex: 1000,
    '& .MuiButton-root': {
      margin: 8,
      padding: 0,
      minWidth: 24,
    },
    '& .MuiButton-label': {
      display: 'flex'
    }
  },
  transition: {
    transition: `all 2000ms ease-in-out 0ms`,
    width: 'max-content',
    position: 'absolute',
    background: 'rgb(241,241,241)',
    padding: '0.5rem',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderLeft: '0px solid white',
    left: -300,
  },
  entered:  { left: 25},
  exiting: {left: -300}

}));


 

const Header = (props) => {
  const {formatMessage} = props.intl;
  let [index, setIndex] = useState(-1);
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

  const onMouseLeave = () => setIndex(-1);

  const onMouseEnter = (e,v) => setIndex(v);

  useEffect(()=>{
    console.log('mount');
    return console.log('unmount');
  },[]);
  
  const Item = ({path, text, value, icon}) => 
  <Button key={"4d"+value} onClick={path} onMouseEnter={(e)=>onMouseEnter(e,value)} >
      {icon}
      <Transition timeout={5000} in={index===value}> 
      { state => (
        <Typography className={classes.transition+' '+classes[state]} >
          {text}
        </Typography> )}
      </Transition>
    </Button>

  return <Paper elevation={2}>
  <Box 
    display="flex" 
    justifyContent="center" 
    flexDirection="column"
    flexWrap="wrap"
    position="fixed"
    onMouseLeave={onMouseLeave}
    className={classes.container} >
    {[
      [goHome,"Build",0,<Dashboard/>],
      [showCategories,"Categories",1,<Fastfood/>],
      [showItems,"Products",2,<Fastfood/>],
      [showDesign,"Design",3,<Create/>],
      [showQr,"QR Code",4,<BlurOn/>]
    ].map((el,i) =>
      <>
      <Item key={"4d"+i} path={el[0]} text={el[1]} value={el[2]} icon={el[3]} />
      <Divider key={"4dgn"+i} />
      </>
    )}    
    </Box>
  </Paper>
}

export default compose(withRouter)(injectIntl(Header));


