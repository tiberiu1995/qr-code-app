import React from 'react';
import { Box, Slide } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Fade } from '@material-ui/core';
import { Grow } from '@material-ui/core';

import { Transition } from 'react-transition-group';
import { compose } from 'redux';
import { connect } from 'react-redux';

const Cx = ({el, style, children, onClick, fade, index, media}) => {
  const height =  (media.mobile ? 100 : (media.tablet ? 150 : 200));
  const defaultStyle = (duration, delay, x) => ({
    transition: `all ${duration}ms ease-in-out ${delay}ms`,
    opacity: x[0],
    height: x[1]
  })

  const transitionStyles = ({
    entered:  { opacity: 1, height: height },
    exiting: { display: 'none' },
    exited: {display: 'inherit'}
  });
    
  return <Transition
    in={fade}
    /*onExiting={(a,b)=>{
      a.style.display = 'none';
      a.style.opacity = 0;
    }}*/
    timeout={0}>
    {state => (
    <Box 
      onClick={onClick}
      style={{...style,
        height: height, 
        ...defaultStyle(500, index*500, fade ? [1,height] : [0,0]),
        ...transitionStyles[state],
        //border: '1px solid white',
        backgroundImage: 'url(' + el.picture + ')', 
        backgroundPosition: 'center'}}
      key={'_b4'+el.id}>
        <Box 
          display="flex"
          style={{height: '100%', background: 'rgba(0,0,0,0.5)'}}
          justifyContent="center"
          flexDirection="column"
          alignItems="center">
          {children}
        </Box>
      </Box>)}
  </Transition>

}

const mapStateToProps = (state) => ({
  media: state.media
})

export default compose(connect(mapStateToProps))(Cx);