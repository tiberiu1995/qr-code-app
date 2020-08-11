import React, { Component, useState, useCallback } from "react";
import QrReader from "react-qr-reader";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import { ScanQR } from "./scan-qr";

export class Scan extends Component {
  handleScan = (data) => {
    if (data) {
      //alert(data);
      window.location.href = data;
    }
  };

  handleError = (err) => {
    console.error(err);
  };

  render() {
    return (
      <div className="">
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ margin: "auto", width: 300 }}
        />
      </div>
    );
  }
}

export default compose(withRouter, connect(null))(Scan);
