import React from "react";
//import {ReactTable} from 'react-table';
//import { ToastContainer, toast } from 'react-toastify';
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { MenuItem, useMediaQuery, Tooltip } from "@material-ui/core/";
import Table from "./table.jsx";
import Select from "../utils/select.jsx";
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Edit, Image } from '@material-ui/icons/';

const useStyles = makeStyles(theme => ({
  edit: {
      color: '#4caf50',
  },
  delete: {
    color: '#f44336',
  }
}));

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
      default={{ value: "All", text: "All" }}
      value={filterValue || "All"}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      array={[...options.values()]}
    />
  );
};

const Datatable = (props) => {
  const classes = useStyles();
  const { edit, myData, remove, intl: { formatMessage} } = props;
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
    if (["description", "ingredients", "alergens", "calories", "id", "upload_picture", "library_picture", "image_option"].includes(key))
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
    if (["picture", "background", "pictures"].includes(key)) {
      column.Cell = ({ cell: { value } }) => ((value.includes('jpeg') || value.includes('png')) ? <img src={value} width={mobile ? "50px" : "100px"} /> : <Image/>)
      column.filterable = false;
      column.sortable = false;
    }
    columns.push(column);

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
         {/* <Tooltip title="Edit this row" placement="bottom">
        </Tooltip> */}
      </>


    ),
    style: { textAlign: "center" },
    disableSortBy: true,
  });
  return <Table data={myData} columns={columns} />;
};

export default compose(withRouter, connect(null))(injectIntl(Datatable));
