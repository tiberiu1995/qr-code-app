import React, { Component, Fragment, useState } from 'react';
//import {ReactTable} from 'react-table';
//import { ToastContainer, toast } from 'react-toastify';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl  } from "react-intl";
import { Link, withRouter } from 'react-router-dom';
import {MenuItem} from '@material-ui/core/';
import Table from './table.jsx';
//import Select from '../../select.jsx';



export const Datatable = (props) =>  {

    const {edit, myData, remove} = props;

    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const columns = [];
    for (var key in myData[0]) {
        let column = {
            Header: <b>{capitalize(key.toString())}</b>,
            accessor: key,
            style: { textAlign: 'center' }
        }
        if(key === "pictures") {
          column.Cell =  ({ cell: { value }}) => ( <img src={value[0].img} width='100px' /> );
        }
        key !== 'id' && columns.push(column);
    }  
    columns.push({
      id: 'move',
      accessor: str => "Move",
      Cell: (row) => (
        <>
           {<span>
            <i className="fa fa-arrows-v" style={{ width: 35, fontSize: 20, padding: 11,color:'black' }}/>
          </span>}
          <span onClick={() => {
              if (window.confirm('Are you sure you wish to delete this item?')) {
                remove(row.row.original);
              }
          }}>
            <i className="fa fa-trash" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }} />
          </span>
           <span onClick={() => {
                if (window.confirm('Are you sure you wish to edit this item?')) {
                  edit(row.row.original);
                }
            }}>
            <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}/>
          </span>
          </>

          ),
      style: { textAlign: 'center' },
      disableSortBy: true
    });           
    return (
      <Table data={myData}  columns={columns} />
    )
}

export default compose(
  withRouter,
  connect(null)
  )(Datatable)
