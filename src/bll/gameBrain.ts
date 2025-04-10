class AiGridMove {
    public gridStartX: number;
    public gridStartY: number;

    constructor(gridStartX: number, gridStartY: number) {
        this.gridStartX = gridStartX;
        this.gridStartY = gridStartY;
    }
}

interface NextAction {
    action: string;
    oldX: number | null;
    oldY: number | null;
    newX: number | null;
    newY: number | null;
    newGridStartX: number | null;
    newGridStartY: number | null;
}

export type playerChar = "X" | "O" | "&nbsp;";
export type boardType = (playerChar[])[];

export class GameBrain {
    public dimX: number = 5;
    public dimY: number = 5;
    private _board: boardType = Array.from({ length: this.dimX }, () =>
        Array(this.dimY).fill('&nbsp;')
    );
    public aiGridMoves: AiGridMove[];
    public currentPlayer: playerChar = "X";
    public winCondition: number = 3;
    public amountOfPieces: number = 4;
    public amountOfPiecesX: number = 4;
    public amountOfPiecesO: number = 4;
    public piecesPlaced: number = 0;
    public gridStartX: number = 1;
    public gridStartY: number = 1;
    public gridEndX: number = 3;
    public gridEndY: number = 3;
    public gridWidth: number = 3; // GridX
    public gridHeight: number = 3; // GridY
    public tieOrHasWinner: boolean = false;
    public turnsToMoveGrid = 0; // MOVE GRID EVERY 2ND TURN

    constructor() {
        this.aiGridMoves = [];
    }

    get board(): boardType {
        return this._board;
    }

    public flipNextPiece(): void {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }

    public makeAmove(x: number, y: number): boolean {
        console.log(`x - ${x}, y - ${y}`);
        if (!this.isInsideGrid(x, y)) {
            console.log("outside Grid");
            this._board[x][y] = "&nbsp;";
            return false;
        }
        if (this._board[x][y] === undefined || this._board[x][y] === "&nbsp;") {
            if (this.currentPlayer === "X") {
                if (this.amountOfPiecesX === 0) {
                    console.log("no pieces left for X");
                    this._board[x][y] = "&nbsp;";
                    return false;
                }
                this.amountOfPiecesX--;
            } else {
                if (this.amountOfPiecesO === 0) {
                    console.log("no pieces left for O");
                    this._board[x][y] = "&nbsp;";
                    return false;
                }
                this.amountOfPiecesO--;
            }

            this._board[x][y] = this.currentPlayer;
            this.flipNextPiece();
            this.piecesPlaced++;
            if (this.turnsToMoveGrid > 0) {
                this.turnsToMoveGrid--;
            }
            console.log(`x - ${x}, y - ${y}`);

            return true;
        }
        return false;
    }


    
    public moveGrid(newGridStartX: number, newGridStartY: number): void {
        if (this.piecesPlaced < 4) {
            console.log("not enough pieces placed.");
            return;
        }
        if (
            this.dimX - newGridStartX < this.gridWidth ||
            this.dimY - newGridStartY < this.gridHeight
        ) {
            console.log("Can't move grid that much!");
            return;
        }
        if (
            newGridStartX == this.gridStartX &&
            newGridStartY == this.gridStartY
        ) {
            console.log(
                "There is no point in moving grid to same position where it is right now. Try again."
            );
            return;
        }
        console.log(this.turnsToMoveGrid);
        if (this.turnsToMoveGrid  === 0) {
            this.turnsToMoveGrid += 2;
            this.gridStartX = newGridStartX;
            this.gridStartY = newGridStartY;
            this.gridEndX = this.gridStartX + this.gridWidth - 1;
            this.gridEndY = this.gridStartY + this.gridHeight - 1;
            console.log(`Player - ${this.currentPlayer}`);
            this.flipNextPiece();
            return;
        }

    }

