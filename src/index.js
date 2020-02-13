import React from "react";
import ReactDOM from "react-dom";
import { countNeighbors, arrayClone } from "./helper";
import {
  ButtonToolbar,
  Button,
  DropdownItem,
  DropdownButton,
  ButtonGroup
} from "react-bootstrap";
import "./index.css";

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };
  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}
class Grid extends React.Component {
  render() {
    const width = this.props.cols * 14;
    var rowsArr = [];

    var boxClass = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          ></Box>
        );
      }
    }
    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

class Buttons extends React.Component {
  handleSelect = evt => {
    this.props.gridSize(evt);
  };
  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <ButtonGroup>
            <Button className="btn btn-default" onClick={this.props.playButton}>
              Play
            </Button>
            <Button
              className="btn btn-default"
              onClick={this.props.pauseButton}
            >
              Pause
            </Button>
            <Button className="btn btn-default" onClick={this.props.clear}>
              Clear
            </Button>
            <Button className="btn btn-default" onClick={this.props.slow}>
              Slow
            </Button>
            <Button className="btn btn-default" onClick={this.props.fast}>
              Fast
            </Button>
            <Button className="btn btn-default" onClick={this.props.seed}>
              Seed
            </Button>
            <DropdownButton
              as={ButtonGroup}
              title="Grid Size"
              id="size-menu"
              onSelect={this.handleSelect}
            >
              <DropdownItem eventKey="1">20x10</DropdownItem>
              <DropdownItem eventKey="2">50x30</DropdownItem>
              <DropdownItem eventKey="3 ">70x50</DropdownItem>
            </DropdownButton>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false))
    };
  }

  selectBox = (row, col) => {
    let newGrid = arrayClone(this.state.gridFull);
    newGrid[row][col] = !newGrid[row][col];
    this.setState({ gridFull: newGrid });
  };

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  pauseButton = () => {
    clearInterval(this.intervalId);
  };

  play = () => {
    let grid = this.state.gridFull;
    let newGrid = arrayClone(this.state.gridFull);
    const rows = this.rows;
    const cols = this.cols;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let count = countNeighbors(grid, i, j, rows, cols);

        if (grid[i][j] && (count < 2 || count > 3)) {
          newGrid[i][j] = false;
        }
        if ((grid[i][j] && count === 2) || count === 3) {
          newGrid[i][j] = true;
        }
        if (!grid[i][j] && count === 3) {
          newGrid[i][j] = true;
        }
      }
    }
    this.setState({ gridFull: newGrid, generation: this.state.generation + 1 });
  };

  slow = () => {
    this.speed = 500;
    this.playButton();
  };

  fast = () => {
    this.speed = 100;
    this.playButton();
  };

  clear = () => {
    let grid = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));
    this.setState({ gridFull: grid, generation: 0 });
  };

  seed = () => {
    let newGrid = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          newGrid[i][j] = true;
        }
      }
    }
    this.setState({ gridFull: newGrid });
  };

  gridSize = size => {
    switch (size) {
      case "1":
        this.cols = 20;
        this.rows = 10;
        break;
      case "2":
        this.cols = 50;
        this.rows = 30;
        break;
      default:
        this.cols = 70;
        this.rows = 50;
    }
    this.clear();
  };

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div>
        <h1>Game Of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          clear={this.clear}
          slow={this.slow}
          fast={this.fast}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation} </h2>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
