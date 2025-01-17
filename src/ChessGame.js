import React, { useState } from "react";

const Square = ({ piece, color, handleClick, isSelected, validMoveSquare, validCaptureMoveSquare }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2em",
        backgroundColor: isSelected ? "rgb(46, 95, 20)" : color,
        // border: isSelected ? "2px solid red" : "none",
        // zIndex: isSelected ? "3" : "1",
        userSelect: "none",
      }}
      onClick={handleClick}
    >
      <div>
        {piece.image}
      </div>
      {(validMoveSquare || validCaptureMoveSquare) && <div style={{
        position: "absolute",
        width: "20px",
        height: "20px",
        backgroundColor: validMoveSquare ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)",
        zIndex: "1",
        borderRadius: "50%",
      }}></div>}
    </div>
  );
};

class Piece {
  constructor(name, image, side, validMoves, validCaptureMoves) {
    this.name = name;
    this.image = image;
    this.side = side;
    this.validMoves = validMoves;
    this.validCaptureMoves = validCaptureMoves;
  }
  isValidMove = (start, end) => {
    const deltaX = (end % 8) - (start % 8);
    const deltaY = Math.floor(start / 8) - Math.floor(end / 8);
    for (let i = 0; i < this.validMoves.length; i++) {
      const element = this.validMoves[i];
      if (element[0] === deltaX && element[1] === deltaY) {
        return true;
      }
    }
  };
  isValidCaptureMove = (start, end) => {
    const deltaX = (end % 8) - (start % 8);
    const deltaY = Math.floor(start / 8) - Math.floor(end / 8);
    for (let i = 0; i < this.validCaptureMoves.length; i++) {
      const element = this.validCaptureMoves[i];
      if (element[0] === deltaX && element[1] === deltaY) {
        return true;
      }
    }
  };
}

const ChessGame = () => {
  let pawn = new Piece(
    "pawn",
    "♙",
    "white",
    [[0, -1]],
    [
      [1, -1],
      [-1, -1],
    ]
  );
  const [boardState, setBoardState] = useState(
    new Array(64).fill("").map((square, index) => {
      if (index === 0) return pawn;
      if (index === 9) return new Piece("pawn", "♟", "black", [[0, 1]], [
        [1, 1],
        [-1, 1],
      ]);
      return "";
    })
  );
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [turn, setTurn] = useState("white");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#2c2b29",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "95vmin",
          height: "95vmin",
          margin: "auto",
          boxShadow: "10px 10px 50px rgba(0, 0, 0, 0.71)",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        {Array(64)
          .fill()
          .map((_, i) => {
            let piece = boardState[i];
            let handleClick = () => {
              if (selectedIndex === i) {
                setSelectedIndex(-1);
                return;
              }
              if (boardState[i] !== "" && boardState[i].side !== turn) {
                return;
              }
              if (selectedIndex === -1) {
                setSelectedIndex(i);
                return;
              }
              // non-capture move
              if (
                boardState[selectedIndex] !== "" &&
                boardState[selectedIndex].isValidMove(selectedIndex, i) &&
                boardState[i] === ""
              ) {
                const updatedBoardState = [...boardState];
                updatedBoardState[i] = boardState[selectedIndex];
                updatedBoardState[selectedIndex] = "";
                setBoardState(updatedBoardState);
                setSelectedIndex(-1);
                setTurn(turn === "white" ? "black" : "white");
                return;
              }
              // capture move
              if (
                boardState[selectedIndex] !== "" &&
                boardState[selectedIndex].isValidCaptureMove(selectedIndex, i) &&
                boardState[i] !== "" &&
                boardState[i].side !== boardState[selectedIndex].side
              ) {
                const updatedBoardState = [...boardState];
                updatedBoardState[i] = boardState[selectedIndex];
                updatedBoardState[selectedIndex] = "";
                setBoardState(updatedBoardState);
                setSelectedIndex(-1);
                setTurn(turn === "white" ? "black" : "white");
                return;
              }
              setSelectedIndex(i);
            };
            // white and black squares
            let color = Math.floor(i + i / 8) % 2 ? "#4e7837" : "#69923e";
            // square color for valid moves
            let validMoveSquare =  (
              selectedIndex !== -1 &&
              boardState[selectedIndex] !== "" &&
              boardState[selectedIndex].isValidMove(selectedIndex, i) &&
              boardState[i] === ""
            );
            // square color for valid capture moves
            let validCaptureMoveSquare = (
              selectedIndex !== -1 &&
              boardState[selectedIndex] !== "" &&
              boardState[selectedIndex].isValidCaptureMove(selectedIndex, i) &&
              boardState[i] !== "" &&
              boardState[i].side !== boardState[selectedIndex].side
            );
            return (
              <Square
                key={i}
                piece={piece}
                color={color}
                handleClick={handleClick}
                isSelected={i === selectedIndex}
                validMoveSquare={validMoveSquare}
                validCaptureMoveSquare={validCaptureMoveSquare}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ChessGame;
