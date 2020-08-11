import React, { Component } from "react";
import { Link } from "react-router-dom";
import { priceAfterDiscount } from "../../../../services";
import Price from "../../../../services/price";

const CartHeader = ({ item, total, symbol, removeFromCart }) => (
  <li>
    <div className="media">
      <Link to={`${process.env.PUBLIC_URL}/product/${item.id}`}>
        <img alt="" className="mr-3" src={`${item.pictures[0]}`} />
      </Link>
      <div className="media-body">
        <Link to={`${process.env.PUBLIC_URL}/product/${item.id}`}>
          <h4>{item.name}</h4>
        </Link>
        <h6>
          <span>
            {item.qty} x{" "}
            <Price
              symbol={symbol}
              price={priceAfterDiscount(item.price, item.discount)}
            />
          </span>
        </h6>
      </div>
    </div>
    {/*<span>{cart}</span>*/}
    <div className="close-circle">
      <a href={null} onClick={removeFromCart}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </a>
    </div>
  </li>
);

export default CartHeader;
