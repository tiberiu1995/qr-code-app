import React, { Component,  useState} from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import {
  TextField,
  Button,
  Box,
} from "@material-ui/core/";
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { Radio } from '@material-ui/core';

const initState = {
  validator: new SimpleReactValidator(),
  created: new Date().valueOf(),
  name: "",
  description:
    "",
  ingredients:
    "",
  alergens: "",
  calories: "",
  size: "",
  picture: '',
}

const useStyles = theme => ({
  edit: {
      backgroundColor: '#4caf50',
      color: 'white',
  },
  delete: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  [theme.breakpoints.up('md')]: {
    modal: {
      '& .modal-dialog': { minWidth: 600,
      }
    },
  },
});



const Form = (props) => {
  const edit = false;
	const { classes, show, onCancel, data, intl: {formatMessage}, products, cartList } = props;
	const [state, setState] = useState({});

  const setStateFromInput = (event) => {
    var obj = {};
    obj[event.target.name] = event.target.value;
    setState({ [event.target.name]: event.target.value });
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!state.validator.allValid()) {
      state.validator.showMessages();
      return "";
    }
    const data = {
      name: state.name,
      description: state.description,
      ingredients: state.ingredients,
      alergens: state.alergens,
      calories: state.calories,
      size: state.size,
      picture: state.picture,
      category: state.category || props.categories[0],
      id: props.data ? props.data.id : "",
    };
    setState(initState);
    props.addItem(data);
  };


  /*handleChange = (event) => {
    setState({ stock: event.target.value });
  };

  handleEditorChange = (content, editor, name) => {
    setState({ [name]: content });
    //console.log('Content was updated:', content);
  };
  _handleSubmit(e) {
    e.preventDefault();
  }

  _handleImgChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    let picture = '';

    reader.onloadend = async () => {
      const canvas = await crop(reader.result, 1);
      picture = canvas.toDataURL();
      //pictures[i].img = reader.result;
      setState({
        file: file,
        picture,
      });
    };
    reader.readAsDataURL(file);
  }

  deleteImg() {
    setState({picture: ''});
  }*/

  const Element = ({element}) => {
    const product = products.find(el => el.id == element.id);
    return <Box>
      <Typography>
        {element.quantity}x{product.size[element.option].price}
      </Typography>
      <FormControl component="fieldset">
          <RadioGroup 
            className={classes.formGroup}
            row 
            aria-label="option"  
            name="option" 
            value={element.option} 
            onChange={setStateFromInput}>
            {	product.size.map((el,i) =>
              <FormControlLabel value={i+""} control={<Radio />} label={el.size+" "+el.price} />
            )								
            }
          </RadioGroup>
        </FormControl>
    </Box>

  }

    return (
      <Modal
        backdrop="static"
        className={"row d-flex justify-content-center "+classes.modal}
        show={show}
        onHide={onCancel}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Cart</Modal.Title>
        </Modal.Header>
        <ModalBody className="p-3">
        {cartList.map(el =>
          <Element element={el}/>
        )}
        </ModalBody>
        <Modal.Footer>
          <Button className={classes.delete} variant="contained" onClick={onCancel}>
            {formatMessage({id: 'back'})} 
          </Button>
          <Button className={classes.edit} variant="contained" onClick={addItem}>
            {formatMessage({id: 'add'})}
          </Button>
        </Modal.Footer>
      </Modal>
    );

}

const mapStateToProps = (state) => ({
  products: state.cart.products,
  cartList: state.cart.cartList})

export default compose(
	withStyles(useStyles),
	connect(mapStateToProps),
	)(injectIntl(Form));
