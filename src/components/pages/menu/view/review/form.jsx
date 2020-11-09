import React, { Component, Fragment, useState, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
import { TextField, FormLabel, Box, Typography } from "@material-ui/core";
import { Star, StarBorder, KeyboardBackspace } from "@material-ui/icons";
import { Button } from '@material-ui/core/';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import AverageRating from './../rating-stars';
import { Rating } from '@material-ui/lab/';
import { injectIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  pointerCursor: {
    cursor: 'pointer'
  },
  edit: {
      backgroundColor: '#4caf50',
      color: 'white',
  },
  delete: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  disabled: {
    opacity: 0.5,
    pointerEvents: 'none'
  },
  modal: {
    '& .MuiTextField-root': {
      width: '100%'
    }
  },
}));

const Form = (props) => {
    const classes = useStyles();
    let [name, setName] = useState('');
    let [rating, setRating] = useState(0);
    let [text, setText] = useState('');
    let [error, setError] = useState(false);
    let [validator] = new useState(new SimpleReactValidator());
  
    const setStateFromInput = (event) => {
      let { name, value } = event.target;
      switch (name) {
        case 'name':
          setName(value);
          break;
        case 'text':
          setText(value);
          break;
        default:
          console.log('no case');
      }
    }

    const handleRating = (event, value) => {
      value && setRating(value);
      console.log('rating '+ value)
    }

    const submit = (event) => {
        event.preventDefault();
        if (!validator.allValid()) {
          validator.showMessages();
          setError(!validator.allValid());
          return "";
        }
        props.submit({
          name,
          rating,
          text
        });
    }

    const {intl: {formatMessage}} = props;
    return (
      <>
      <Box m={2} className={classes.modal}>
        <Typography variant="h5">
          {formatMessage({id: 'write_review'})}
        </Typography>
        <Box display="flex" flexDirection="column">
          <div className="form-group my-1">
              <Rating
                name="rating"
                value={rating}
                onChange={handleRating} />
                { validator.message(
                  "rating",
                  rating,
                  "required|numeric|min:1,num"
                )}
                {/* <AverageRating data={rating} key={"_f"} onClick={handleRating} />   */}
          </div>
          <div className="form-group mb-3">
              <TextField
                label={formatMessage({id: 'name'})}
                name="name"
                value={name} variant="outlined"
                onChange={setStateFromInput}
              />
              { validator.message(
                "name",
                name,
                "required|string"
              )}
          </div>           
          <div className="form-group my-1">
              <TextField
                label={formatMessage({id: 'comment'})}
                name="text"
                value={text}
                variant="outlined"
                onChange={setStateFromInput}
              />
              { validator.message(
                "text",
                text,
                "required|string"
              )}
          </div>
          <Box align="center" mt={1}>
            <Button variant="contained" className={classes.edit} onClick={submit}>{formatMessage({id: 'send'})}</Button>
          </Box>      
        </Box>    
      </Box>
      </>
    );

}

export default 
compose(
    withRouter
)(injectIntl(Form));