    public movePiece(oldX: number, oldY: number, newX: number, newY: number): void {
        if (this.piecesPlaced < 4) {
            console.log("not enough pieces placed.");
            // this._board[oldX][oldY] = "&nbsp;";
            return;
        }

        let checkPiece = this._board[oldX][oldY];

        if (checkPiece === "&nbsp;" || checkPiece != this.currentPlayer) {
            console.log("Can't move nothing/enemy piece");
            this._board[oldX][oldY] = "&nbsp;";
            return;
        }

        if (
            this.isInsideGrid(newX, newY) &&
            this.board[oldX][oldY] === this.currentPlayer &&
            (this.board[newX][newY] === undefined ||
                this.board[newX][newY] === "&nbsp;")
        ) {
            this.board[newX][newY] = this.currentPlayer;
            this.board[oldX][oldY] = "&nbsp;";  // undefined;
            this.flipNextPiece();
            if (this.turnsToMoveGrid > 0) {
                this.turnsToMoveGrid--;
            }
        }
    }

    public isInsideGrid(x: number, y: number): boolean {
        return (
            x >= this.gridStartX &&
            x <= this.gridEndX &&
            y >= this.gridStartY &&
            y <= this.gridEndY
        );
    }

    public resetGame(): void {
        this._board = Array.from({ length: this.dimX }, () =>
            Array(this.dimY).fill('&nbsp;')
        );
        this.currentPlayer = "X";
        this.amountOfPieces = 4;
        this.amountOfPiecesX = 4;
        this.amountOfPiecesO = 4;
        this.piecesPlaced = 0;
        this.gridStartX = 1;
        this.gridStartY = 1;
        this.gridEndX = 3;
        this.gridEndY = 3;
        this.gridWidth = 3; // GridX
        this.gridHeight = 3; // GridY
        this.aiGridMoves = [];
        this.tieOrHasWinner = false;
    }

    public checkTie(): boolean {
        for (let x: number = 0; x < this.dimX; x++) {
            for (let y: number = 0; y < this.dimY; y++) {
                if (this._board[x][y] === undefined || this._board[x][y] === "&nbsp;") {
                    return false;
                }
            }
        }
        this.tieOrHasWinner = true;
        return true;
    }

    public winColumn(): string | null {
        let winnerCount = 0;
        let winner = "";
        for (let x: number = 0; x < this.dimX; x++) {
            let countX = 0;
            let countO = 0;
            for (let y: number = 0; y < this.dimY; y++) {
                if (!this.isInsideGrid(x, y)) continue;

                if (this._board[x][y] === "X") {
                    countX++;
                    countO = 0;
                } else if (this._board[x][y] === "O") {
                    countO++;
                    countX = 0;
                }

                if (countX === this.winCondition) {
                    winnerCount++;
                    winner = "X";
                }
                if (countO === this.winCondition) {
                    winnerCount++;
                    winner = "O";
                }

                
                if (this._board[x][y] === undefined || this._board[x][y] === "&nbsp;") {
                    countX = 0;
                    countO = 0;
                }
            }
        }
        if (winnerCount === 2) {
            this.tieOrHasWinner = true;
            return "TIE";
        }
        if (winnerCount === 1) {
            this.tieOrHasWinner = true;
            return winner;
        }
        return null;
    }

    public winRow(): string | null {
        let winnerCount = 0;
        let winner = "";
        for (let y: number = 0; y < this.dimY; y++) {
            let countX = 0;
            let countO = 0;
            for (let x: number = 0; x < this.dimX; x++) {
                if (!this.isInsideGrid(x, y)) continue;

                if (this._board[x][y] === "X") {
                    countX++;
                    countO = 0;
                } else if (this._board[x][y] === "O") {
                    countO++;
                    countX = 0;
                }

                if (countX === this.winCondition) {
                    winnerCount++;
                    winner = "X";
                }
                if (countO === this.winCondition) {
                    winnerCount++;
                    winner = "O";
                }

                if (this._board[x][y] === undefined || this._board[x][y] === "&nbsp;") {
                    countX = 0;
                    countO = 0;
                }
            }
        }
        if (winnerCount === 2) {
            this.tieOrHasWinner = true;
            return "TIE";
        }
        if (winnerCount === 1) {
            this.tieOrHasWinner = true;
            return winner;
        }

        return null;
    }

