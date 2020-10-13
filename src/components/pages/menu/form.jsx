import React, {
    Component,
    Fragment,
    useState,
    useEffect,
    useCallback,
  } from "react";
  import Datatable from "../../datatable/datatable";
  import Card from "../../cardboard/datatable";
  import { Link, withRouter, Prompt } from "react-router-dom";
  import { compose } from "recompose";
  //import Form from "./form0";
  import update from "immutability-helper";
  import { Button, Box, useMediaQuery, FormControlLabel, Switch } from "@material-ui/core";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.min.css";
  import MediaCard from "./../../cardboard/_card";
  import { DndProvider } from "react-dnd";
  import { HTML5Backend } from "react-dnd-html5-backend";
  import CustomList from "./../../cardboard/_list";
  import { Grid } from "@material-ui/core/";
  import { fetchData, fetchMenu } from "../../utils/fetch";
  import Header from "./menu-header";

  
  const Form = (props) => {
    const [data, setData] = useState([]);
    const [isEdited, setEdited] = useState(false);
    const [values, setValues] = useState({
      enableReviews: true,
      enableAlergens: true,
      enableCalories: true,
      enableToC: true,
    });
    //const id = props.match.params.id;
    const title = props.match.params.title;
    const [categoriesConfig, setCategoriesConfig] = useState([]);
    const [categories, setCategories] = useState([]);
    const [right, setRight] = useState([]);
    const [left, setLeft] = useState([]);
    const [items, setItems] = useState([]);

  
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
  
    const fetchMenus = async () => {
      try {
        let response = await fetch(
          "https://bathtimestories.com/apim/menu/get.php/"
        );
        let apiData = await response.json();
        console.log(apiData);
        setData(apiData);
      } catch (error) {
        console.error(error);
      }
    };
  
    const fetchCategoriesConfig = async () => {
      try {
        let apiData = await fetchData({ title: title }, "menu/category/get.php");
        //let categories = apiData.categories;
        setValues({
          ...values, 
          enableAlergens: apiData.enables.enableAlergens == true,
          enableCalories: apiData.enables.enableCalories == true,
          enableReviews: apiData.enables.enableReviews == true,
          enableToC: apiData.enables.enableToC == true,
        });
        let config = apiData.categories; //[0].category_configuration.split(',')
        console.log(apiData);
        apiData = await fetchData({ title: title }, "category/get.php");
        let categories = apiData;
        let _left = [];
        let _right = [];
        config.forEach((el) => {
          let selected = categories.findIndex((_el) => _el.id == el.category_id);
          if (selected !== -1) {
            _right.push(categories[selected]);
            categories.splice(selected, 1);
          }
        });
        _left = [...categories];
  
        // categories.forEach((el,i) => {
        //   let selected = config.findIndex(_el => _el == el.id);
        //   selected !== -1 ? _right.push(el) : _left.push(el)
        // });
        setLeft(_left);
        setRight(_right);
        setCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };
  
    const fetchItems = async (title) => {
      try {
        let apiData = await fetchMenu(title);
      //  let apiData = await response.json();
        console.log(apiData);
        setItems(apiData.products);
      } catch (error) {
        console.error(error);
      }
    };
  
    //const compare = (a,b) => (parseInt(a.el)>parseInt(b.el) ? 1 : -1)
  
    useEffect(() => {
          fetchCategoriesConfig();
          //fetchCategories(title);
          fetchItems(title);
    }, []);
  
    const saveCategoriesConfig = async () => {
      let endpoint = "edit";
      try {
        const obj = {
          data: right.map((el) => el.id),
          title: title,
          reviews: values.enableReviews + 0,
          alergens: values.enableAlergens + 0,
          calories: values.enableCalories + 0,
          toc: values.enableToC + 0
        }
        const apiData = await fetchData( obj, "menu/category/" + endpoint + ".php");
        console.log(apiData);
        endpoint === "edit"
          ? toast.success("Meniul a fost editat!")
          : toast.success("Meniul a fost salvat!");
        // await fetchMenus();
        // this.setState({ message: (data===true) ? 'transaction done' : 'transaction void' });
        //window.scrollTo(0, 0);
      } catch (error) {
        //this.setState({ message: error.message });
        //window.scrollTo(0, 0);
      }
    };
  

    // const addItem = async (item) => {
    //   console.log(item);
    //   if (item.id === '') {
    //     item.id = '_'+(data.length+1);
    //     saveItem(item, 'new')
    //   }
    //   else
    //     saveItem(item, 'edit');
    //   console.log(data);
    //   //closeModal();
    // }
  
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
      let r = right;
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
    const tablet = useMediaQuery('(min-width:500px) and (max-width:899px)');
    const mobile = useMediaQuery('(max-width:499px)');

    const toggleChecked = (event) => {
      setValues({...values, [event.target.name]: event.target.checked })
    }
  
    return (
      <div className="my-1 mx-auto text-center">
          <Prompt
            when={isEdited}
            message={`Are you sure you want to exit without saving?`}
          />
        <Box m={desktop ? "auto" : 2} style={{maxWidth: 850}}>
          {title ? (
            <>
              <Header/>
              <Grid container spacing={4} justify={"center"}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  {left.length ? (
                    <CustomList data={left} handleToggle={addItem} />
                  ) : (
                    ""
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <DndProvider backend={HTML5Backend}>
                    {right.length
                      ? right.map((el, i) => (
                          <MediaCard
                            key={'mc'+i}
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

              <FormControlLabel
                value="reviews"
                control={<Switch color="primary" name="enableReviews" checked={values.enableReviews} onChange={toggleChecked} />}
                label="Permite recenzii"
                labelPlacement="start"
              />
              <FormControlLabel
                value="alergens"
                control={<Switch color="primary"  name="enableAlergens" checked={values.enableAlergens} onChange={toggleChecked} />}
                label="Afiseaza alergeni"
                labelPlacement="start"
              />
             <FormControlLabel
                value="calories"
                control={<Switch color="primary"  name="enableCalories" checked={values.enableCalories} onChange={toggleChecked}  />}
                label="Afiseaza calorii"
                labelPlacement="start"
              />
            <FormControlLabel
                value="toc"
                control={<Switch color="primary"  name="enableToC" checked={values.enableToC} onChange={toggleChecked}  />}
                label="Afiseaza cuprins"
                labelPlacement="start"
              />
              <Button className="m-2" onClick={saveCategoriesConfig}>
                Salveaza meniul
              </Button>
              {/* <Card
                 edit={editCat}
                remove={removeCat}
                myData={[...categories.map(el => ({id: el.id, name: el.name, })   )]} /> */}
            </>
          ) : ''}
        </Box>
      </div>
    );
  };
  
  export default compose(withRouter)(Form);
  