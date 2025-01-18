export class Piece {
  constructor(name, image, side, moves) {
    this.name = name;
    this.image = image;
    this.side = side;
    this.moves = moves;
  }
  isValidMove = (start, end, boardState) => {
    const deltaX = (end % 8) - (start % 8);
    const deltaY = Math.floor(start / 8) - Math.floor(end / 8);
    let jumpMoves = this.moves.jump;
    for (let i = 0; i < jumpMoves.length; i++) {
      const element = jumpMoves[i];
      if (element[0] === deltaX && element[1] === deltaY) {
        return true;
      }
    }
    let directionMoves = this.moves.direction || [];
    for (let i = 0; i < directionMoves.length; i++) {
      const element = directionMoves[i];
      for (let scalar = 1; scalar < 8; scalar++) {
        if (boardState[start + element[0] * scalar - element[1] * scalar * 8] !== "") {
          break;
        }
        if (deltaX === element[0] * scalar && deltaY === element[1] * scalar)
          return true;
      }
    }

  };
  isValidCaptureMove = (start, end, boardState) => {
    const deltaX = (end % 8) - (start % 8);
    const deltaY = Math.floor(start / 8) - Math.floor(end / 8);
    let captureMoves = this.moves.capture ? this.moves.capture : this.moves;
    let jumpMoves = captureMoves.jump;
    for (let i = 0; i < jumpMoves.length; i++) {
      const element = jumpMoves[i];
      if (element[0] === deltaX && element[1] === deltaY) {
        return true;
      }
    }
    let directionMoves = captureMoves.direction || [];
    for (let i = 0; i < directionMoves.length; i++) {
      const element = directionMoves[i];
      for (let scalar = 1; scalar < 8; scalar++) {
        if (deltaX === element[0] * scalar && deltaY === element[1] * scalar)
          return true;
        if (boardState[start + element[0] * scalar - element[1] * scalar * 8] !== "") {
          break;
        }
      }
    }
  };
}

// export pieces
export const pieces = {
  w: {
    pawn: new Piece("pawn", "♙", "white", {
        jump: [[0, 1]],
        direction: [],
        capture: {
          jump: [[1, 1], [-1, 1]]
        }
      }
    ),
    rook: new Piece("rook", "♖", "white", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]
      }
    ),
    knight: new Piece("knight", "♘", "white", {
        jump: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
      }
    ),
    bishop: new Piece("bishop", "♗", "white", {
        jump: [],
        direction: [[1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    queen: new Piece("queen", "♕", "white", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    king: new Piece("king", "♔", "white", {
        jump: [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]]
      }
    ),
  },
  b: {
    pawn: new Piece("pawn", "♟", "black", {
        jump: [[0, -1]],
        direction: [],
        capture: {
          jump: [[1, -1], [-1, -1]]
        }
      }
    ),
    rook: new Piece("rook", "♜", "black", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1]]
      }
    ),
    knight: new Piece("knight", "♞", "black", {
        jump: [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [-2, 1], [2, -1], [-2, -1]]
      }
    ),
    bishop: new Piece("bishop", "♝", "black", {
        jump: [],
        direction: [[1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    queen: new Piece("queen", "♛", "black", {
        jump: [],
        direction: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
      }
    ),
    king: new Piece("king", "♚", "black", {
        jump: [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]]
      }
    )
  }
};
