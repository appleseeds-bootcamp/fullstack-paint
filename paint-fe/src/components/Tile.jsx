import React from "react";

export default class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.color || "white"
        };
        this.paint = this.paint.bind(this);
    }

    paint() {
        if (this.props.isDrawing) {
            this.setState({ color: this.props.color });
        }
    }

    render() {
        let color = this.state.color;
        let className = "tile " + color;
        return (
            <div className={className} onMouseMove={this.paint} key={this.props.key}
                style={{ top: this.props.y, left: this.props.x }}></div>
        );
    }
}