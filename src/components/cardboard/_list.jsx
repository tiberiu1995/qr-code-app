import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Button,
  Checkbox,
  ListItemText,
  ListItemIcon,
  ListItem,
  List,
  Grid,
} from "@material-ui/core/";

const CustomList = (props) => {
  return (
    <Paper className="">
      <List dense component="div" role="list">
        {props.data &&
          props.data.map((el) => {
            const labelId = `transfer-list-item-${el.id}-label`;

            return (
              <ListItem
                key={el.id}
                role="listitem"
                button
                onClick={(e) => props.handleToggle(el.id)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={props.checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={el.name} />
              </ListItem>
            );
          })}
        <ListItem />
      </List>
    </Paper>
  );
};

export default CustomList;
