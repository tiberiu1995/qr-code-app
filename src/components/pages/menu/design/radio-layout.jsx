import React from 'react';
import { Box, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormLabel } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  radioLabel: {
      '& .MuiFormControlLabel-root': {
        margin: 4
      }
  }
}));

const CustomRadio = (props) => {
  return <>
    <Radio {...props}  style={{display:'none'}} />
    <img 
    style={{opacity: (props.selected ? 1 : 0.4) }}
    width="50" 
    src={"https://menu.bathtimestories.com/assets/images/"+props.src+".png" }
    alt=""/>
  </>
}

const Layout = ({layout, handleLayoutChange, contentType, handleVariantChange}) => {
  const classes = useStyles();
  return  <Box className={classes.radioLabel} mb={2} display="flex" flexDirection="column"/*display={{ xs: "block", sm: "none", md: "block" }}*/ >
      <FormControl component="fieldset">
        <FormLabel>Choose main layout</FormLabel>
        <RadioGroup 
          aria-label="layout" 
          row
          name="layout" 
          value={layout} 
          onChange={handleLayoutChange}>
          <FormControlLabel 
            
            value="0"
            control={<CustomRadio selected={"0"=== layout} src="l1"/> } />
          <FormControlLabel
             
            value="1" 
            control={<CustomRadio selected={"1"=== layout} src="l3"/> } />
          <FormControlLabel 
            
            value="2" 
            control={<CustomRadio selected={"2"=== layout} src="l5"/> } />
          <FormControlLabel 
            
            value="3" 
            control={<CustomRadio selected={"3"=== layout} src="l7"/> } />
          <FormControlLabel
             
            value="4" 
            control={<CustomRadio selected={"4"=== layout} src="l8"/> }/>                        
        </RadioGroup>
      </FormControl>
      <Box display="flex" justifyContent="space-evenly">
      { layout === "0" ?
        <FormControl component="fieldset">
          <FormLabel>Choose variant</FormLabel>
          <RadioGroup 
            style={{justifyContent:"center"}}
            row
            aria-label="layout" 
            name="contentType" 
            value={contentType} 
            onChange={handleVariantChange}>
            <FormControlLabel                
              value="h0b0" 
              control={<CustomRadio selected={contentType === "h0b0"} src="l1"/> } />
            <FormControlLabel        
              value="h0b1" 
              control={<CustomRadio selected={contentType === "h0b1"} src="l2"/> }  />
          </RadioGroup>
        </FormControl> : '' }
      { layout === "1" ?
        <FormControl component="fieldset">
          <FormLabel>Choose variant</FormLabel>
          <RadioGroup 
            row
            style={{justifyContent:"center"}}
            aria-label="layout" 
            name="contentType" 
            value={contentType} 
            onChange={handleVariantChange}>
            <FormControlLabel
                
              value="h1b0" 
              control={<CustomRadio selected={contentType === "h1b0"} src="l3"/> }  />
            <FormControlLabel
                
              value="h1b1" 
              control={<CustomRadio selected={contentType === "h1b1"} src="l4"/> }  />
          </RadioGroup>
        </FormControl> : ''}
      { layout === "2" ?
        <FormControl component="fieldset">
          <FormLabel>Choose variant</FormLabel>
          <RadioGroup 
            style={{justifyContent:"center"}}
            row
            aria-label="layout" 
            name="contentType" 
            value={contentType} 
            onChange={handleVariantChange}>
            <FormControlLabel 
               
              value="h3b0" 
              control={<CustomRadio selected={contentType === "h3b0"} src="l5"/> }  />
            <FormControlLabel 
               
              value="h3b1" 
              control={<CustomRadio selected={contentType === "h3b1"} src="l6"/> }  />
          </RadioGroup>
        </FormControl> : ''}     
      { layout === "3" ?
        <FormControl component="fieldset">
          <FormLabel>Choose variant</FormLabel>
          <RadioGroup 
            style={{justifyContent:"center"}}
            row
            aria-label="layout" 
            name="contentType" 
            value={contentType} 
            onChange={handleVariantChange}>
            <FormControlLabel 
               
              value="h4b4" 
              control={<CustomRadio selected={contentType === "h4b4"} src="l7"/> } />
          </RadioGroup>
        </FormControl> : ''}     
      { layout === "4" ?
        <FormControl component="fieldset">
          <FormLabel>Choose variant</FormLabel>
          <RadioGroup 
            style={{justifyContent:"center"}}
            row
            aria-label="layout" 
            name="contentType" 
            value={contentType} 
            onChange={handleVariantChange}>
            <FormControlLabel
               
              value="h5b2" 
              control={<CustomRadio selected={contentType === "h5b2"} src="l8"/> }  />
          </RadioGroup>
        </FormControl> : ''} 
                                                                                  
      </Box>                     
      {/* <Typography align="center" gutterBottom  component="h6"> </Typography>
      <Select
            //style={{width: 185, textAlign: 'left'}}
            name="contentType"
            label="Layout"
            value={contentType}
            onChange={setStateFromInput}
            array={layoutArray}
            display={(val) => "Layout "+(layoutArray.indexOf(val)+1)}
          /> */}
    </Box> 
}

export default Layout