import React from "react";

class Box extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    getClassName() {
        return `box ${this.props.color} ${this.props.selected}`
    }

    handleClick() {
        this.props.callback(this.props.color);
    }

    render() {
        return (
            <div className={this.getClassName()} onClick={this.handleClick}></div>
        );
    }
}