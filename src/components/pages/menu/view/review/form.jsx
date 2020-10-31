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


const Form = (props) => {
    let [name, setName] = useState('');
    let [rating, setRating] = useState(0);
    let [text, setText] = useState('');
    let [error, setError] = useState(false);
    let [validator] = new useState(new SimpleReactValidator());
    console.log(rating+'_');
    useEffect(() => {
      console.log("Mount");
      return () => console.log("Unmount");
    }, []);

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
      <Box m={2}>
        <Typography variant="h5">
          {formatMessage({id: 'write_review'})}
        </Typography>
        <form className="needs-validation add-product-form">
          <div className="form form-label-center row">
            <div className="form-group my-1 col-lg-12">
              <div className="description-sm">
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
            </div>
            <div className="form-group my-1 col-lg-12">
              <div className="description-sm">
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
            </div>            
            <div className="form-group my-1 col-lg-12">
              <div className="description-sm">
                <TextField
                  label={formatMessage({id: 'comment'})}
                  name="text"
                  value={text}
                  onChange={setStateFromInput}
                />
                { validator.message(
                  "text",
                  text,
                  "required|string"
                )}
              </div>
            </div>
          </div>
          <Button variant="contained" color="primary" onClick={submit}>{formatMessage({id: 'send'})}</Button>
        </form>
      </Box>
      </>
    );

}

export default 
compose(
    withRouter
)(injectIntl(Form));