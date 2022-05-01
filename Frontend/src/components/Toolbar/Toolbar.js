import React, {Component} from 'react';

export default class Toolbar extends Component {
    handleZoomChange = (e) => {
        if (this.props.onZoomChange) {
            this.props.onZoomChange(e.target.value)
        }
    }
    handleFilterChange = (e) => {
        this.props.onFilterChange(e);
        e.preventDefault();
    }
    handleUserFilterChange = (e) => {
        this.props.onUserFilterChange(e);
        e.preventDefault();
    }

    onButtonClick = (e) => {
        this.props.onFilterClick();
    }

    render() {
        const zoomRadios = ['Days', 'Months', "Quarter"].map((value) => {
            const isActive = this.props.zoom === value;
            return (
                <label key={value} className={`radio-label ${isActive ? 'radio-label-active' : ''}`}>
                    <input type='radio'
                           checked={isActive}
                           onChange={this.handleZoomChange}
                           value={value}/>
                    {value}
                </label>
            );
        });

        return (
            <div>
                <div className="tool-bar">
                    <b>Zoom: </b>
                    {zoomRadios}
                    <label className="right">Select filter: </label>
                    <select
                        onChange={this.handleFilterChange}
                    >
                        <option/>
                        <option value="non-dependent">Non-dependent tasks</option>
                        <option value="completed-dependent-tasks">Completed dependent tasks</option>
                        <option value="non-assigned">Non-assigned tasks</option>
                    </select>
                    <label className="right">Select user: </label>
                    <select
                        onChange={this.handleUserFilterChange}
                    >
                        <option/>
                        {this.props.userOptions}
                    </select>
                    <button className="right" onClick={this.onButtonClick}>Filter</button>
                </div>
            </div>
        );
    }
}