    public winDiagonal(): string | null | undefined {
        for (let startRow: number = 0; startRow < this.dimY; startRow++) {
            for (let startCol: number = 0; startCol < this.dimX; startCol++) {
                if (
                    this.isValidDiagonalStart(startRow, startCol, 1, 1) &&
                    this.checkConsecutivePieces(startRow, startCol, 1, 1)
                ) {
                    this.tieOrHasWinner = true;
                    return this._board[startRow][startCol];
                }
                if (
                    this.isValidDiagonalStart(startRow, startCol, 1, -1) &&
                    this.checkConsecutivePieces(startRow, startCol, 1, -1)
                ) {
                    this.tieOrHasWinner = true;
                    return this._board[startRow][startCol];
                }
            }
        }
        return null;
    }

    public isValidDiagonalStart(row: number, col: number, rowDir: number, colDir: number): boolean {
        let endRow = row + (this.winCondition - 1) * rowDir;
        let endCol = col + (this.winCondition - 1) * colDir;

        if (
            endRow < 0 ||
            endRow >= this.dimY ||
            endCol < 0 ||
            endCol >= this.dimX
        ) {
            return false;
        }

        for (let i = 0; i < this.winCondition; i++) {
            let newRow = row + i * rowDir;
            let newCol = col + i * colDir;
            if (!this.isInsideGrid(newRow, newCol)) {
                return false;
            }
        }
        return true;
    }

    public checkConsecutivePieces(startRow: number, startCol: number, rowDir: number, colDir: number): boolean {
        let firstPiece = this._board[startRow][startCol];

        if (firstPiece === undefined || firstPiece === "&nbsp;") {
            return false;
        }

        for (let i = 1; i < this.winCondition; i++) {
            let newRow = startRow + i * rowDir;
            let newCol = startCol + i * colDir;

            if (
                newRow < 0 ||
                newRow >= this.dimY ||
                newCol < 0 ||
                newCol >= this.dimX
            ) {
                return false;
            }

            if (!this.isInsideGrid(newRow, newCol)) return false;

            if (this._board[newRow][newCol] != firstPiece) {
                return false;
            }
        }
        return true;
    }

    private validateCoordinates(x: number, y: number): boolean {
        return x < this.dimX && y < this.dimY && x >= 0 && y >= 0;
    }

    public aiAction(): void {
        let nextAction: NextAction = this.decideNextAction();

        if (nextAction.action === "PlacePiece"
            && typeof (nextAction.oldX) === "number"
            && typeof (nextAction.oldY) === "number") {
            this.makeAmove(nextAction.oldX, nextAction.oldY);
        } else if (nextAction.action === "MovePiece"
            && typeof (nextAction.oldX) === "number"
            && typeof (nextAction.oldY) === "number"
            && typeof (nextAction.newX) === "number"
            && typeof (nextAction.newY) === "number") {
            this.movePiece(
                nextAction.oldX,
                nextAction.oldY,
                nextAction.newX,
                nextAction.newY
            );
        } else {
            if (typeof (nextAction.newGridStartX) === "number"
                && typeof (nextAction.newGridStartY) === "number") {
                this.moveGrid(nextAction.newGridStartX, nextAction.newGridStartY);
                this.aiGridMoves.push(
                    new AiGridMove(
                        nextAction.newGridStartX,
                        nextAction.newGridStartY
                    )
                );
            }
        }
    }

