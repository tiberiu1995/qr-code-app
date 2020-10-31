import React from "react";
//import {ReactTable} from 'react-table';
//import { ToastContainer, toast } from 'react-toastify';
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import Table from "./table.jsx";
//import Select from '../../select.jsx';
import { Edit, Delete } from '@material-ui/icons/';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  edit: {
      color: '#4caf50',
  },
  delete: {
    color: '#f44336',
  }
}));


export const Datatable = (props) => {
  const classes = useStyles();
  const { edit, myData, remove } = props;

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const columns = [];
  for (var key in myData[0]) {
    let column = {
      Header: <b>{capitalize(key.toString())}</b>,
      accessor: key,
      style: { textAlign: "center" },
    };
    if (key === "pictures") {
      column.Cell = ({ cell: { value } }) => (
        <img alt="" src={value[0].img} width="100px" />
      );
    }
    key !== "id" && columns.push(column);
  }
  columns.push({
    id: "move",
    accessor: (str) => "Move",
    Cell: (row) => (
      <>
        <Edit
          className={classes.edit}
          size="small"
          color="primary"
          onClick={() => {
            if (window.confirm("Are you sure you wish to delete this item?")) {
              remove(row.row.original);
            }
          }}
        />
        <Delete
          className={classes.delete}
          size="small"
          color="primary"
          onClick={() => {
            if (window.confirm("Are you sure you wish to edit this item?")) {
              edit(row.row.original);
            }
          }}
          />
      </>
    ),
    style: { textAlign: "center" },
    disableSortBy: true,
  });
  return <Table data={myData} columns={columns} />;
};

export default compose(withRouter, connect(null))(Datatable);
