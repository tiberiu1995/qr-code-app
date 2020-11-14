import React from 'react';
import { Box, Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import { useState } from 'react';

const getStyle = makeStyles(theme => ({
  row: {
    minHeight: 300,
    padding: '10vh 10vw',  
    '& h4': {
      margin: '32px auto',
    },
    [theme.breakpoints.down('md')]:{
      flexDirection: 'column',
      '& p': {
        textAlign: 'center'
      }
    }
  },
  odd: {
    background: '#27323e',
    '& p,svg,h4': {
      color: 'white'
    }
  },
  left: {
    [theme.breakpoints.up('md')]:{
      width: '40%',
    },
    alignSelf: 'center'
  },
  right: {
    [theme.breakpoints.up('md')]:{
      width: '60%',
    },
    alignItems: 'center'
  },
  imgContainer: {
    '& img': {
      width: '90%',
      margin: 'auto'
    },
  },
  advantages: {
    '& .MuiSvgIcon-root': {
      margin: 16,
      '& + .MuiTypography-root': {
        alignSelf: 'center'
      }
    },
  },
  container: {
    flexWrap: 'wrap',
    '& > .MuiBox': {
      flex: '0 0 50%'
    }
  },
  stepper: {
    background: 'transparent',
    '& .MuiStepIcon-completed': {
      color: '#4caf50',
    }
  }

}))




function getSteps() {      
  return ['Create a free trial account and test features', 'Build your digital menu and generate your QR code', 'Print QR code and share with customers'];
}

const Home = (props) => {
  const classes = getStyle();
  const steps = getSteps();
  const [state, setState] = useState({
    easyIndex: 0,
    easyLength: 4
  })

  const goPrev = () => {
    setState({
      ...state, 
      easyIndex: state.easyIndex > 0 ? state.easyIndex-1 : state.easyLength-1 });
  }

  const goNext = () => {
    setState({
      ...state, 
      easyIndex: state.easyIndex < state.easyLength-1 ? state.easyIndex+1 : 0 });
  }

  return <Box >

    <Box display="flex" className={[classes.row, classes.odd, classes.easy].join(' ')}>
      <Box className={classes.left} display="flex" flexDirection="column">
        <Typography variant="h4" align="center" gutterBottom>
          Easy to create
        </Typography>
        <Typography variant="body1" gutterBottom>
          Creating a digital menu has never been so simple. 
        </Typography>
        <Typography variant="body1" gutterBottom>
          Build your categories, products and voila, a QR code will be generated for the digital menu.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Customers can simply scan the QR code code to load the menu in their devices and see the offer. 
        </Typography>
      </Box>
      <Box display="flex" className={[classes.right,classes.imgContainer].join(' ')}>
        <NavigateBefore fontSize="large" onClick={goPrev} />
        <Box>
          <img style={{display: (state.easyIndex == 0 ? 'inherit' : 'none') }} alt="" src="https://menu.bathtimestories.com/assets/images/3.jpg"/>
          <img style={{display: (state.easyIndex == 1 ? 'inherit' : 'none') }} alt="" src="https://menu.bathtimestories.com/assets/images/4.jpg"/>
          <img style={{display: (state.easyIndex == 2 ? 'inherit' : 'none') }} alt="" src="https://menu.bathtimestories.com/assets/images/1.jpg"/>
          <img style={{display: (state.easyIndex == 3 ? 'inherit' : 'none') }} alt="" src="https://menu.bathtimestories.com/assets/images/2.jpg"/>
        </Box>
        <NavigateNext fontSize="large" onClick={goNext} />
      </Box>  
    </Box>

    <Box display="flex" className={[classes.row].join(' ')} >
      <Box display="flex" className={[classes.imgContainer,classes.right].join(' ')} >
        <img alt="" src="https://menu.bathtimestories.com/assets/images/1185.png" />
      </Box>
      <Box className={classes.left}>
        <Typography variant="h4" align="center" gutterBottom>
          Intuitive admin panel
        </Typography>
      </Box>
    </Box>

    <Box display="flex" className={[classes.row,classes.odd].join(' ')} >
      <Box className={classes.left}>
        <Typography variant="h4" align="center" gutterBottom>
          Multiple layouts to choose from and customise
        </Typography>
      </Box>
      <Box display="flex" className={[classes.imgContainer,classes.right].join(' ')} >
        <img alt="" src="https://menu.bathtimestories.com/assets/images/thumb-phones.png" />
      </Box>
    </Box>

    <Box display="flex" className={[classes.row].join(' ')}>
      <Box display="flex" flexDirection="column" className={[classes.imgContainer,classes.left].join(' ')} >
        <img style={{marginBottom: 8}} alt="" src="https://menu.bathtimestories.com/assets/images/logo-Layout 3.png"/>
        <Typography variant="body1" align="center" gutterBottom>
          Scan the QR code to see the menu template
        </Typography>
      </Box>
      <Box className={classes.right} alignSelf="center">
        <Typography variant="h4" align="center" gutterBottom>
          No need to reprint the QR code
        </Typography>
        <Typography variant="body1" gutterBottom>
          You don't need to worry about your QR code once you print it. You can make as many edits to your menu because once it's updated, your QR code will point to the latest version of your menu. 
        </Typography>
        <Typography variant="body1" gutterBottom>
          Not only you avoid managing the age-old paper menus but you also save time and efforts too. Changing prices, adding a new picture or a seasonal dish? Just enter your admin panel and after some clicks, anyone can see the new menu.  
        </Typography>
      </Box>
    </Box>

    <Box className={[classes.row, classes.odd, classes.advantages].join(' ')}>
      <Typography variant="h4" align="center">
        Advantages
      </Typography>
        <Box display="flex">
          <CheckCircleOutline/>
          <Typography variant="body1">
            User-friendly interface with various tools for adding, editing and deleting products and categories.
          </Typography>
        </Box>
        <Box display="flex">
          <CheckCircleOutline/>
          <Typography variant="body1">
            Multiple layouts to choose from.
          </Typography>
        </Box>
        <Box display="flex">
          <CheckCircleOutline/>
          <Typography variant="body1">
            Tools for customising your menu.
          </Typography>
        </Box>
        <Box display="flex">
          <CheckCircleOutline/>
          <Typography variant="body1">
            Reviews panel for both your restaurant and each of your product.
          </Typography>
        </Box>
        <Box display="flex">
          <CheckCircleOutline/>
          <Typography variant="body1">
            Detailed information and photo of each product
          </Typography>
        </Box>
        <Box display="flex">
          <CheckCircleOutline/>
          <Typography variant="body1">
            No need to download any App
          </Typography>
        </Box>        
       

    </Box>
  </Box>
}


export default Home;