    private decideNextAction() {
        // Default action is to place a piece
        let chosenAction: string = "PlacePiece";
        let bestScore: number = Number.MIN_SAFE_INTEGER;
        let bestMove: { x: number, y: number } = { x: -1, y: -1 };
        let bestPieceMove: { oldX: number, oldY: number, newX: number, newY: number } = { oldX: -1, oldY: -1, newX: -1, newY: -1 };
        let bestGridShift: { bestShiftX: number, bestShiftY: number } = { bestShiftX: 0, bestShiftY: 0 };

        // Check if only placing pieces is allowed
        if (this.piecesPlaced === 0) {
            bestMove = this.getRandomMove();
            console.log("Random move x: " + bestMove.x + " y: " + bestMove.y);
            return {
                action: chosenAction,
                oldX: bestMove.x,
                oldY: bestMove.y,
                newX: null,
                newY: null,
                newGridStartX: null,
                newGridStartY: null,
            };
        }

        // Shift the grid to disrupt the opponent's winning paths.
        if (this.countOpponentWinningMovesInsideGrid() > 1 && this.turnsToMoveGrid === 0) {
            chosenAction = "MoveGrid";
            bestGridShift = this.findBestGridShift();
            return {
                action: chosenAction,
                oldX: null,
                oldY: null,
                newX: null,
                newY: null,
                newGridStartX: bestGridShift.bestShiftX,
                newGridStartY: bestGridShift.bestShiftY,
            };
        }

        // Prioritize placing pieces first
        if (
            this.getPlayersPlacedPiecesAmount(this.currentPlayer) <
            this.amountOfPieces
        ) {
            for (let x: number = 0; x < this.dimX; x++) {
                for (let y: number = 0; y < this.dimY; y++) {
                    if (
                        (this._board[x][y] !== undefined &&
                            this._board[x][y] !== "&nbsp;") ||
                        !this.isInsideGrid(x, y)
                    ) {
                        continue;
                    }
                    this._board[x][y] = this.currentPlayer;
                    let moveScore: number = this.evaluateMove(x, y);
                    this._board[x][y] = "&nbsp;"; // undefined;

                    if (moveScore > bestScore) {
                        bestScore = moveScore;
                        bestMove.x = x;
                        bestMove.y = y;
                    }
                }
            }
            if (bestScore === -1) {
                if (this.piecesPlaced === 1) {
                    bestMove = this.getRandomMove();
                } else {
                    bestMove = this.getMoveNextToExistingOwnPiece();
                }
            }

            if (this.isInsideGrid(bestMove.x, bestMove.y)) {
                return {
                    action: chosenAction,
                    oldX: bestMove.x,
                    oldY: bestMove.y,
                    newX: null,
                    newY: null,
                    newGridStartX: null,
                    newGridStartY: null,
                };
            }
        }
        console.log("x: " + bestMove.x + "y: " + bestMove.y);
        // Once ActionsAllowed threshold is reached, consider other actions
        // 1. Move a piece
        let piecesOutsideGrid = this.getPiecesOutsideGrid(this.currentPlayer);
        if (piecesOutsideGrid.length > 0) {
            let oldCoords = piecesOutsideGrid[0];
            for (let x: number = this.gridStartX; x <= this.gridEndX; x++) {
                for (let y: number = this.gridStartY; y <= this.gridEndY; y++) {
                    if (this._board[x][y] !== undefined && this.board[x][y] !== "&nbsp;") {
                        continue;
                    }
                    console.log(`x: ${x}, y: ${y}`);
                    let simulation = this.simulateMovingPiece(
                        oldCoords.x,
                        oldCoords.y,
                        x,
                        y,
                        bestScore,
                        chosenAction,
                        bestPieceMove
                    );
                    bestScore = simulation.bestScore;
                    bestPieceMove.oldX = simulation.oldX;
                    bestPieceMove.oldY = simulation.oldY;
                    bestPieceMove.newX = simulation.newX;
                    bestPieceMove.newY = simulation.newY;
                    chosenAction = simulation.chosenAction;
                }
            }
            console.log(bestScore);
            if (bestScore === -1) {
                let moveNextToExistingOwnPiece =
                    this.getMoveNextToExistingOwnPiece();
                console.log(moveNextToExistingOwnPiece);
                bestPieceMove.oldX = oldCoords.x;
                bestPieceMove.oldY = oldCoords.y;
                bestPieceMove.newX = moveNextToExistingOwnPiece.x;
                bestPieceMove.newY = moveNextToExistingOwnPiece.y;
                chosenAction = "MovePiece";
            }
        } else {
            for (let x: number = 0; x < this.dimX; x++) {
                for (let y: number = 0; y < this.dimY; y++) {
                    if (this._board[x][y] === this.currentPlayer) {
                        let newCoords = this.getMoveNextToExistingOwnPiece();
                        let simulation = this.simulateMovingPiece(
                            x,
                            y,
                            newCoords.x,
                            newCoords.y,
                            bestScore,
                            chosenAction,
                            bestPieceMove
                        );
                        bestScore = simulation.bestScore;
                        bestPieceMove.oldX = simulation.oldX;
                        bestPieceMove.oldY = simulation.oldY;
                        bestPieceMove.newX = simulation.newX;
                        bestPieceMove.newY = simulation.newY;
                        chosenAction = simulation.chosenAction;
                    }
                }
            }
        }

        if (
            bestPieceMove.oldX !== -1 &&
            bestPieceMove.oldY !== -1 &&
            bestPieceMove.newX !== -1 &&
            bestPieceMove.newY !== -1 &&
            this.countSelfWinningMovesInsideGrid() > 0
        ) {
            console.log(bestPieceMove);
            console.log(`sX : ${this.gridStartX}, eX: ${this.gridEndX}, sY: ${this.gridStartY}, eY: ${this.gridEndY}`);
            return {
                action: chosenAction,
                oldX: bestPieceMove.oldX,
                oldY: bestPieceMove.oldY,
                newX: bestPieceMove.newX,
                newY: bestPieceMove.newY,
                newGridStartX: null,
                newGridStartY: null,
            };
        }

        // 2. Shift the grid
        bestGridShift = this.findBestGridShift();
        console.log(`bestGridShit:\nX - ${bestGridShift.bestShiftX }\nY - ${bestGridShift.bestShiftY }`);
        if (this.turnsToMoveGrid === 0) {
            console.log(bestGridShift);
            chosenAction = "MoveGrid";
            return {
                action: chosenAction,
                oldX: null,
                oldY: null,
                newX: null,
                newY: null,
                newGridStartX: bestGridShift.bestShiftX,
                newGridStartY: bestGridShift.bestShiftY,
            };
        }

        // Return the chosen action and its parameters
        switch (chosenAction) {
            case "PlacePiece":
                return {
                    action: chosenAction,
                    oldX: bestMove.x,
                    oldY: bestMove.y,
                    newX: null,
                    newY: null,
                    newGridStartX: null,
                    newGridStartY: null,
                };
            case "MovePiece":
                return {
                    action: chosenAction,
                    oldX: bestPieceMove.oldX,
                    oldY: bestPieceMove.oldY,
                    newX: bestPieceMove.newX,
                    newY: bestPieceMove.newY,
                    newGridStartX: null,
                    newGridStartY: null,
                };
            case "MoveGrid":
                return {
                    action: chosenAction,
                    oldX: null,
                    oldY: null,
                    newX: null,
                    newY: null,
                    newGridStartX: bestGridShift.bestShiftX,
                    newGridStartY: bestGridShift.bestShiftY,
                };
            default:
                throw new Error("No valid action found!");
        }
    }

