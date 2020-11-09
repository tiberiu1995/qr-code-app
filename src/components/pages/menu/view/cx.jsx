import React from 'react';
import { Box, Slide } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Fade } from '@material-ui/core';
import { Grow } from '@material-ui/core';

import { Transition } from 'react-transition-group';
import { compose } from 'redux';
import { connect } from 'react-redux';

const Cx = ({el, style, boxStyle, children, onClick, fade, index, media, className, h3, b4}) => {
  const height =  (media.mobile ? 100 : (media.tablet ? 150 : 150));
  const defaultStyle = (duration, delay) => ({
    transition: `all ${duration}ms ease-in-out ${delay}ms`,
  })

  const transitionStyles = ({
    h4: {    
      entered:  { opacity: 1, height: height, },
      exiting: { display: 'none' },
      exited: {display: 'inherit'}
    },
    b4: {
      entering: { display: 'flex'},
      entered:  { display: 'flex', opacity: 1, maxHeight: 300 },
      exiting: { display: 'none' },
      exited: { maxHeight: 0}
    }
  });


  
  if(b4)
    return <Transition
    in={fade}
    timeout={0}>
    { state => 
        <Box 
          display="flex"
          flexDirection="row"
          onClick={onClick}
          className={className}
          style={{
            ...style,
            ...defaultStyle(500, index*500),
            display: 'none',
            opacity: 0,
            maxHeight: 0,
            ...transitionStyles.b4[state] }}
          key={'_b4'+el.id}>
            <img style={{height: 100}} src={el.picture}/>
            <Box        
              display="flex" 
              p={1}
              style={{flex: '1 1 auto'}}       
              justifyContent="center"
              flexDirection="column" >
              {children}
            </Box>
          </Box> }
    </Transition>;

  if(h3)
    return <Box 
      onClick={onClick}
      className={className}
      style={style}
      key={'_b4'+el.id}>
        { index%2 == 0 ? <img alt="" src={el.picture}/> : '' }
        <Box        
          display="flex"
          style={{...boxStyle, height: '100%', /*background: 'rgba(0,0,0,0.5)'*/}}
          justifyContent="center"
          flexDirection="column"
          alignItems="center">
          {children}
        </Box>
        { index%2 == 1 ? <img alt="" src={el.picture}/> : '' }
      </Box>;

  return <Transition
    in timeout={2000}>
    {state => 
    <Box 
      onClick={onClick}
      className={className}
      style={{
        height: height, 
        ...defaultStyle(2500, index*1500),
        opacity: 1,
        ...transitionStyles.h4[state],
        backgroundImage: 'url(' + el.picture + ')', 
        backgroundPosition: 'center',
        ...style}}
      key={'_b4'+el.id}>
        <Box        
          display="flex"
          style={{...boxStyle, height: '100%', /*background: 'rgba(0,0,0,0.5)'*/}}
          justifyContent="center"
          flexDirection="column"
          alignItems="center">
          {children}
        </Box>
      </Box>}
  </Transition>

}

const mapStateToProps = (state) => ({
  media: state.media
})

export default compose(connect(mapStateToProps))(Cx);