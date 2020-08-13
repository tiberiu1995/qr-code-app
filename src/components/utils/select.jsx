import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@material-ui/core/";
import { ig } from "fetch-instagram";

const CustomSelect = (props) => {
  const display = (el) => (props.display ? props.display(el) : el);
  const valueF = (el) => (props.valueF ? props.valueF(el) : el);
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
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