    private evaluateMove(x: number, y: number): number {
        if (this.checkSelfWin()) {
            return 1;
        }

        this._board[x][y] = this.getOpponentPiece();
        let oppCanWin: boolean = this.checkOpponentWin();
        this._board[x][y] = "&nbsp;"; // undefined;

        if (oppCanWin) {
            return 0;
        }

        return -1;
    }

    private simulateGridShift(newStartX: number, newStartY: number): void {
        this.gridStartX = newStartX;
        this.gridStartY = newStartY;
        this.gridEndX = newStartX + this.gridWidth - 1;
        this.gridEndY = newStartY + this.gridHeight - 1;
    }

    private undoGridShift(prevStartX: number, prevStartY: number): void {
        this.gridStartX = prevStartX;
        this.gridStartY = prevStartY;
        this.gridEndX = prevStartX + this.gridWidth - 1;
        this.gridEndY = prevStartY + this.gridHeight - 1;
    }

    private evaluateBoard(): number {
        let enemyCount: number = 0;
        let opponent: string = this.getOpponentPiece();

        for (let x: number = this.gridStartX; x <= this.gridEndX; x++) {
            for (let y: number = this.gridStartY; y <= this.gridEndY; y++) {
                if (this._board[x][y] === opponent) {
                    enemyCount++;
                }
            }
        }
        if (this.countOpponentWinningMovesInsideGrid() > 0) {
            return Number.MIN_SAFE_INTEGER;
        }
        return -enemyCount;
    }

