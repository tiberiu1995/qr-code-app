import React, { Component, Fragment, useState } from "react";
//import {ReactTable} from 'react-table';
//import { ToastContainer, toast } from 'react-toastify';
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { MenuItem, useMediaQuery } from "@material-ui/core/";
import Table from "./table.jsx";
import Select from "../utils/select.jsx";
import { Image } from "@material-ui/icons";
import { Tooltip } from '@material-ui/core';

const SelectColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter, id },
}) => {

  const options = new Set();
  preFilteredRows.forEach((row) => {
    options.add(row.values[id]);
  });

  // Render a multi-select box
  return (
    <Select
      label={id}//{formatMessage({id: id})}
      default={{ value: "Toate", text: "Toate" }}
      value={filterValue || "Toate"}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      array={[...options.values()]}
    />
  );
};

const Datatable = (props) => {
  const { edit, myData, remove, hideFilters, intl: { formatMessage} } = props;
  const translate = formatMessage;
  const desktop = useMediaQuery('(min-width:900px)');
  const tablet = useMediaQuery('(min-width:500px) and (max-width:899px)');
  const lt600 = useMediaQuery('(max-width:599px)');
  const mobile = useMediaQuery('(max-width:499px)');
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const columns = [];
  for (var key in myData[0]) {
    if (["description", "ingredients", "alergens", "calories", "id"].includes(key))
      continue;
   // if(matches && !["name", "category", "picture"].includes(key))
   //   continue;
    let column = {
      Header: <b>{capitalize(
        translate({id: key.toString()})
        )}</b>,
      accessor: key,
      width: 10,
      filterable: true,
      style: { textAlign: "center" },
    };
    if (key === "cat_no" || key === "item_no" || key === "id") {
      column.filterable = false;
      column.sortable = false;
    }
    if (key === "category") {
      column.Filter = SelectColumnFilter;
      column.filter = "includes";
    }
    if (key === "picture" || key === "background") {
      column.Cell = ({ cell: { value } }) => (value.includes('jpeg') ? <img src={value} width={mobile ? "50px" : "100px"} /> : <Image/>)
      column.filterable = false;
    }
    columns.push(column);

  }
  columns.push({
    id: "move",
    accessor: (str) => "Move",
    Cell: (row) => (
      <>
        {/* {<span>
            <i className="fa fa-arrows-v" style={{ width: 35, fontSize: 20, padding: 11,color:'black' }}/>
          </span>} */}
        <Tooltip title="Remove this row">
          <span
            onClick={() => {
              if (window.confirm("Are you sure you wish to delete this item?")) {
                remove(row.row.original);
              }
            }}
          >
            <i
              className="fa fa-trash"
              style={{ width: 35, fontSize: 20, padding: 11, color: "#e4566e" }}
            />
          </span>
        </Tooltip>
        <Tooltip title="Edit this row" placement="bottom">
          <span
            onClick={() => {
              if (window.confirm("Are you sure you wish to edit this item?")) {
                edit(row.row.original);
              }
            }}
          >
            <i
              className="fa fa-pencil"
              style={{
                width: 35,
                fontSize: 20,
                padding: 11,
                color: "rgb(40, 167, 69)",
              }}
            />
          </span>
        </Tooltip>
        
      </>
    ),
    style: { textAlign: "center" },
    disableSortBy: true,
  });
  return <Table data={myData} hideFilters={hideFilters} columns={columns} />;
};

export default compose(withRouter, connect(null))(injectIntl(Datatable));
