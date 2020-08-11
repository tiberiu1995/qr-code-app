import { useEffect } from "react";

export const useScript = (url) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};
/*
  export const getAllProducts = async () => {
    try{
      let response = await fetch('https://bathtimestories.com/apim/product/get.php' , {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      let data = await response.json();
      console.log(data);
      return data;
      }
      catch(error) {
        console.error(error);
        return '';
    }
  }

// Get Unique Brands from Json Data
export const getBrands = (products) => {
    var uniqueBrands = [];
    products.map((product, index) => {
        if (product.tags) {
            product.tags.map((tag) => {
                if (uniqueBrands.indexOf(tag) === -1) {
                    uniqueBrands.push(tag);
                }
            })
        }
    })
    //console.log(uniqueBrands)
    return uniqueBrands;
}

export const priceAfterDiscount = (price,discount) => price*(1-discount)

// Get Unique Colors from Json Data
export const getColors = (products) => {
    var uniqueColors = [];
    products.map((product, index) => {
        if(product.colors) {
            product.colors.map((color) => {
                if (uniqueColors.indexOf(color) === -1) {
                    uniqueColors.push(color);
                }
            })
        }
    })
    //console.log(uniqueBrands)
    return uniqueColors;
}

// Get Minimum and Maximum Prices from Json Data
export const getMinMaxPrice = (products) => {
    let min = 10000, max = 0;

    products.map((product, index) => {
        let v = parseFloat(priceAfterDiscount(product.price,product.discount));
        min = (v < min) ? v : min;
        max = (v > max) ? v : max;
    })

    return {'min':Math.floor(parseInt(min)), 'max':Math.ceil(parseInt(max))};
}
 
export const getRelatedProducts = (products, productId) => 
{ console.log(products);
  return products.filter(l => products.filter(el => el.id == productId)[0].rec.includes(l.id))};
  

export const getVisibleProducts = (products, {brand, color, value, name, sortBy}) => {
    return products.filter(product => {

        let brandMatch;
        if(product.tags)
            brandMatch = product.tags.some(tag => brand.includes(tag))
        else
            brandMatch = true;

        let colorMatch;
        if(color && product.colors) {
            colorMatch = product.colors.includes(color)
        }else{
            colorMatch = true;
        }

        let nameMatch;
        if(name && product.name) {
          nameMatch = product.name.toLowerCase().includes(name.value.toLowerCase())
        }
        else{
          nameMatch = true;
        }

        const startPriceMatch = typeof value.min !== 'number' || value.min <= parseFloat(priceAfterDiscount(product.price,product.discount));
        const endPriceMatch = typeof value.max !== 'number' || parseFloat(priceAfterDiscount(product.price,product.discount)) <= value.max;

        return brandMatch && colorMatch && nameMatch && startPriceMatch && endPriceMatch;
    }).sort((product1, product2) => {
        if (sortBy === 'HighToLow') {
            return parseFloat(priceAfterDiscount(product1.price,product1.discount)) > parseFloat(priceAfterDiscount(product2.price,product2.discount)) ? -1 : 1;
        } else if (sortBy === 'LowToHigh') {
            return parseFloat(priceAfterDiscount(product1.price,product1.discount)) < parseFloat(priceAfterDiscount(product2.price,product2.discount)) ? -1 : 1;
        } else if (sortBy === 'Newest') {
            return product2.id < product1.id ? -1 : 1;
        } else if (sortBy === 'AscOrder') {
            return product1.name.localeCompare(product2.name);
        } else if (sortBy === 'DescOrder') {
            return product2.name.localeCompare(product1.name);
        } else{
            return product2.id > product1.id ? -1 : 1;
        }
    });
}

export const getCartItemsTotal = (cartItems) => {
    var total = 0;
    for(var i=0; i<cartItems.length; i++){
        total += parseInt(cartItems[i].qty, 10)*parseFloat(priceAfterDiscount(cartItems[i].price,cartItems[i].discount), 10);
    }
    return total;
}

export const getCartTotal = (cartItems, shipping_rate = 0) => {
    var total = getCartItemsTotal(cartItems)+parseFloat(shipping_rate);
    return total;
}

// Get Trending Tag wise Collection
export const getTrendingTagCollection = (products, type, tag) => {
    const items = products.filter(product => {
        return product.category === type && product.tags.includes(tag);
    })
    return items.slice(0,8)
}

// Get Trending Collection
export const getTrendingCollection = (products, type) => {
    const items = products.filter(product => {
        return product.category === type;
    })
    return items.slice(0,8)
}

// Get Special 5 Collection
export const getSpecialCollection = (products, type) => {
    const items = products.filter(product => {
        return product.category === type;
    })
    return items.slice(0,5)
}

// Get TOP Collection
export const getTopCollection = products => {
    const items = products.filter(product => {
        return product.rating > 4;
    })
    return items.slice(0,8)
}

// Get New Products
export const getNewProducts = (products, type) => {
    const items = products.filter(product => {
        return product.new === true && product.category === type;
    })

    return items.slice(0,8)
}

// Get Related Items
export const getRelatedItems = (products, type) => {
    const items = products.filter(product => {
        return product.category === type;
    })

    return items.slice(0,4)

}

// Get Best Seller Furniture
export const getBestSellerProducts = (products, type) => {
    const items = products.filter(product => {
        return product.sale === true && product.category === type;
    })

    return items.slice(0,8)
}

// Get Best Seller
export const getBestSeller = products => {
    const items = products.filter(product => {
        return product.sale === true;
    })

    return items.slice(0,8)
}

// Get Mens Wear
export const getMensWear = products => {
    const items = products.filter(product => {
        return product.category === 'men';
    })

    return items.slice(0,8)
}

// Get Womens Wear
export const getWomensWear = products => {
    const items = products.filter(product => {
        return product.category === 'women';
    })

    return items.slice(0,8)
}

// Get Single Product
export const getSingleItem = (products, id) => {

    const items = products.find((element) => {
        return element.id === id;
    })
    return items;
}

// Get Feature Products
export const getFeatureImages = (products, type) => {

    const items = products.filter(product => {
        return product.type === type;
    })
    return items;
}
*/
