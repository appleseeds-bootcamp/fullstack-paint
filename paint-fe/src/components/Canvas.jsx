import React from "react";
import Tile from "./Tile.jsx";

export default class Canvas extends React.Component {
    constructor() {
        super();

        this.state = {
            isDrawing: false,
            tiles: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.drawingData && nextProps.drawingData !== this.props.drawingData) {
            console.log(nextProps);
            this.setState({
                tiles: this.createTilesFromData(nextProps.drawingData)
            });
        }
    }

    createTilesFromData = (drawingData) => {
        return drawingData.map(tileData =>
            <Tile {...tileData} />)
    }

    draw = (e) => {
        if (this.state.isDrawing) {
            let boundaries = e.target.getBoundingClientRect();
            let left = e.pageX - boundaries.left;
            let up = e.pageY - boundaries.top;

            this.props.handleDrawingDataUpdated({ x: left, y: up });

            let tile = <Tile key={"" + left + Math.random()} color={this.props.color} x={left} y={up} />
            let newTiles = this.state.tiles.slice();
            newTiles.push(tile);
            this.setState({
                tiles: newTiles
            })
        }
    };

    startDrawing = () => {
        this.setState({ isDrawing: true })
    };

    stopDrawing = () => {
        this.setState({ isDrawing: false })
    };

    render() {
        return (
            <div className="board" onDragLeave={this.stopDrawing} onMouseUp={this.stopDrawing}
                onMouseDown={this.startDrawing} onMouseMove={this.draw} >
                {this.state.tiles}
            </div>
        );
    }
}

