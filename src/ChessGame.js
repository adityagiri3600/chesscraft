import React, { useState } from "react";
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
    piece_one: `${piece_one.side}_${piece_one.name}`,
    piece_two: `${piece_two.side}_${piece_two.name}`
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
      result.name,
      result.emoji,
      piece_one.side,
      result.description,
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
  const [loading, setLoading] = useState(false);

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(8, 1fr)",
          width: "90vmin",
          height: "90vmin",
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
                if (pieceOneIndex === null && boardState[i] !== "" && boardState[i].side === turn) {
                  setPieceOneIndex(i);
                  return;
                }
                if (pieceTwoIndex === null && boardState[i] !== "" && boardState[i].side === turn) {
                  setPieceTwoIndex(i);
                  return;
                }
                return
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
      <div style={{
        display: "flex",
        flexDirection: window.innerWidth < 1000 ? "row" : "column",
      }}>
        <button
          onClick={async () => {
            if (!combining){
              setCombining(true);
              setSelectedIndex(-1);
              return;
            }
            setPieceOneIndex(null);
            setPieceTwoIndex(null);
            setCombining(false);
            if (pieceOneIndex === null || pieceTwoIndex === null) {
              return;
            }
            try {
              setLoading(true);
              const combinedPiece = await combine(boardState[pieceOneIndex], boardState[pieceTwoIndex]);
              if (combinedPiece) {
                console.log(boardState);
                setBoardState(prevBoardState => {
                  const updatedBoardState = [...prevBoardState];
                  updatedBoardState[pieceOneIndex] = "";
                  updatedBoardState[pieceTwoIndex] = combinedPiece;
                  return updatedBoardState; 
                });
                setLoading(false);
                setTurn(turn === "white" ? "black" : "white");
              }
            } catch (error) {
              console.error("Error fetching pawn_knight:", error);
            }
          }}
          style={{
            padding: "10px 20px",
            fontSize: window.innerWidth > 500 ? "1.5rem" : "1rem",
            backgroundColor: "#4e7837",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            margin: "20px",
            outline: "none",
            display: "flex",
            justifyContent: "center",
            width: window.innerWidth > 500 ? "200px" : "auto",
            height: "fit-content",
          }}
        >
          {!loading && (combining ?( pieceOneIndex&&pieceTwoIndex ? "Combine!!!!": "Cancel") : "Combine!")}
          {loading&&"Crafting..."}
          {loading&&<div
            style={{
              marginLeft: "10px",
              width: "20px",
              height: "20px",
              border: "2px solid white",
              borderRadius: "50%",
              borderLeftColor: "transparent",
              borderTopColor: "transparent",
              animation: "spin 1s linear infinite",
              opacity: loading ? "1" : "0",
              transition: "all 1s"
            }}
            
          ></div>}
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </button>
        {selectedIndex !== -1 &&
          <div style={{
            color: "white",
            padding: "10px 0",
            backgroundColor: "rgba(9, 5, 1, 0.8)",
            borderRadius: "5px",
            margin: "20px",
            width: "200px",
            textAlign: "center",
          }}>
            <p>{boardState[selectedIndex].image} {boardState[selectedIndex].name}</p>
            <p>{boardState[selectedIndex].description}</p>
          </div>
        }
        {combining && <p style={{color: "white", margin: "20px"}}>Select two pieces to combine</p>}
      </div>
    </div>
  );
};

export default ChessGame;
