import React from "react";
import LoginForm from "./LoginForm.jsx";
import Tile from "./Tile.jsx";
import Box from "./Box.jsx"

class PaintApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "blue",
            isDrawing: false,
            tiles: [],
            paintingName: "",
            paintings: []
        }
        this.brushSizes = [2, 4, 6, 8];
    }

    changeColor = (color) => {
        this.setState({
            color: color
        });
    };

    startDrawing = () => {
        this.setState({ isDrawing: true })
    };

    stopDrawing = () => {
        this.setState({ isDrawing: false })
    };

    draw = (e) => {
        if (this.state.isDrawing) {
            let boundaries = e.target.getBoundingClientRect();
            let left = e.pageX - boundaries.left;
            let up = e.pageY - boundaries.top;
            let tile = <Tile key={"" + left + Math.random()} color={this.state.color} x={left} y={up} />
            let newTiles = this.state.tiles.slice();
            newTiles.push(tile);
            this.setState({
                tiles: newTiles
            })
        }
    };

    getPainting = (name) => {
        $.ajax({
            type: "GET",
            url: "/painting?name=" + name,
            dataType: "json",
            success: (data) => {
                data = JSON.parse(data.painting);
                let newTiles = data.map(x =>
                    <Tile color={x.props.color} x={x.props.x} y={x.props.y} />)
                this.setState({ tiles: newTiles, paintings: [] })
            },
            error: () => { console.log("error saving") }
        });
    };

    deletePainting = (name) => {
        $.ajax({
            type: "DELETE",
            url: "/delete?name=" + name,
            success: () => {
                this.getPaintingList();
            },
            error: () => { console.log("error delete") }
        });
    };


    getPaintingList = () => {
        $.ajax({
            type: "GET",
            url: "/paintings",
            dataType: "json",
            success: (data) => {
                this.setState({ paintings: data.paintings });
            },
            error: () => { console.log("error getting painting list") }
        });
    };

    addPainting = () => {

    }

    save = () => {
        $.ajax({
            type: "POST",
            url: "/save",
            contentType: "application/json",
            data: JSON.stringify({ painting: this.state.tiles, name: this.state.paintingName }),
            success: () => {
                this.setState({ paintingName: "" });
                this.getPaintingList();
            },
            error: () => { console.log("error saving") }
        });
    }

    render() {
        let colors = this.props.colors
            .map(color => {
                let selectedClass = this.state.color === color ? "selected" : "";
                return <Box color={color} callback={this.changeColor} selected={selectedClass} key={color}> </Box>
            });

        let login = this.props.username ? <div>Hello {this.props.username}</div> :
            <LoginForm />;
        return (
            <div>
                <div className="user">
                    {login}
                </div>
                <div className="content">
                    <div className="menu">
                        <span>Painting Name</span>
                        <input type="text" value={this.state.paintingName} onChange={(e) => this.setState({ paintingName: e.target.value })}></input>
                        <span className="menu-btn" onClick={this.save}>&#x2714;</span>
                        <div className="loaded">
                            <span className="menu-btn" onClick={() => this.getPaintingList()}>Load Paintings</span>
                            <div className="paint-list">
                                {this.state.paintings.map(x =>
                                    <div key={x.name} className="paint-item"
                                        onClick={(e) => { this.getPainting(e.target.textContent) }}>
                                        {x.name}
                                        <button onClick={() => this.deletePainting(x.name)}>&#10008;</button>
                                    </div>)
                                }
                            </div>

                        </div>
                    </div>
                    <div className="menu">
                        {colors}
                    </div>
                    <div className="board" onDragLeave={() => this.stopDrawing()} onMouseUp={this.stopDrawing}
                        onMouseDown={this.startDrawing} onMouseMove={this.draw} >
                        {this.state.tiles}
                    </div>
                </div>
            </div>
        );
    }
}