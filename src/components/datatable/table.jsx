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
  Typography,
  useMediaQuery
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
import { compose } from "redux";
import { withReducer } from "recompose";
import { connect } from "react-redux";
import { setPageIndex, _setPageSize } from "../../actions";
import { injectIntl } from "react-intl";
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
  pagination: {
    '& .MuiFormControl-root': {
      marginLeft: 16,
      marginRight: 16,

    }
  },
  arrows: {
    '& svg': {
      fontSize: 16
    }
  }
});

const fuzzyTextFilterFn = (rows, id, filterValue) => {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
};

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const CustomTable = ({ columns, data, hideFilters, settings, intl}) => {
  const [records, setRecords] = useState(data);
  const classes = useStyles();
  // Define a default UI for filtering
  const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter, id },
  }) => {
    const count = preFilteredRows.length;

    return (
      <TextField
        value={filterValue || ""}
        label={translate({id: id})}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Cauta...`}
        variant="outlined"
        size="small"
      />
    );
  };

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: records,
      initialState: {
        pageIndex: settings.pageIndex,
        pageSize: settings.pageSize,
      },
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
  };

  const translate = intl.formatMessage;
  const desktop = useMediaQuery('(min-width:900px)');
  const tablet = useMediaQuery('(min-width:500px) and (max-width:899px)');
  const lt600 = useMediaQuery('(max-width:599px)');
  const mobile = useMediaQuery('(max-width:499px)');
  const {formatMessage} = intl;

  const filtering = () => headerGroups.map((headerGroup) => (
    <Box mb={2.5} display={ lt600 ? "grid" : "flex"} justifyContent="left"  {...headerGroup.getHeaderGroupProps()}>
      <Box mx={2.5}>
        <Typography align="left" variant="subtitle2">
          {formatMessage({id: "filter_by"})} ...
        </Typography>
      </Box>
      { !lt600 ?
        headerGroup.headers.map((column) =>  (
          column.canFilter && column.filterable &&
            <Box mx={2.5} {...column.getHeaderProps(column.getSortByToggleProps())} >
              {column.render("Filter")}
            </Box>
          )
        ) :
        <Box display="flex">
        { headerGroup.headers.map((column) => ["name", "category", "title"].includes(column.id) && (
            column.canFilter && column.filterable &&
              <Box mx={2.5} {...column.getHeaderProps(column.getSortByToggleProps())} >
                {column.render("Filter")}
              </Box>
            )
          )}
        </Box>
      }
      </Box>
  ));

  const header = () => {
    let arr =  lt600 ? ["name", "category", "title", "cat_no", "item_no"] : ["name", "category", "size", "title", "cat_no", "item_no"];
    return headerGroups.map((headerGroup) => (
      <TableRow {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column) => (
          arr.includes(column.id) && 
          <TableCell align="center" padding={mobile ? "none" : "default" }
            {...column.getHeaderProps(column.getSortByToggleProps())} >
            <Box justifyContent="center" display="flex" alignItems="center">
              {column.render("Header")}
              <Box display="grid" className={clsx(classes.arrows)}>
              { sortingArrows(column) }
              </Box>
             
            </Box>
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  const sortingArrows = (column) => {
    if (column.canSort ){
      if (column.isSorted){
        if(column.isSortedDesc) 
          return <ArrowDropDown/>
          else return <ArrowDropUp/>;
      };
      return  <>  
          <ArrowDropUp />
          <ArrowDropDown/>
        </>;
    }
    return '';
  };

  const pagionation = () => (
    lt600 ? 
      <>
        <Select
        value={pageIndex+1}
        onChange={(e) => {
          gotoPage(Number(e.target.value-1));
        }}
        array={Array.from({length: pageOptions.length}, (_, i) => i + 1)}
        display={(e) => {
          return `Pagina ${e}`;
        }} />
        <Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            _setPageSize(Number(e.target.value));
          }}
          array={[5, 10, 20, 50]}
          display={(e) => {
            return `Afiseaza ${e}`;
          }} />
      </> :
      <>
        <Button
          style={{padding: 10}}
          onClick={() => {
            gotoPage(0);
            setPageIndex(0);
          }}
          disabled={!canPreviousPage}
        >
          <FirstPage />
        </Button>
        <Button
          onClick={() => {
            previousPage();
            setPageIndex(pageIndex - 1);
          }}
          disabled={!canPreviousPage}
        >
          <NavigateBefore />
        </Button> 
        <span className="mx-2">
          Pagina {pageIndex + 1} din {pageOptions.length}
        </span>           
        <Button
          onClick={() => {
            nextPage();
            setPageIndex(pageIndex + 1);
          }}
          disabled={!canNextPage}
        >
          <NavigateNext />
        </Button>
        <Button
          onClick={() => {
            gotoPage(pageCount - 1);
            setPageIndex(pageCount - 1);
          }}
          disabled={!canNextPage}>
          <LastPage />
        </Button>
        {" "}
        <Select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            _setPageSize(Number(e.target.value));
          }}
          array={[5, 10, 20, 50]}
          display={(e) => {
            return `Afiseaza ${e}`;
          }}/>
    </>
    )

  return (

    <DndProvider backend={HTML5Backend}>
      {!hideFilters || <Box {...getTableProps()}>
        { filtering() }
      </Box>
      }

      <Table {...getTableProps()}>
        <TableHead>
          { header() }
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map(
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
      {!hideFilters || (
        <Box>
          <Box m={2} display="flex" alignItems="center" justifyContent="center" className={clsx(classes.pagination)} >
            { pagionation()
              }
          </Box>
        </Box>
      )}
    </DndProvider>
  );
};

const mapStateToProps = (state, ownProps) => ({
  settings: state.settings,
});

export default connect(mapStateToProps)(injectIntl(CustomTable));

//export default CustomTable;
