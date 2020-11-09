import React, { Component,  useState} from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { FormLabel, FormControl, FormControlLabel, RadioGroup, Radio, Typography, TextField, Button, Box, } from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons/';
import { addProduct } from './../../../../actions/index';

const initState = {
  validator: new SimpleReactValidator(),
	quantity: 1,
	option: "0",
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
	const { classes, show, onCancel, id, intl: {formatMessage}, products } = props;
	const [state, setState] = useState(initState);
	const el = products.find(el => el.id == id);

  const setStateFromInput = (event) => {
    setState({...state, [event.target.name]: event.target.value });
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!state.validator.allValid()) {
      state.validator.showMessages();
      return "";
    }
    const data = {
		product: el.id,
		quantity: state.quantity,
		option: state.option
    };
		setState(initState);
		console.log(data);
    	props.addItem(data);
	};
	
	const remove = () => {
		state.quantity > 1 && setState({...state, quantity: state.quantity-1})
	}

	const add = () => {
		setState({...state, quantity: state.quantity+1})
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
          <Modal.Title id="contained-modal-title-vcenter">{el && el.name}</Modal.Title>
        </Modal.Header>
        <ModalBody className="p-3">
					{ el && 
						<Box>
							<Typography  >
							{el.ingredients} 
							</Typography>
							<FormControl component="fieldset">
								<RadioGroup 
									className={classes.formGroup}
									row 
									aria-label="option"  
									name="option" 
									value={state.option} 
									onChange={setStateFromInput}>
									{	el.size.map((el,i) =>
										<FormControlLabel value={i+""} control={<Radio />} label={el.size+" "+el.price} />
									)								
									}
								</RadioGroup>
							</FormControl>
							{state.validator.message(
								"option",
								state.option,
								"required"
							)}
							<Box>
								<Remove onClick={remove} />
								<TextField label="Quantity" name="quantity" value={state.quantity} variant="outlined" onChange={setStateFromInput} />
								<Add onClick={add} />
								{state.validator.message(
									"quantity",
									state.quantity,
									"required|numeric|min:1,num"
								)}
							</Box>
						</Box>}
        
         
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

const mapStateToProps = (state) => ({products: state.cart.products})

export default compose(
	withStyles(useStyles),
	connect(mapStateToProps),
	)(injectIntl(Form));
