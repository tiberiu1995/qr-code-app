import React, { Component, Fragment, useState, useEffect } from 'react';
import { useTable, useSortBy, useFilters, usePagination, useAsyncDebounce, useGlobalFilter  } from "react-table";
import { DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import {
  TextField, Button, Box,
  Table, TableBody, TableCell, TableHead, TableRow, } from "@material-ui/core/";
import {ArrowDropDown, ArrowDropUp, Edit, FirstPage, LastPage, NavigateBefore, NavigateNext,} from '@material-ui/icons/';
import matchSorter from 'match-sorter'
import Row from './row.jsx';
import Select from '../utils/select.jsx';
import { compose } from 'redux';
import { withReducer } from 'recompose';
import { connect } from 'react-redux';
import { setPageIndex, _setPageSize } from '../../actions';

// Define a default UI for filtering
const DefaultColumnFilter = ({ column: { 
  filterValue, 
  preFilteredRows, 
  setFilter },
  }) => {
  const count = preFilteredRows.length
  return (
    <TextField
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Cauta...`}
    />
  )
}



const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

const CustomTable = ({ columns, data, hideFilters, settings }) => {
  const [records, setRecords] = useState(data);

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  useEffect(() => {
    setRecords(data)
  }, [data]);
  //let changed = false;
  //if(records.length < data.length)
   // setRecords(data);
  const getRowId = React.useCallback(row => {
    return row.id
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable({
        columns,
        data: records,
        initialState: { pageIndex: settings.pageIndex, pageSize: settings.pageSize },
        getRowId,
        defaultColumn, // Be sure to pass the defaultColumn option
        filterTypes,
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
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <>
            <TableRow  {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                <div>{column.canFilter && column.filterable ? column.render("Header") : null}</div>
                <div>{!hideFilters && column.canFilter && column.filterable ? column.render('Filter') : null}</div>
                </TableCell>
                ))}
            </TableRow>
            </>
          ))}
        </TableHead>
      </Table>

      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow  {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell  {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <span>
                    { column.render("Header") }
                    {
                      column.canSort ?
                      ( column.isSorted ? 
                        ( column.isSortedDesc ? 
                            <ArrowDropDown fontSize="small"/> : 
                            <ArrowDropUp fontSize="small"/>
                        ) : 
                        <>
                          <ArrowDropDown fontSize="small"/><ArrowDropUp fontSize="small"/>
                        </>
                      ) :
                       ''
                      }
                  </span>
                </TableCell >
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
        {page.map(
            (row, index) =>
              prepareRow(row) || (
                <Row
                  index={index}
                  key={'row_'+index}
                  row={row}
                  moveRow={moveRow}
                  {...row.getRowProps()}
                />
              )
          )}
        </TableBody>
      </Table>
      { !hideFilters &&     
        <Box>
          <Button 
            onClick={() => { gotoPage(0); setPageIndex(0)}}
            disabled={!canPreviousPage} >
            <FirstPage/>
          </Button>
          <Button 
            onClick={() => {previousPage(); setPageIndex(pageIndex -1)}} 
            disabled={!canPreviousPage}>
            <NavigateBefore/>
          </Button>
          <Button onClick={() => {nextPage(); setPageIndex(pageIndex + 1)}} 
            disabled={!canNextPage}>
            <NavigateNext/>
          </Button>
          <Button 
            onClick={() => { gotoPage(pageCount - 1); setPageIndex(pageCount - 1) }} 
            disabled={!canNextPage}>
            <LastPage/>
          </Button>{" "}
          <span className="mx-2">
            Pagina  {pageIndex + 1} din {pageOptions.length}
          </span>
          <Select 
            value = {pageSize}
            onChange = {e => { setPageSize(Number(e.target.value)); _setPageSize(Number(e.target.value)) }} 
            array = {[5, 10, 20, 50]}
            display = {(e)=>{return `Afiseaza ${e}`}} />
        </Box>
      }
    </DndProvider>
  );
};

const mapStateToProps = (state, ownProps) => ({
  settings: state.settings,
})

export default connect(mapStateToProps)(CustomTable);

  //export default CustomTable;
