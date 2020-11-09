import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const getStyle = makeStyles(theme => ({
  row: {
    minHeight: 300,
    padding: '10vh 10vw'
    
  },
  odd: {
    background: '#27323e'
  },
  container: {
    flexWrap: 'wrap',
    '& > .MuiBox': {
      flex: '0 0 50%'
    }
  }

}))

const Home = (props) => {
  const classes = getStyle();
  return <Box p={2}>
    <Box className={[classes.row, classes.odd].join(' ')}>
      <Typography variant="h6">
        WHY YOU NEED ___ QR MENU
      </Typography>
      <Typography variant="body1">
        QR menu is the perfect tool for restaurants, cafes, shops and other business types to provide their customers with an attractive QR menu, digital menu and help them order with a few simple clicks from restaurant menu, cafe menu. Amplify your reach, inspire your audience, cut costs and save time all by using this single tool. To begin, follow these steps:
      </Typography>
      *Create a free trial Bonee account and test features
      *Develop an active QR menu with simple tools
      *Publish QR menu and share with customers
    </Box>
    <Box className={classes.row}>
      <Typography variant="h6">
      SCAN OR CLICK ON THE QR CODE AND SEE THE MENU TEMPLATE
      </Typography>
      <img/>
    </Box>
    <Box className={[classes.row, classes.odd].join(' ')}>
      <Typography variant="h6">
        QR MENU ADVANTAGES
      </Typography>
      <Typography variant="body1">
        QR menu is the perfect tool for restaurants, cafes, shops and other business types to provide their customers with an attractive QR menu, digital menu and help them order with a few simple clicks from restaurant menu, cafe menu. Amplify your reach, inspire your audience, cut costs and save time all by using this single tool. To begin, follow these steps:
      </Typography>
        Multifunctional and user-friendly interface with various tools for adding, editing and deleting products
        Making orders by just one click with both cash and card payments
        Tools for hiding unavailable products and activating orders
        Automatic translation of menu on over 25 languages
        Client feedback and social media sharing options
        Detailed information and photo of each product
        Product rating analysis using Google Analytics
        Easily managing orders from the admin portal
        No need to download any App

       * Scan QR code from your phone
       * Check the menu directly on your smartphone
       * Make orders, call waiters and much more
    </Box>
    <Box className={classes.row}>
      <Typography variant="h6">
      FUNCTIONALITIES FOR RESTAURANTSTO BOOST THEIR SALES
      </Typography>
      <Box display="flex" className={classes.container}>
        <Box>
          <Typography variant="subtitle1">
            QR menu easy Updates
          </Typography>
          <Typography variant="body1">
            Update Information in restaurant menu, cafe menu instantly. Change price, add products to menu and also automatically remove sold-out products from cataloge.
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">
            Customization and branding
          </Typography>
          <Typography variant="body1">
            Select the theme template and change the colors of Catalog to match your restaurant menu, cafe menu, shops branding. Create your customized menu with just one click.
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">
            Cost and time saving
          </Typography>
          <Typography variant="body1">
            You don't need to pay a lot of money for the design and printing of an updated menu for your restaurants, cafes, shops. You can update the digital menu with just one click.
          </Typography>
        </Box>
        <Box>
        <Typography variant="subtitle1">
          Hear Your Customer
        </Typography>
        <Typography variant="body1">
          Use our simple feedback system to hear customer requests and observations about your restaurants, cafes, shops. Analyze customer feedback and improve customer satisfaction.
        </Typography>
      </Box> 
      </Box>         
    </Box>
  </Box>
}


export default Home;
