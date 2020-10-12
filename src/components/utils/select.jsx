import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@material-ui/core/";
import { ig } from "fetch-instagram";

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  root:{
    '& label.MuiFormLabel-root':{
      backgroundColor: '#fff',
      marginLeft: '-5px',
      padding: '0 6px',
    }
  }
}))


const CustomSelect = (props) => {
  const classes = useStyles();
  const display = (el) => (props.display ? props.display(el) : el);
  const valueF = (el) => (props.valueF ? props.valueF(el) : el);
  return (
    <FormControl className={classes.root} variant="outlined">
      {props.label && <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>}
      <Select name={props.name} value={props.value} onChange={props.onChange}>
        {props.default && (
          <MenuItem value={props.default.value}>{props.default.text}</MenuItem>
        )}
        {props.array &&
          props.array.map((el, i) => (
            <MenuItem key={valueF(el)} value={valueF(el)}>
              {display(el)}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
