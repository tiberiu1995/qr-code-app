import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { Tab, Tabs, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";


const CustomTabs = (props) =>{
    let {classes, value, onChange, tabLabel, children} = props;
    return <><Tabs
    className={classes}
    //classes={classes.x}
    scrollButtons="on"
    value={value}
    onChange={onChange}
    aria-label="simple tabs example">
    { tabLabel.map((el,i) => 
        <Tab key={'ct_tb'+i} label={el} />
    )}
    </Tabs>
    {children}
    </>
}

export default CustomTabs;