import React, { Component, Fragment, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import { TextField, FormLabel, Box } from "@material-ui/core";
import { Star, StarBorder, KeyboardBackspace } from "@material-ui/icons";
import { Button } from '@material-ui/core/';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import AverageRating from './../rating-stars';
import { Rating } from '@material-ui/lab/';

const Form = (props) => {
    let [name, setName] = useState('');
    let [rating, setRating] = useState(0);
    let [text, setText] = useState('');
    let [error, setError] = useState(false);
    let [validator] = new useState(new SimpleReactValidator());
    console.log('created');

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
          break;
      }
    }

    // const handleRating = (event) => {
    //   const target = event.target.nodeName === 'svg' ? event.target : event.target.parentElement;
    //   const value = parseInt(target.getAttribute("data-value"))+1;
    //   setRating(value);
    // }

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


    return (
      <>
      <Box mx={2}>
        Lasa o recenzie
        <form className="needs-validation add-product-form">
          <div className="form form-label-center row">
            <div className="form-group my-1 col-lg-12">
              <div className="description-sm">
                <TextField
                  label="Nume"
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
                onChange={(event, newValue) => {
                  setRating(newValue);
                }} />
                {/* <AverageRating data={rating} key={"_f"} onClick={handleRating} />   */}
                { validator.message(
                  "rating",
                  rating,
                  "required|numeric|min:1,num"
                )}
              </div>
            </div>            
            <div className="form-group my-1 col-lg-12">
              <div className="description-sm">
                <TextField
                  label="Comentariu"
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
          <Button variant="contained" color="primary" onClick={submit}>Trimite recenzia</Button>
        </form>
      </Box>
      </>
    );

}

export default 
compose(
    withRouter
)(Form);