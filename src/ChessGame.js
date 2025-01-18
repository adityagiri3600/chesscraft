import React, { useState, useEffect } from "react";
import { pieces as p, Piece } from "./Piece";

const Square = ({ piece, color, handleClick, isSelected, validMoveSquare, validCaptureMoveSquare }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "clamp(1.2rem, 5vw, 3rem)",
        backgroundColor: isSelected ? "rgb(46, 95, 20)" : color,
        // border: isSelected ? "2px solid red" : "none",
        // zIndex: isSelected ? "3" : "1",
        userSelect: "none",
      }}
      onClick={handleClick}
    >
      <div>
        {piece ? piece.image : ""}
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

async function combine(piece_one, piece_two) {
  const data = {
    piece_one: piece_one.name,
    piece_two: piece_two.name,
  };
  try {
    const response = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result);
    let piece = new Piece(
      `${piece_one.name}_${piece_two.name}`,
      `${piece_one.image}${piece_two.image}`,
      piece_one.side,
      result
    )
    return piece;
  } catch (error) {
    console.error("Error combining pieces:", error);
    return null;
  }
}

const ChessGame = () => {

  const initialBoardState = [
    p.b.rook, p.b.knight, p.b.bishop, p.b.queen, p.b.king, p.b.bishop, p.b.knight, p.b.rook,
    p.b.pawn, p.b.pawn, p.b.pawn, p.b.pawn, p.b.pawn, p.b.pawn, p.b.pawn, p.b.pawn,
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    p.w.pawn, p.w.pawn, p.w.pawn, p.w.pawn, p.w.pawn, p.w.pawn, p.w.pawn, p.w.pawn,
    p.w.rook, p.w.knight, p.w.bishop, p.w.queen, p.w.king, p.w.bishop, p.w.knight, p.w.rook
  ];

  const [boardState, setBoardState] = useState(initialBoardState);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [turn, setTurn] = useState("white");

  const [combining, setCombining] = useState(false);
  const [pieceOneIndex, setPieceOneIndex] = useState(null);
  const [pieceTwoIndex, setPieceTwoIndex] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: window.innerWidth < 1000 ? "column" : "row",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#2c2b29",
      }}
    >
      <button
        onClick={async () => {
          if (!combining){
            setCombining(true);
            return;
          }
          setPieceOneIndex(null);
          setPieceTwoIndex(null);
          setCombining(false);
          if (pieceOneIndex === null || pieceTwoIndex === null) {
            return;
          }
          try {
            const combinedPiece = await combine(boardState[pieceOneIndex], boardState[pieceTwoIndex]);
            if (combinedPiece) {
              console.log(boardState);
              setBoardState(prevBoardState => {
                const updatedBoardState = [...prevBoardState];
                updatedBoardState[pieceOneIndex] = "";
                updatedBoardState[pieceTwoIndex] = combinedPiece;
                return updatedBoardState; // Return the updated state
              });
            }
          } catch (error) {
            console.error("Error fetching pawn_knight:", error);
          }
        }}
        style={{
          padding: "10px 20px",
          fontSize: "1.5rem",
          backgroundColor: "#4e7837",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          margin: "20px",
          outline: "none",
        }}
      >
        {combining ?( pieceOneIndex&&pieceTwoIndex ? "Combine!!!!": "Cancel") : "Combine!"}
      </button>
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
              if (combining) {
                if (pieceOneIndex === i) {
                  setPieceOneIndex(null);
                  return;
                }
                if (pieceTwoIndex === i) {
                  setPieceTwoIndex(null);
                  return;
                }
                if (pieceOneIndex === null) {
                  setPieceOneIndex(i);
                  return;
                }
                if (pieceTwoIndex === null) {
                  setPieceTwoIndex(i);
                  return;
                }
              }
              if (selectedIndex === i) {
                setSelectedIndex(-1);
                return;
              }
              if (selectedIndex === -1) {
                if (boardState[i] !== "" && boardState[i].side !== turn) {
                  return;
                }
                setSelectedIndex(i);
                return;
              }
              // capture move
              if (
                boardState[selectedIndex] !== "" &&
                boardState[selectedIndex].isValidCaptureMove(selectedIndex, i, boardState) &&
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
              if (boardState[i] !== "" && boardState[i].side !== turn) {
                return;
              }
              // non-capture move
              if (
                boardState[selectedIndex] !== "" &&
                boardState[selectedIndex].isValidMove(selectedIndex, i, boardState) &&
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
              setSelectedIndex(i);
            };
            // white and black squares
            let color = Math.floor(i + i / 8) % 2 ? "#4e7837" : "#69923e";
            if (i === pieceOneIndex || i === pieceTwoIndex) color = "rgba(255, 81, 0, 0.8)";
            // square color for valid moves
            let validMoveSquare =  (
              selectedIndex !== -1 &&
              boardState[selectedIndex] !== "" &&
              boardState[selectedIndex].isValidMove(selectedIndex, i, boardState) &&
              boardState[i] === ""
            );
            // square color for valid capture moves
            let validCaptureMoveSquare = (
              selectedIndex !== -1 &&
              boardState[selectedIndex] !== "" &&
              boardState[selectedIndex].isValidCaptureMove(selectedIndex, i, boardState) &&
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
