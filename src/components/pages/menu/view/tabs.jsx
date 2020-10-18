import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";
import { TextField, FormLabel, Box, FormControl, Divider, Typography, Paper, withStyles, SvgIcon, useMediaQuery, Tabs, RadioGroup, FormControlLabel, Radio } from "@material-ui/core";
import { ChromePicker } from "react-color";
import Select from "../../../utils/select.jsx";
import { Grid, Button, AppBar, Tab } from "@material-ui/core/";
import { fetchData } from "../../../utils/fetch.js";
import { injectIntl } from "react-intl";
import { Save, PhoneAndroid, Smartphone } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Prompt } from 'react-router-dom';
import Header from "../menu-header.jsx";
import { connect } from 'react-redux';
import { compose } from 'redux';
import clsx from 'clsx';
import { setLayout } from './../../../../actions/index';
import FileInput from './../../../utils/FileInput';



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
        <Tab label={el} />
    )}
    </Tabs>
    {children}
    </>
}

export default CustomTabs;