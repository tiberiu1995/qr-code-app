import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { Box } from '@material-ui/core';

// const useStyles = makeStyles((props) => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     overflow: 'hidden',
//     //backgroundColor: theme.palette.background.paper,
//   },
//   title: props.style,
//   gridList: {
//    // width: 500,
//     //height: 450,
//   },
//   icon: {
//     color: 'rgba(255, 255, 255, 0.54)',
//   },
// }));


const useStyles = makeStyles({
    title: {
        color: props => props.color,
        size: props => props.size,
        font: props => props.font,
        textAlign: 'center'
    },
  });

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */
const TitlebarGridList = (props) => {
  let classes = useStyles(props.style);
  const cols = props.category ? 2 : 1;
  //const [refs, setRefs] = useRef(
    let x = [props.data.map(el => React.createRef())] //);


  //classes.title = {color: "#454545"};//, fontFamily: "#cc00a0", fontSize: 30};

  return (
    <div className={classes.root}>
    <Box>
      <GridList cols={cols} cellHeight={180} spacing={0} className={classes.gridList}>
        {props.data.map((tile,i) => (
          <GridListTile style={null}>
            {props.category && <a href={"#"+i} style={{width: '100%', height: '100%', position: 'absolute', zIndex: 1000}} onClick={(e) => e.preventDefault()}/>}
            <img ref={x[i]} imgFullWidth src={tile.picture} alt={tile.name} />
            <GridListTileBar
              title={tile.name}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              //style={{color: "#cc00a0", fontFamily: "#cc00a0", fontSize: 30}}
             // className="text-center"
            //   actionIcon={
            //     <IconButton aria-label={`info about ${tile.name}`} className={classes.icon}>
            //       <InfoIcon />
            //     </IconButton>
            //   }
            />
          </GridListTile>
        ))}
      </GridList>   
    </Box>
    </div>
  );
}

export default TitlebarGridList;