import React from "react";
import LoginForm from "./LoginForm.jsx";
import Box from "./Box.jsx"
import Canvas from "./Canvas.jsx";
import $ from "jquery";

// const BASE_URL = "http://localhost:8080"
const BASE_URL = ""

export default class PaintContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: "blue",
            paintingName: "",
            paintings: [],
            currentDrawingData: []
        }
        this.brushSizes = [2, 4, 6, 8];
    }

    updateDrawingData = (newTile) => {
        this.setState({
            currentDrawingData: [
                ...this.state.currentDrawingData,
                {
                    x: newTile.x,
                    y: newTile.y,
                    color: this.state.color
                }]
        });
    }

    changeColor = (color) => {
        this.setState({
            color: color
        });
    };

    getPainting = (name) => {
        $.ajax({
            type: "GET",
            url: BASE_URL + "/painting?name=" + name,
            dataType: "json",
            success: (data) => {
                data = JSON.parse(data.painting);
                this.setState({ currentDrawingData: data, paintings: [] })
            },
            error: () => { console.log("error saving") }
        });
    };

    deletePainting = (name) => {
        $.ajax({
            type: "DELETE",
            url: BASE_URL + "/delete?name=" + name,
            success: () => {
                this.getPaintingList();
            },
            error: () => { console.log("error delete") }
        });
    };


    getPaintingList = () => {
        $.ajax({
            type: "GET",
            url: BASE_URL + "/paintings",
            dataType: "json",
            success: (data) => {
                this.setState({ paintings: data.paintings });
            },
            error: () => { console.log("error getting painting list") }
        });
    };

    save = () => {
        $.ajax({
            type: "POST",
            url: BASE_URL + "/save",
            contentType: "application/json",
            data: JSON.stringify({ painting: this.state.currentDrawingData, name: this.state.paintingName }),
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
                                    <div>
                                        <span key={x.name} className="paint-item"
                                            onClick={(e) => { this.getPainting(x.name) }}>
                                            {x.name}
                                        </span>
                                        <button onClick={() => this.deletePainting(x.name)}>&#10008;</button>
                                    </div>)
                                }
                            </div>

                        </div>
                    </div>
                    <div className="menu">
                        {colors}
                    </div>
                    <Canvas color={this.state.color} drawingData={this.state.currentDrawingData} handleDrawingDataUpdated={this.updateDrawingData} />
                </div>
            </div>
        );
    }
}