import React, {
    useState,
    useEffect,
  } from "react";
  import { withRouter, Prompt } from "react-router-dom";
  import { compose } from "recompose";
  //import Form from "./form0";
  import update from "immutability-helper";
  import { Button, Box, useMediaQuery, } from "@material-ui/core";
  import { toast,} from "react-toastify";
  import "react-toastify/dist/ReactToastify.min.css";
  import Card from "./../../cardboard/card";
  import DraggableCard from "./../../cardboard/draggable-card";
  import { DndProvider } from "react-dnd";
  import { HTML5Backend } from "react-dnd-html5-backend";
  import { Grid } from "@material-ui/core/";
  import { fetchData,  } from "../../utils/fetch";
  import Header from "./menu-header";
import { injectIntl } from 'react-intl';

  
  const Form = (props) => {
    const {formatMessage} = props.intl;
    const [isEdited, setEdited] = useState(false);
    const title = props.match.params.title;
    const [right, setRight] = useState([]);
    const [left, setLeft] = useState([]);

    const moveRow = (dragIndex, hoverIndex) => {
      const dragRecord = right[dragIndex];
      const newRecords = update(right, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      });
      setRight(newRecords);
      setEdited(true);
    };
  
  
    const fetchCategoriesConfig = async () => {
      try {
        const response = await fetchData({ title: title }, "menu/category/get.php");
        setLeft(response.left);
        setRight(response.right);
        //setCategories(left.concat(right));
      } catch (error) {
        console.error(error);
      }
    };
  
    //const compare = (a,b) => (parseInt(a.el)>parseInt(b.el) ? 1 : -1)
  
    useEffect(() => {
          fetchCategoriesConfig();
    }, []);
  
    const saveCategoriesConfig = async () => {
      let endpoint = "edit";
      try {
        const obj = {
          left: left.map((el) => el.id),
          right: right.map((el) => el.id),
        }
        const apiData = await fetchData( obj, "menu/category/" + endpoint + ".php");
        console.log(apiData);
        endpoint === "edit"
          ? toast.success(formatMessage({id: "edited_menu"}))
          : toast.success(formatMessage({id: "menu_saved"}));
        setEdited(false);
        // await fetchMenus();
        // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
        //window.scrollTo(0, 0);
      } catch (error) {
        toast.error(formatMessage({id: "error_menu"}));
        //this.setState({ message: error.message });
        //window.scrollTo(0, 0);
      }
    };
  
  
    const editCat = (id) => {
      //alert(id);
      props.history.push("edit-category/" + id);
    };
  
    const removeItem = (value) => {
      let l = left;
      let r = right;
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

    const desktop = useMediaQuery('(min-width:900px)');

  
    return (
      <div className="my-1 mx-auto text-center">
          <Prompt
            when={isEdited}
            message={`Are you sure you want to exit without saving?`}
          />
        <Box mx={desktop ? "auto" : 2} my={2} style={{maxWidth: 850}}>
          {title ? (
            <>
              <Header/>
              <Grid container spacing={4} justify={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
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
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <DndProvider backend={HTML5Backend}>
                    {right.length
                      ? right.map((el, i) => (
                          <DraggableCard
                            key={'_cimc'+i}
                            index={i}
                            edit={editCat}
                            remove={removeItem}
                            moveRow={moveRow}
                            data={el}
                          />
                        ))
                      : ""}
                  </DndProvider>
                </Grid>
              </Grid>
              <Button variant="contained" color="primary" className="m-2" onClick={saveCategoriesConfig}>
                {formatMessage({id: 'save_menu'}) }
              </Button>
            </>
          ) : ''}
        </Box>
      </div>
    );
  };
  
  export default compose(withRouter)(injectIntl(Form));
  