import React from 'react';
import { Star, StarBorder } from '@material-ui/icons';

const AverageRating = ({average=false, data, key, onClick }) => {
    const rating = average ? Math.round(data.length && data.map(el => parseInt(el.rating)).reduce((a,b) => a+b, 0)/data.length) : parseInt(data);
    return (
      <>
      { [...Array(rating).keys()].map((i) => (
          <Star key={key+i} data-value={i} onClick={onClick} fontSize={"small"} />
              ))
      }
      { [...Array(5-rating).keys()].map((i) => (
          <StarBorder key={key+(rating+i)} onClick={onClick} data-value={rating+i} fontSize={"small"} />
              ))
      }
    </>
    )
  }

  export default AverageRating

