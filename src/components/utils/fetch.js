


//display menu

//data for customer menu display

const api = "https://bathtimestories.com/apim/";

export const fetchData = (data, url) => {
    return fetch(
        api+url,
        {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(response => response.json());
}


export const fetchMenu = async (title) =>  { 
    return fetch(
      "https://bathtimestories.com/apim/menu/get.php/?title=" + title
    ).then(response => response.json());
  }

export const fetchMenuDesign = async (title) => {
    return fetch(
        "https://bathtimestories.com/apim/menu/design/get.php",
        {
          method: "POST",
          mode: "cors",
          body: JSON.stringify({
            title: title,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
    ).then(response => response.json());
}