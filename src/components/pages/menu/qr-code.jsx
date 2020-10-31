import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { Box, Button, FormControl, FormLabel, Slider, Typography } from '@material-ui/core';
import Header from './menu-header.jsx';
import { makeStyles } from '@material-ui/core/styles';
import FileInput from './../../utils/FileInput';

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.down('sm')]: {
    content: {
      flexDirection: 'column'
    }
  },
  container: {
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)'
    },
    '& .MuiButton-root': {
      marginTop: 16
    },
    '& .MuiFormControl-root': { 
        '& .MuiFormLabel-root': {
          position: 'absolute', 
          background: 'white'
        },
        '& input': {
        width: 121,
        height: 40,
        margin: 8,
        borderColor: 'rgba(0, 0, 0, 0.23)'
      }
    }
  }

}));

const QrCode = (props) => {
  const [values, setValues] = useState({
    fgColor: '#00ff00',
    bgColor: '#ffffff',
    scale: 0.5,
    size: 256,
    x: 0,
    y: 0,
    xOffset: 0.5,
    yOffset: 0.5,
  })

  const classes = useStyles();

  const saveImage = () => {
    const canvas = document.getElementById("qr-code-23");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `logo-${props.match.params.title}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const setStateFromInput = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    })
  }

  const handleChange = (event, value, target) => {
    if (target === 'scale'){
      let [w,h] = values.width > values.height ? 
        [ 256, parseInt((values.height/values.width)*256)] :
        [ parseInt((values.width/values.height)*256), 256];
      setValues({
        ...values,
        [target]: value,
        x: parseInt((256-w*values.scale)*values.xOffset),
        y: parseInt((256-h*values.scale)*values.yOffset),
      });
    } 
    else if (target === 'xOffset'){
      let [w,h] = values.width > values.height ? 
        [ 256, parseInt((values.height/values.width)*256)] :
        [ parseInt((values.width/values.height)*256), 256];
      setValues({
        ...values,
        [target]: value,
        x: parseInt((256-w*values.scale)*value),
        y: parseInt((256-h*values.scale)*values.yOffset),
      });
    }
    else if (target === 'yOffset'){
      let [w,h] = values.width > values.height ? 
        [ 256, parseInt((values.height/values.width)*256)] :
        [ parseInt((values.width/values.height)*256), 256];
      setValues({
        ...values,
        [target]: value,
        x: parseInt((256-w*values.scale)*values.xOffset),
        y: parseInt((256-h*values.scale)*value),
      });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleImgChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    var image = new Image();




    reader.onloadend = async () => {
      image.src = reader.result;
      image.onload = async () => {
        let [w,h] = image.width > image.height ? 
          [ 256, parseInt((image.height/image.width)*256)] :
          [ parseInt((image.width/image.height)*256), 256];
        setValues({...values, 
          width: w,
          height: h,
          picture: image.src,
          step: 2.56,
          x: parseInt((256-w*values.scale)*values.xOffset),
          y: parseInt((256-h*values.scale)*values.yOffset),
        })
      }
    };
    reader.readAsDataURL(file);
  }

  const deleteImg = (type) => {
    setValues(...values, {picture: ''})
  }

  return  <Box className={classes.container} align="center" m={2}>
      <Header/>
      <Box className={classes.content} display="flex" justifyContent="center" >
        <Box display="flex" flexDirection="column" m={2}>
          <Box display="flex" justifyContent="space-between">
            <FormControl margin="normal">
              <FormLabel className="MuiInputLabel-outlined MuiInputLabel-shrink">Foreground</FormLabel>
              <input
                name="fgColor"
                label="Foreground"
                type="color"
                onChange={setStateFromInput}
                value={values.fgColor}
              />
            </FormControl>
            <FormControl margin="normal">
              <FormLabel className="MuiInputLabel-outlined MuiInputLabel-shrink">Background</FormLabel>
              <input
                name="bgColor"
                label="Background"
                type="color"
                onChange={setStateFromInput}
                value={values.bgColor}
              />
            </FormControl>
          </Box>
          <Box>
            <Typography align="center" gutterBottom component="h6">
              Size
            </Typography>
            <Slider
              value={values.scale}
              disabled={!values.picture}
              min={0}
              step={0.05}
              max={1}
              scale={(x) => (x*100).toFixed(0) + '%'}
              onChange={(e,v) => handleChange(e,v,'scale')}
              valueLabelDisplay="auto"
              aria-labelledby="linear-slider"
            />
          </Box>
          <Box>
            <Typography align="center" gutterBottom component="h6">
              Horizontal Offset
            </Typography>
            <Slider
              value={values.xOffset}
              disabled={!values.picture}
              min={0}
              step={0.05}
              max={1}
              scale={(x) => (x*100).toFixed(0) + '%'}
              onChange={(e,v) => handleChange(e,v,'xOffset')}
              valueLabelDisplay="auto"
              aria-labelledby="linear-slider"
            />
          </Box>
          <Box>
            <Typography align="center" gutterBottom component="h6">
              Vertical Offset
            </Typography>          
            <Slider
              value={values.yOffset}
              disabled={!values.picture}
              min={0}
              step={0.05}
              max={1}
              scale={(x) => (x*100).toFixed(0) + '%'}
              onChange={(e,v) => handleChange(e,v,'yOffset')}
              valueLabelDisplay="auto"
              aria-labelledby="linear-slider"
            />
          </Box>                   
          <FileInput 
            source={values.picture} 
            onChange={handleImgChange} 
            deleteImg={deleteImg}
            onClick={handleSubmit} />
        </Box>
        <Box display="flex" flexDirection="column" m={2}>
          <QRCode 
            id="qr-code-23"
            level='H'
            size={256}
            bgColor={values.bgColor}
            fgColor={values.fgColor}
            imageSettings={{
              src: values.picture || '',
              height: values.height*values.scale,
              width: values.width*values.scale,
              x: values.x,
              y: values.y
              }
            }
            value={"http://menu.bathtimestories.com/my-menu/"+props.match.params.title}/>
          <Button variant="outlined" onClick={saveImage}>Save Image</Button>
        </Box>
        </Box>
    </Box>;
}

export default QrCode;