import React, { Component, Fragment, useState } from 'react';
//import {ReactTable} from 'react-table';
//import { ToastContainer, toast } from 'react-toastify';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { injectIntl  } from "react-intl";
import { Link, withRouter } from 'react-router-dom';
import {MenuItem} from '@material-ui/core/';
import Table from './table.jsx';
import Select from '../utils/select.jsx';

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
      <Select 
          default={{value: "", text: "Toate"}}
          value={filterValue}
          onChange={e => { setFilter(e.target.value || undefined)}}
          array={options}
        />  
  )
}


export const Datatable = (props) =>  {

    const {edit, myData, remove, hideFilters} = props;

    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const columns = [];
    for (var key in myData[0]) {
        let column = {
            Header: <b>{capitalize(key.toString())}</b>,
            accessor: key,
            //sortType: (key =="id") ? 'basic' : 'alphanumeric',
            width: 10,
            filterable: true,
            style: { textAlign: 'center' }
        }
        if(key === "pictures") {
          column.Cell =  ({ cell: { value }}) => ( <img src={value[0].img} width='100px' /> );
          column.filterable = false;
        }
        if(key === "picture" || key === "background") {
          column.Cell =  ({ cell: { value }}) => ( <img src={value} width='100px' /> );
          column.filterable = false;
        }        
        if(key === "id"){
          column.filterable = false;
        }
        if(key === "category") {
          column.Filter = SelectColumnFilter;
          column.filter = 'includes';
        }
        columns.push(column);
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
      <Table data={myData} hideFilters={hideFilters} columns={columns} />
    )
}

export default compose(
  withRouter,
  connect(null)
  )(Datatable)