    private findBestGridShift(): { bestShiftX: number, bestShiftY: number } {
        let bestScore: number = Number.MIN_SAFE_INTEGER;
        let bestShift: { bestShiftX: number, bestShiftY: number } = { bestShiftX: 0, bestShiftY: 0 };

        let prevStartX: number = this.gridStartX;
        let prevStartY: number = this.gridStartY;

        for (let x: number = 0; x <= this.dimX - this.gridWidth; x++) {
            for (let y: number = 0; y <= this.dimY - this.gridHeight; y++) {
                this.simulateGridShift(x, y);
                let score: number = this.evaluateBoard();
                this.undoGridShift(prevStartX, prevStartY);
                console.log(`score - ${score}\nbestScore - ${bestScore}\n score > bestScore = ${score > bestScore}`);
                if (score > bestScore) {
                    let rndmX = Math.random();
                    let rndmY = Math.random();
                    console.log(`rndmX - ${rndmX}\nrndmY - ${rndmY}\nthis.dimX - this.gridWidth - ${this.dimX - this.gridWidth}\nthis.dimY - this.gridHeight - ${this.dimY - this.gridHeight}`);
                    let randomShiftX: number = Math.floor(
                        rndmX * (this.dimX - this.gridWidth)
                    );
                    let randomShiftY: number = Math.floor(
                        rndmY * (this.dimY - this.gridHeight)
                    );
                    console.log(`randomShiftX - ${randomShiftX}\nrandomShiftY - ${randomShiftY}`);
                    bestScore = score;
                    bestShift.bestShiftX = randomShiftX;
                    bestShift.bestShiftY = randomShiftY;
                    console.log(`bestShift.bestShiftX - ${bestShift.bestShiftX}\nbestShift.bestShiftY - ${bestShift.bestShiftY}`);

                    if (
                        this.aiGridMoves.filter(
                            (v) => v.gridStartX === x && v.gridStartY === y
                        ).length < 2
                    ) {
                        console.log(`x - ${x}\ny - ${y}`);
                        bestShift.bestShiftX = x;
                        bestShift.bestShiftY = y;
                    }
                    console.log(`bestShiftX - ${bestShift.bestShiftX}\nbestShiftY - ${bestShift.bestShiftY}`);
                }
            }
        }
        return bestShift;
    }

    private simulateMovingPiece(
        oldX: number,
        oldY: number,
        newX: number,
        newY: number,
        bestScore: number,
        chosenAction: string,
        bestPieceMove: { oldX: number, oldY: number, newX: number, newY: number }
    ) {
        this._board[oldX][oldY] = this.getOpponentPiece();
        let opponentCanWin: boolean = this.checkOpponentWin();

        this._board[oldX][oldY] = "&nbsp;"; // undefined;
        this._board[newX][newY] = this.currentPlayer;

        let moveScore: number = this.evaluateMove(newX, newY);
        this._board[newX][newY] = "&nbsp;"; // undefined;
        this._board[oldX][oldY] = this.currentPlayer;

        console.log(moveScore);
        console.log(bestScore);
        console.log(opponentCanWin);
        if (moveScore > bestScore && !opponentCanWin) {
            bestScore = moveScore;

            bestPieceMove.oldX = oldX;
            bestPieceMove.oldY = oldY;
            bestPieceMove.newX = newX;
            bestPieceMove.newY = newY;

            chosenAction = "MovePiece";
        }
        return {
            oldX: bestPieceMove.oldX,
            oldY: bestPieceMove.oldY,
            newX: bestPieceMove.newX,
            newY: bestPieceMove.newY,
            bestScore: bestScore,
            chosenAction: chosenAction,
        };
    }

    private getOpponentPiece(): playerChar {
        return this.currentPlayer === "X" ? "O" : "X";
    }

