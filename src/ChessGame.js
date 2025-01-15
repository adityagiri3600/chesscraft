import React, { useState } from "react";

const Square = ({ piece, color, handleClick, isSelected }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "2em",
        backgroundColor: color,
        border: isSelected ? "2px solid red" : "none",
        zIndex: isSelected ? "3" : "1"
      }}
      onClick={handleClick}
    >
      {piece}
    </div>
  );
};

const ChessGame = () => {
  const [boardState, setBoardState] = useState(
    new Array(64)
      .fill("")
      .map((square, index) => (index === 0 ? "pawn" : square))
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

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
                if (selectedIndex===-1){
                    setSelectedIndex(i)
                    return;
                }
                if (selectedIndex===i){
                    setSelectedIndex(-1);
                    return;
                }
                if (boardState[selectedIndex]!==""){
                    const updatedBoardState = [...boardState]
                    updatedBoardState[i] = boardState[selectedIndex];
                    updatedBoardState[selectedIndex] = "";
                    setBoardState(updatedBoardState);
                }
                setSelectedIndex(i);
            }
            return (
              <Square
                key={i}
                piece={piece}
                color={Math.floor(i + i / 8) % 2 ? "#4e7837" : "#69923e"}
                handleClick={handleClick}
                isSelected={i===selectedIndex}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ChessGame;
