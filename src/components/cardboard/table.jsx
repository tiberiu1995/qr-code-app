import React, { Component, Fragment, useState, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useAsyncDebounce,
  useGlobalFilter,
} from "react-table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import {
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core/";
import {
  ArrowDropDown,
  ArrowDropUp,
  Edit,
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons/";
import matchSorter from "match-sorter";
import Row from "./row.jsx";
import Select from "../utils/select.jsx";

const CustomTable = ({ columns, data }) => {
  const [records, setRecords] = useState(data);

  useEffect(() => {
    setRecords(data);
  }, [data]);
  //let changed = false;
  //if(records.length < data.length)
  // setRecords(data);
  const getRowId = React.useCallback((row) => {
    return row.id;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: records,
      getRowId,
    },
    useGlobalFilter,
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    const newRecords = update(records, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRecord],
      ],
    });
    setRecords(newRecords);
    data = newRecords;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <>
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <div>
                      {column.canFilter && column.filterable
                        ? column.render("Header")
                        : null}
                    </div>
                    <div>
                      { column.canFilter && column.filterable
                        ? column.render("Filter")
                        : null}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </>
          ))}
        </TableHead>
      </Table>

      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <span>{column.render("Header")}</span>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map(
            (row, index) =>
              prepareRow(row) || (
                <Row
                  index={index}
                  key={"row_" + index}
                  row={row}
                  moveRow={moveRow}
                  {...row.getRowProps()}
                />
              )
          )}
        </TableBody>
      </Table>
    </DndProvider>
  );
};

export default CustomTable;
