import React, {
  useState,
  useEffect,
} from "react";
import { Datatable } from "../../../datatable/datatable";
import { Link, withRouter, Prompt } from "react-router-dom";
import { compose } from "recompose";
import update from "immutability-helper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card from "./../../../cardboard/card";
import DraggableCard from "./../../../cardboard/draggable-card";
import { Box, Grid, Button } from "@material-ui/core/";
import { fetchData } from "../../../utils/fetch";
import Header from "../menu-header.jsx";
import { injectIntl } from 'react-intl';

const Categories = (props) => {
  const { formatMessage } = props.intl;
  const [data, setData] = useState([]);
  const title = props.match.params.title;
  const category = props.match.params.category;
  const [right, setRight] = useState([]);
  const [left, setLeft] = useState([]);
  const [isEdited, setEdited] = useState(false);

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = right[dragIndex];
    const newRecords = update(right, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRecord],
      ],
    });
    setEdited(true);
    setRight(newRecords);
  };

  const fetchItemsConfiguration = async () => {
    try {
      const response = await fetchData( {category: category } , "menu/item/get.php");
      setLeft(response.left);
      setRight(response.right);
      //setData(apiData);
    } catch (error) {
      console.error(error);
    }
  };

  if (title && category)
    useEffect(() => {
      fetchItemsConfiguration(title);
    }, []);


  const saveItemsConfig = async () => {
    try{
      let endpoint = "edit";
        const obj = {
          left: left.map((el) => el.id),
          right: right.map((el) => el.id),
        }
      const apiData = await fetchData( obj , "menu/item/" + endpoint + ".php");
      console.log(apiData);
      endpoint === "edit"
        ? toast.success(formatMessage({id: "edited_menu"}))
        : toast.success(formatMessage({id: "menu_saved"}));
      setEdited(false);
      //await fetchMenus();
      // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
      //window.scrollTo(0, 0);
    } catch (error) {
      toast.error(formatMessage({id: "error_menu"}));
      //this.setState({ message: error.message });
      //window.scrollTo(0, 0);
    }
  };

  const removeItem = (value) => {
    let index = right.findIndex((el) => el.id == value);
    setEdited(true);
    setLeft(
      update(left, {
        $push: [right[index]],
      })
    );
    setRight(
      update(right, {
        $splice: [[index, 1]],
      })
    );
  };

  const addItem = (value) => {
    //alert(value);
    let l = left;
    let index = l.findIndex((el) => el.id == value);
    setEdited(true);
    setRight(
      update(right, {
        $push: [left[index]],
      })
    );
    setLeft(
      update(left, {
        $splice: [[index, 1]],
      })
    );
  };

  return (
    <div className="my-1 mx-auto text-center">
      <Prompt
        when={isEdited}
        message={`Are you sure you want to exit without saving?`}
      />
      <Header/>
      <Box m={5}>
        <Grid container spacing={4} justify={"center"}>
          <Grid item xs={12} sm={6} style={{ maxWidth: 600 }}>
            {left.length
            ? left.map((el, i) => (
                <Card
                  key={'mc'+i}
                  index={i}
                  add={addItem}
                  data={el}
                />
              ))
            : ""}
          </Grid>
          <Grid item xs={12} sm={6} style={{ maxWidth: 600 }}>
            <DndProvider backend={HTML5Backend}>
              {right.length
                ? right.map((el, i) => (
                    <Card
                      index={i}
                      key={"_cimc"+i}
                      remove={removeItem}
                      moveRow={moveRow}
                      data={el}
                    />
                  ))
                : ""}
            </DndProvider>
          </Grid>
        </Grid>
        <Button className="m-2" onClick={saveItemsConfig}>
          {formatMessage({id: 'save_menu'}) }
        </Button>

        {data.length ? (
          <>
            <DndProvider backend={HTML5Backend}>
              {data &&
                data.map((el, i) => (
                  <DraggableCard
                    index={i}
                    remove={removeItem}
                    moveRow={moveRow}
                    data={el}
                  />
                ))}
            </DndProvider>
            {/* <Button className="m-2" onClick={saveCategoriesConfig}>Salveaza meniul</Button> */}
          </>
        ) : (
          ""
        )}
      </Box>
    </div>
  );
};

export default compose(withRouter)(injectIntl(Categories));