    private checkOpponentWin(): boolean {
        let oppWin = (
            this.winColumn() === this.getOpponentPiece() ||
            this.winRow() === this.getOpponentPiece() ||
            this.winDiagonal() === this.getOpponentPiece()
        );
        console.log(this.winColumn());
        console.log(this.winRow());
        console.log(this.winDiagonal());
        console.log(oppWin);
        this.tieOrHasWinner = false;
        return oppWin;
    }

    private countOpponentWinningMovesInsideGrid(): number {
        let winCount: number = 0;
        let opponent: playerChar = this.getOpponentPiece();

        for (let x: number = this.gridStartX; x <= this.gridEndX; x++) {
            for (let y: number = this.gridStartY; y <= this.gridEndY; y++) {
                if (this._board[x][y] === undefined || this._board[x][y] === "&nbsp;") {
                    this._board[x][y] = opponent;
                    if (this.checkOpponentWin()) {
                        winCount++;
                    }
                    this._board[x][y] = "&nbsp;"; // undefined;

                    if (winCount > 1) {
                        return winCount;
                    }
                }
            }
        }
        return winCount;
    }

    private countSelfWinningMovesInsideGrid(): number {
        let winCount: number = 0;
        let self: playerChar = this.currentPlayer;

        for (let x: number = this.gridStartX; x <= this.gridEndX; x++) {
            for (let y: number = this.gridStartY; y <= this.gridEndY; y++) {
                if (this._board[x][y] === undefined || this._board[x][y] === "&nbsp;") {
                    this._board[x][y] = self;
                    if (this.checkSelfWin()) {
                        winCount++;
                    }
                    this._board[x][y] = "&nbsp;"; // undefined;
                    if (winCount > 1) {
                        return winCount;
                    }
                }
            }
        }
        return winCount;
    }

    private checkSelfWin(): boolean {
        let selfWin = (
            this.winColumn() === this.currentPlayer ||
            this.winRow() === this.currentPlayer ||
            this.winDiagonal() === this.currentPlayer
        );
        this.tieOrHasWinner = false;
        return selfWin;
    }

    private getRandomMove(): { x: number, y: number } {
        let x: number = Math.floor(Math.random() * this.dimX);
        let y: number = Math.floor(Math.random() * this.dimY);

        while (!this.isInsideGrid(x, y) || (this._board[x][y] !== undefined && this._board[x][y] !== "&nbsp;")) {
            x = Math.floor(Math.random() * this.dimX);
            y = Math.floor(Math.random() * this.dimY);
        }

        return { x: x, y: y };
    }

    private getMoveNextToExistingOwnPiece(): { x: number, y: number } {
        for (let x: number = 0; x < this.dimX; x++) {
            for (let y: number = 0; y < this.dimY; y++) {
                if (this._board[x][y] === this.currentPlayer) {
                    for (let i = -1; i <= 1; i++) {
                        let nextX = x + i;
                        for (let j = -1; j <= 1; j++) {
                            let nextY = y + j;
                            if (
                                this.validateCoordinates(nextX, nextY) &&
                                (this._board[nextX][nextY] === undefined || this._board[nextX][nextY] === "&nbsp;") &&
                                this.isInsideGrid(nextX, nextY)
                            ) {
                                return { x: nextX, y: nextY };
                            }
                        }
                    }
                }
            }
        }
        return { x: -1, y: -1 };
    }

    private getPiecesOutsideGrid(player: string) {
        let piecesOutside: { x: number, y: number }[] = [];

        for (let x: number = 0; x < this.dimX; x++) {
            for (let y: number = 0; y < this.dimY; y++) {
                if (this._board[x][y] === player && !this.isInsideGrid(x, y)) {
                    piecesOutside.push({ x: x, y: y });
                }
            }
        }
        return piecesOutside;
    }

    private getPlayersPlacedPiecesAmount(player: string) {
        let amount: number = 0;
        for (let x: number = 0; x < this.dimX; x++) {
            for (let y: number = 0; y < this.dimY; y++) {
                if (this._board[x][y] === player) {
                    amount++;
                }
            }
        }
        return amount;
    }
}
