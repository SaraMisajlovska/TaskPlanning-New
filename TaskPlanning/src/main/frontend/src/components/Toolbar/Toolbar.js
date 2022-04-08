import React, { Component } from 'react';
export default class Toolbar extends Component {
  handleZoomChange = (e) => {
    if (this.props.onZoomChange) {
      this.props.onZoomChange(e.target.value)
    }
  }
  render() {
    const zoomRadios = ['Hours', 'Days', 'Months'].map((value) => {
      const isActive = this.props.zoom === value;
      return (
        <label key={ value } className={ `radio-label ${isActive ? 'radio-label-active': ''}` }>
          <input type='radio'
            checked={ isActive }
            onChange={ this.handleZoomChange }
            value={ value }/>
          { value }
        </label>
      );
    });

    //add other filters
    return (
      <div className="tool-bar">
        <b>Zoom: </b>
          { zoomRadios }
          {/* add filters const/ component*/}
  </div>
    );
  }
}
