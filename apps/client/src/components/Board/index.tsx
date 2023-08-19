import React, { useEffect, useState } from "react";
import { GameState } from "@/shared/types/game";
import { socket } from "../../services/socket";
import { boardInitialState, winningCombinations } from "./initialValues";

export default function Board({ playerSymbol }: { playerSymbol: "x" | "o" }) {
	const [isPlayerTurn, setIsPlayerTurn] = useState(playerSymbol === "x");
	const [gameState, setGameState] = useState<GameState>("playing");
	const [board, setBoard] = useState(boardInitialState);

	useEffect(() => {
		if (board.flat().every((cell) => cell.value !== "‎")) {
			socket.emit("gamestate", "draw");
			return;
		}

		winningCombinations.forEach((combination) => {
			const [a, b, c] = combination;
			const aCell = board.flat().find((cell) => cell.id === a);
			const bCell = board.flat().find((cell) => cell.id === b);
			const cCell = board.flat().find((cell) => cell.id === c);
			if (
				aCell?.value === playerSymbol &&
				bCell?.value === playerSymbol &&
				cCell?.value === playerSymbol
			) {
				setGameState(playerSymbol);
				socket.emit("gamestate", playerSymbol);
			}
		});
	}, [board]);

	useEffect(() => {
		if (gameState === "rematch") {
			setBoard(boardInitialState);
			setIsPlayerTurn(playerSymbol === "x");
			socket.emit("gamestate", "playing");
		}
	}, [gameState]);

	socket.on("gamestate", (symbol: GameState) => {
		setGameState(symbol);
	});

	socket.on("playertwoturn", (id: number, symbol: string) => {
		const newBoard = board.map((row) =>
			row.map((cell) => {
				if (cell.id === id) {
					return { ...cell, value: symbol };
				}
				return cell;
			}),
		);
		setBoard(newBoard);
		setIsPlayerTurn(symbol !== playerSymbol);
	});

	function handleClick(id: number) {
		if (!isPlayerTurn || gameState !== "playing") return;
		// check if cell is not already filled
		for (const row of board) {
			for (const cell of row) {
				if (cell.id === id && cell.value !== "‎") {
					return;
				}
			}
		}

		const newBoard = board.map((row) =>
			row.map((cell) => {
				if (cell.id === id) {
					return { ...cell, value: playerSymbol };
				}
				return cell;
			}),
		);
		socket.emit("playeroneturn", id, playerSymbol);
		setBoard(newBoard);
		setIsPlayerTurn(false);
	}

	function rematch() {
		socket.emit("gamestate", "rematch");
	}

	return (
		<div>
			{gameState !== "playing" && playerSymbol === "x" && (
				<div className="flex justify-center">
					<button type="button" onClick={rematch}>
						Re-match?
					</button>
				</div>
			)}
			<div className="text-center py-5 h-20">
				{gameState === "playing" ? (
					<>
						<p>{isPlayerTurn ? "Your turn" : "Waiting for opponent"}</p>
					</>
				) : gameState === "draw" ? (
					<>
						<p>Draw</p>
					</>
				) : (
					<>
						<p>{gameState === playerSymbol ? "You win" : "You lose"}</p>
					</>
				)}
			</div>
			<div className="grid grid-cols-3 grid-repeat text-ce">
				{board.map((row, i) => (
					<div className="text-[80px]">
						{row.map(({ id, value }, j) => {
							if (i === 2 && j !== 2) {
								return (
									<div
										onClick={() => handleClick(id)}
										className="px-5 border-b-8 min-w-[100px]"
									>
										{value}
									</div>
								);
							}
							if (i === 2) {
								return (
									<div onClick={() => handleClick(id)} className="px-5">
										{value}
									</div>
								);
							}
							if (j === 2) {
								return (
									<div
										onClick={() => handleClick(id)}
										className="px-5 border-r-8"
									>
										{value}
									</div>
								);
							}
							return (
								<div
									onClick={() => handleClick(id)}
									className="px-5 border-b-8 border-r-8"
								>
									{value}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
