import { Move } from "../model/move.model"
import { Game } from "../model/game.model"
import { ClassicField, WSGame } from "../types/ws.types";

export function endGame(game: WSGame): WSGame {
    // Implement the logic for ending the game

    // transform the WSGame to a Game (and the moves within it) and save it to the database
    return game;
}

/**
 * This function is called when a player makes a move in the game.
 */
export function updateGameState(game: WSGame, move: Move): WSGame {
    let result: WSGame = game;

    // check the game mode and use the appropriate logic to update the game state
    if (game.mode === "normal") {
        let [x, y] = move.position;

        // implement the logic for a normal game
        result = updateNormalGame(game, x, y);
    }

    // add the move to the game state



    return game;
}

/**
 * This function updates the game state for a normal 3x3 game of tic-tac-toe.
 * @param game The game to update
 * @param x The x coordinate of the move
 * @param y The y coordinate of the move
 * @returns The updated game
 */
function updateNormalGame(game: WSGame, x: number, y: number): WSGame {

    // Add the move to the game's moves array
    game.moves.push({
        player: game.curr,
        position: [x, y],
        timestamp: new Date().toISOString()
    });

    // Check for a win or draw - we know that the game is not finished in less than 5 moves

    if (game.moves.length >= 5) {
        const winner = checkWinner(game.field!);
        if (winner) {
            console.log(`Player ${winner} wins!`);
            // Handle the win (e.g., end the game, announce the winner, etc.)
        }
    } else if (game.moves.length === 9) {
        console.log('The game is a draw!');
        // Handle the draw (e.g., end the game, announce the draw, etc.)
    }

    // Switch the current player
    game.curr = game.curr === "x" ? "o" : "x";

    return game;
}

/**
 * This function checks the game board for a winner using boolean arrays and logical operations.
 * @param board The game board to check
 * @returns The winning player ("x" or "o") or null if there is no winner
 */
function checkWinner(board: ClassicField): "x" | "o" | null {
    // Create boolean arrays for "x" and "o"
    const xBoard = board.field.map(row => row.map(cell => cell === 'x'));
    const oBoard = board.field.map(row => row.map(cell => cell === 'o'));

    // Helper function to check for a win in a boolean board
    const checkBoard = (b: boolean[][]): boolean => {
        for (let i = 0; i < 3; i++) {
            // Check rows and columns
            if (b[i][0] && b[i][1] && b[i][2]) return true;
            if (b[0][i] && b[1][i] && b[2][i]) return true;
        }
        // Check diagonals
        if (b[0][0] && b[1][1] && b[2][2]) return true;
        if (b[0][2] && b[1][1] && b[2][0]) return true;
        return false;
    }

    if (checkBoard(xBoard)) return 'x';
    if (checkBoard(oBoard)) return 'o';
    return null;
}