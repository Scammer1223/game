// ============================================================
// PARTY MANAGEMENT SYSTEM
// ============================================================

let partyData = {
    code: null,
    isHost: false,
    players: [],
    currentPlayer: null
};

let gameMode = 'single'; // 'single' or 'party'

// Screen Management
function goToMainMenu() {
    document.getElementById('mainMenuScreen').classList.remove('hidden');
    document.getElementById('gameMenuScreen').classList.add('hidden');
    document.getElementById('partyMenuScreen').classList.add('hidden');
}

function goToGameMenu() {
    document.getElementById('mainMenuScreen').classList.add('hidden');
    document.getElementById('gameMenuScreen').classList.remove('hidden');
}

function goToPartyMenu() {
    document.getElementById('mainMenuScreen').classList.add('hidden');
    document.getElementById('partyMenuScreen').classList.remove('hidden');
}

function goToPartyLobby() {
    document.getElementById('partyLobbyScreen').classList.remove('hidden');
    document.getElementById('tetrisDuelScreen').classList.add('hidden');
    document.getElementById('partyTicTacToeScreen').classList.add('hidden');
    updatePartyLobby();
}

// Party Functions
function generatePartyCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function createParty() {
    const playerName = document.getElementById('playerName').value.trim();
    
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    partyData.code = generatePartyCode();
    partyData.isHost = true;
    partyData.players = [{ name: playerName, id: 'player1' }];
    partyData.currentPlayer = { name: playerName, id: 'player1' };
    gameMode = 'party';
    
    document.getElementById('partyMenuScreen').classList.add('hidden');
    document.getElementById('partyLobbyScreen').classList.remove('hidden');
    updatePartyLobby();
}

function joinParty() {
    const playerName = document.getElementById('playerName').value.trim();
    const code = document.getElementById('partyCode').value.trim().toUpperCase();
    
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    if (!code) {
        alert('Please enter a party code');
        return;
    }
    
    partyData.code = code;
    partyData.isHost = false;
    partyData.players = [
        { name: 'Host', id: 'player1' },
        { name: playerName, id: 'player2' }
    ];
    partyData.currentPlayer = { name: playerName, id: 'player2' };
    gameMode = 'party';
    
    document.getElementById('partyMenuScreen').classList.add('hidden');
    document.getElementById('partyLobbyScreen').classList.remove('hidden');
    updatePartyLobby();
}

function leaveParty() {
    partyData = {
        code: null,
        isHost: false,
        players: [],
        currentPlayer: null
    };
    gameMode = 'single';
    
    document.getElementById('partyLobbyScreen').classList.add('hidden');
    document.getElementById('partyMenuScreen').classList.remove('hidden');
    document.getElementById('playerName').value = '';
    document.getElementById('partyCode').value = '';
}

function updatePartyLobby() {
    document.getElementById('partyCodeDisplay').textContent = partyData.code;
    document.getElementById('playerCount').textContent = partyData.players.length;
    
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = partyData.players
        .map(p => `<div class="player-item">👤 ${p.name}</div>`)
        .join('');
}

function copyPartyCode() {
    navigator.clipboard.writeText(partyData.code);
    alert('Party code copied to clipboard!');
}

function startTetris() {
    gameMode = 'single';
    document.getElementById('gameMenuScreen').classList.add('hidden');
    document.getElementById('tetrisScreen').classList.remove('hidden');
}

function startTicTacToe() {
    gameMode = 'single';
    document.getElementById('gameMenuScreen').classList.add('hidden');
    document.getElementById('ticTacToeScreen').classList.remove('hidden');
    initTicTacToe();
}

function startPartyTetrisDuel() {
    document.getElementById('partyLobbyScreen').classList.add('hidden');
    document.getElementById('tetrisDuelScreen').classList.remove('hidden');
    initTetrisDuel();
}

function startPartyTicTacToe() {
    document.getElementById('partyLobbyScreen').classList.add('hidden');
    document.getElementById('partyTicTacToeScreen').classList.remove('hidden');
    initPartyTicTacToe();
}

function goToMenu() {
    if (gameMode === 'party') {
        document.getElementById('tetrisScreen').classList.add('hidden');
        document.getElementById('ticTacToeScreen').classList.add('hidden');
        document.getElementById('gameMenuScreen').classList.add('hidden');
        document.getElementById('partyLobbyScreen').classList.remove('hidden');
    } else {
        document.getElementById('tetrisScreen').classList.add('hidden');
        document.getElementById('ticTacToeScreen').classList.add('hidden');
        document.getElementById('gameMenuScreen').classList.remove('hidden');
    }
}

// ============================================================
// TIC TAC TOE GAME
// ============================================================
let ticTacToeBoard = ['', '', '', '', '', '', '', '', ''];
let ticTacToeCurrentPlayer = 'X';
let ticTacToeGameOver = false;

const ticTacToeCells = document.querySelectorAll('#gameBoard .cell');
const resetGameBtn = document.getElementById('resetGameBtn');
const gameStatus = document.getElementById('gameStatus');

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function initTicTacToe() {
    ticTacToeBoard = ['', '', '', '', '', '', '', '', ''];
    ticTacToeCurrentPlayer = 'X';
    ticTacToeGameOver = false;
    updateTicTacToeDisplay();
    
    ticTacToeCells.forEach(cell => {
        cell.textContent = '';
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick);
    });
}

function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (ticTacToeBoard[index] === '' && !ticTacToeGameOver) {
        ticTacToeBoard[index] = ticTacToeCurrentPlayer;
        e.target.textContent = ticTacToeCurrentPlayer;
        
        if (checkTicTacToeWinner()) {
            ticTacToeGameOver = true;
            gameStatus.textContent = `${ticTacToeCurrentPlayer} Won!`;
            gameStatus.style.color = '#00ff00';
        } else if (ticTacToeBoard.every(cell => cell !== '')) {
            ticTacToeGameOver = true;
            gameStatus.textContent = 'Draw!';
            gameStatus.style.color = '#ffff00';
        } else {
            ticTacToeCurrentPlayer = ticTacToeCurrentPlayer === 'X' ? 'O' : 'X';
            updateTicTacToeDisplay();
        }
    }
}

function checkTicTacToeWinner() {
    return WINNING_COMBINATIONS.some(combo => {
        return (
            ticTacToeBoard[combo[0]] === ticTacToeCurrentPlayer &&
            ticTacToeBoard[combo[1]] === ticTacToeCurrentPlayer &&
            ticTacToeBoard[combo[2]] === ticTacToeCurrentPlayer
        );
    });
}

function updateTicTacToeDisplay() {
    document.getElementById('playerMark').textContent = ticTacToeCurrentPlayer;
    gameStatus.textContent = `${ticTacToeCurrentPlayer}'s Turn`;
    gameStatus.style.color = '#00d4ff';
}

resetGameBtn.addEventListener('click', initTicTacToe);

// ============================================================
// PARTY TIC TAC TOE
// ============================================================
let partyTTTBoard = ['', '', '', '', '', '', '', '', ''];
let partyTTTCurrentPlayer = 'X';
let partyTTTGameOver = false;

const partyTTTCells = document.querySelectorAll('#gameBoardTTT .cell');
const resetPartyTTTBtn = document.getElementById('resetPartyTTTBtn');

function initPartyTicTacToe() {
    partyTTTBoard = ['', '', '', '', '', '', '', '', ''];
    partyTTTCurrentPlayer = 'X';
    partyTTTGameOver = false;
    
    document.getElementById('p1NameTTT').textContent = partyData.players[0].name;
    document.getElementById('p2NameTTT').textContent = partyData.players[1]?.name || 'Player 2';
    updatePartyTTTDisplay();
    
    partyTTTCells.forEach(cell => {
        cell.textContent = '';
        cell.removeEventListener('click', handlePartyTTTCellClick);
        cell.addEventListener('click', handlePartyTTTCellClick);
    });
}

function handlePartyTTTCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (partyTTTBoard[index] === '' && !partyTTTGameOver) {
        partyTTTBoard[index] = partyTTTCurrentPlayer;
        e.target.textContent = partyTTTCurrentPlayer;
        
        if (checkPartyTTTWinner()) {
            partyTTTGameOver = true;
            document.getElementById('gameStatusTTT').textContent = `${partyTTTCurrentPlayer} Won!`;
            document.getElementById('gameStatusTTT').style.color = '#00ff00';
        } else if (partyTTTBoard.every(cell => cell !== '')) {
            partyTTTGameOver = true;
            document.getElementById('gameStatusTTT').textContent = 'Draw!';
            document.getElementById('gameStatusTTT').style.color = '#ffff00';
        } else {
            partyTTTCurrentPlayer = partyTTTCurrentPlayer === 'X' ? 'O' : 'X';
            updatePartyTTTDisplay();
        }
    }
}

function checkPartyTTTWinner() {
    return WINNING_COMBINATIONS.some(combo => {
        return (
            partyTTTBoard[combo[0]] === partyTTTCurrentPlayer &&
            partyTTTBoard[combo[1]] === partyTTTCurrentPlayer &&
            partyTTTBoard[combo[2]] === partyTTTCurrentPlayer
        );
    });
}

function updatePartyTTTDisplay() {
    document.getElementById('playerMarkTTT').textContent = partyTTTCurrentPlayer;
    const player1 = partyData.players[0];
    const player2 = partyData.players[1];
    const currentPlayerName = partyTTTCurrentPlayer === 'X' ? player1.name : (player2?.name || 'Player 2');
    document.getElementById('gameStatusTTT').textContent = `${currentPlayerName}'s Turn`;
    document.getElementById('gameStatusTTT').style.color = '#00d4ff';
}

resetPartyTTTBtn.addEventListener('click', initPartyTicTacToe);

// ============================================================
// TETRIS DUEL GAME
// ============================================================
const CANVAS_WIDTH_DUEL = 250;
const CANVAS_HEIGHT_DUEL = 500;
const BLOCK_SIZE_DUEL = 25;
const COLS_DUEL = Math.floor(CANVAS_WIDTH_DUEL / BLOCK_SIZE_DUEL);
const ROWS_DUEL = Math.floor(CANVAS_HEIGHT_DUEL / BLOCK_SIZE_DUEL);

let duelPlayer1 = { board: [], currentPiece: null, score: 0, lines: 0, gameOver: false };
let duelPlayer2 = { board: [], currentPiece: null, score: 0, lines: 0, gameOver: false };
let duelGameRunning = false;
let duelGamePaused = false;
let dropSpeedDuel = 800;
let lastDropTimeDuel = 0;

const canvasDuel1 = document.getElementById('gameCanvasDuel1');
const ctxDuel1 = canvasDuel1.getContext('2d');
const canvasDuel2 = document.getElementById('gameCanvasDuel2');
const ctxDuel2 = canvasDuel2.getContext('2d');

const TETRIS_PIECES = [
    { shape: [[1, 1, 1, 1]], color: '#00d4ff' },
    { shape: [[1, 1], [1, 1]], color: '#ff00ff' },
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#00ff00' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#ff8800' },
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#0088ff' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#ff0000' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#ffff00' }
];

class DuelPiece {
    constructor() {
        const template = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
        this.shape = template.shape.map(row => [...row]);
        this.color = template.color;
        this.x = Math.floor(COLS_DUEL / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }

    rotate() {
        const newShape = [];
        for (let i = 0; i < this.shape[0].length; i++) {
            const newRow = [];
            for (let j = this.shape.length - 1; j >= 0; j--) {
                newRow.push(this.shape[j][i]);
            }
            newShape.push(newRow);
        }
        this.shape = newShape;
    }
}

function initDuelBoard(player) {
    player.board = [];
    for (let i = 0; i < ROWS_DUEL; i++) {
        player.board[i] = new Array(COLS_DUEL).fill(0);
    }
}

function initTetrisDuel() {
    initDuelBoard(duelPlayer1);
    initDuelBoard(duelPlayer2);
    
    duelPlayer1.currentPiece = new DuelPiece();
    duelPlayer2.currentPiece = new DuelPiece();
    duelPlayer1.score = 0;
    duelPlayer1.lines = 0;
    duelPlayer1.gameOver = false;
    duelPlayer2.score = 0;
    duelPlayer2.lines = 0;
    duelPlayer2.gameOver = false;
    
    duelGameRunning = false;
    duelGamePaused = false;
    lastDropTimeDuel = Date.now();
    
    document.getElementById('player1NameDuel').textContent = partyData.players[0].name;
    document.getElementById('player2NameDuel').textContent = partyData.players[1]?.name || 'Player 2';
    document.getElementById('startDuelBtn').disabled = false;
    document.getElementById('duelPauseBtn').disabled = true;
    document.getElementById('duelPauseBtn').textContent = 'Pause';
    
    updateDuelUI();
    drawDuelGame();
}

function startDuelGame() {
    duelGameRunning = true;
    duelGamePaused = false;
    lastDropTimeDuel = Date.now();
    document.getElementById('startDuelBtn').disabled = true;
    document.getElementById('duelPauseBtn').disabled = false;
    duelGameLoop();
}

function toggleDuelPause() {
    if (!duelGameRunning) return;
    duelGamePaused = !duelGamePaused;
    document.getElementById('duelPauseBtn').textContent = duelGamePaused ? 'Resume' : 'Pause';
    if (!duelGamePaused) {
        lastDropTimeDuel = Date.now();
        duelGameLoop();
    }
}

function duelGameLoop() {
    if (!duelGameRunning || duelGamePaused) return;
    
    const now = Date.now();
    if (now - lastDropTimeDuel > dropSpeedDuel) {
        if (!moveDuelPiece(duelPlayer1, 0, 1)) {
            lockDuelPiece(duelPlayer1);
            clearDuelLines(duelPlayer1);
            duelPlayer1.currentPiece = new DuelPiece();
        }
        
        if (!moveDuelPiece(duelPlayer2, 0, 1)) {
            lockDuelPiece(duelPlayer2);
            clearDuelLines(duelPlayer2);
            duelPlayer2.currentPiece = new DuelPiece();
        }
        
        lastDropTimeDuel = now;
    }
    
    drawDuelGame();
    
    if (duelPlayer1.gameOver && duelPlayer2.gameOver) {
        endDuelGame();
        return;
    }
    
    requestAnimationFrame(duelGameLoop);
}

function moveDuelPiece(player, dx, dy) {
    const piece = player.currentPiece;
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                const newX = piece.x + col + dx;
                const newY = piece.y + row + dy;
                
                if (newX < 0 || newX >= COLS_DUEL || newY >= ROWS_DUEL) return false;
                if (newY >= 0 && player.board[newY][newX]) return false;
            }
        }
    }
    piece.x += dx;
    piece.y += dy;
    return true;
}

function lockDuelPiece(player) {
    const piece = player.currentPiece;
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                const boardY = piece.y + row;
                const boardX = piece.x + col;
                if (boardY >= 0) {
                    player.board[boardY][boardX] = piece.color;
                } else {
                    player.gameOver = true;
                }
            }
        }
    }
}

function clearDuelLines(player) {
    let linesCleared = 0;
    for (let row = ROWS_DUEL - 1; row >= 0; row--) {
        if (player.board[row].every(cell => cell !== 0)) {
            player.board.splice(row, 1);
            player.board.unshift(new Array(COLS_DUEL).fill(0));
            linesCleared++;
            row++;
        }
    }
    
    if (linesCleared > 0) {
        player.lines += linesCleared;
        player.score += linesCleared * 100;
        updateDuelUI();
    }
}

function drawDuelGame() {
    drawDuelBoard(ctxDuel1, canvasDuel1, duelPlayer1);
    drawDuelBoard(ctxDuel2, canvasDuel2, duelPlayer2);
}

function drawDuelBoard(ctx, canvas, player) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS_DUEL; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE_DUEL, 0);
        ctx.lineTo(i * BLOCK_SIZE_DUEL, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= ROWS_DUEL; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE_DUEL);
        ctx.lineTo(canvas.width, i * BLOCK_SIZE_DUEL);
        ctx.stroke();
    }
    
    for (let row = 0; row < ROWS_DUEL; row++) {
        for (let col = 0; col < COLS_DUEL; col++) {
            if (player.board[row][col]) {
                ctx.fillStyle = player.board[row][col];
                ctx.fillRect(col * BLOCK_SIZE_DUEL + 1, row * BLOCK_SIZE_DUEL + 1, BLOCK_SIZE_DUEL - 2, BLOCK_SIZE_DUEL - 2);
            }
        }
    }
    
    if (player.currentPiece) {
        const piece = player.currentPiece;
        ctx.fillStyle = piece.color;
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col]) {
                    ctx.fillRect((piece.x + col) * BLOCK_SIZE_DUEL + 1, (piece.y + row) * BLOCK_SIZE_DUEL + 1, BLOCK_SIZE_DUEL - 2, BLOCK_SIZE_DUEL - 2);
                }
            }
        }
    }
}

function updateDuelUI() {
    document.getElementById('duelScore1').textContent = duelPlayer1.score;
    document.getElementById('duelLines1').textContent = duelPlayer1.lines;
    document.getElementById('duelScore2').textContent = duelPlayer2.score;
    document.getElementById('duelLines2').textContent = duelPlayer2.lines;
}

function endDuelGame() {
    duelGameRunning = false;
    document.getElementById('startDuelBtn').disabled = false;
    document.getElementById('duelPauseBtn').disabled = true;
    
    const player1Name = partyData.players[0].name;
    const player2Name = partyData.players[1]?.name || 'Player 2';
    
    let message = '';
    if (duelPlayer1.score > duelPlayer2.score) {
        message = `${player1Name} Wins! Score: ${duelPlayer1.score}`;
    } else if (duelPlayer2.score > duelPlayer1.score) {
        message = `${player2Name} Wins! Score: ${duelPlayer2.score}`;
    } else {
        message = `It's a Tie! Both scored ${duelPlayer1.score} points!`;
    }
    
    alert(message);
}

document.getElementById('startDuelBtn').addEventListener('click', startDuelGame);
document.getElementById('duelPauseBtn').addEventListener('click', toggleDuelPause);

// ============================================================
// TETRIS GAME (SINGLE PLAYER)
// ============================================================
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 600;
const BLOCK_SIZE = 30;
const COLS = 10;
const ROWS = 20;

let gameBoard = [];
let currentPiece = null;
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lines = 0;
let level = 1;
let dropSpeed = 1000;
let lastDropTime = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const gameOverScreen = document.getElementById('gameOverScreen');

const PIECES = [
    { shape: [[1, 1, 1, 1]], color: '#00d4ff' },
    { shape: [[1, 1], [1, 1]], color: '#ff00ff' },
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#00ff00' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#ff8800' },
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#0088ff' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#ff0000' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#ffff00' }
];

class Piece {
    constructor() {
        const template = PIECES[Math.floor(Math.random() * PIECES.length)];
        this.shape = template.shape.map(row => [...row]);
        this.color = template.color;
        this.x = Math.floor(COLS / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }

    rotate() {
        const newShape = [];
        for (let i = 0; i < this.shape[0].length; i++) {
            const newRow = [];
            for (let j = this.shape.length - 1; j >= 0; j--) {
                newRow.push(this.shape[j][i]);
            }
            newShape.push(newRow);
        }
        this.shape = newShape;
    }

    draw(offsetX = 0, offsetY = 0) {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col]) {
                    ctx.fillRect((this.x + col + offsetX) * BLOCK_SIZE + 1, (this.y + row + offsetY) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
                }
            }
        }
    }
}

function initBoard() {
    gameBoard = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function startGame() {
    initBoard();
    score = 0;
    lines = 0;
    level = 1;
    dropSpeed = 1000;
    gameRunning = true;
    gamePaused = false;
    lastDropTime = Date.now();
    
    currentPiece = new Piece();
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    updateUI();
    gameLoop();
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    if (!gamePaused) {
        lastDropTime = Date.now();
        gameLoop();
    }
}

function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    const now = Date.now();
    if (now - lastDropTime > dropSpeed) {
        if (!movePiece(0, 1)) {
            lockPiece();
            clearLines();
            currentPiece = new Piece();
            
            if (isColliding(currentPiece, 0, 0)) {
                endGame();
                return;
            }
        }
        lastDropTime = now;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

function movePiece(dx, dy) {
    if (isColliding(currentPiece, dx, dy)) return false;
    currentPiece.x += dx;
    currentPiece.y += dy;
    return true;
}

function isColliding(piece, dx = 0, dy = 0) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col]) {
                const newX = piece.x + col + dx;
                const newY = piece.y + row + dy;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
                if (newY >= 0 && gameBoard[newY][newX]) return true;
            }
        }
    }
    return false;
}

function lockPiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const boardY = currentPiece.y + row;
                const boardX = currentPiece.x + col;
                if (boardY >= 0) gameBoard[boardY][boardX] = currentPiece.color;
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (gameBoard[row].every(cell => cell !== 0)) {
            gameBoard.splice(row, 1);
            gameBoard.unshift(Array(COLS).fill(0));
            linesCleared++;
            row++;
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        const points = [0, 100, 300, 500, 800];
        score += points[linesCleared] * level;
        level = Math.floor(lines / 10) + 1;
        dropSpeed = Math.max(200, 1000 - level * 50);
        updateUI();
    }
}

function draw() {
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * BLOCK_SIZE);
        ctx.stroke();
    }
    
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (gameBoard[row][col]) {
                ctx.fillStyle = gameBoard[row][col];
                ctx.fillRect(col * BLOCK_SIZE + 1, row * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
        }
    }
    
    if (currentPiece) currentPiece.draw();
    
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#00d4ff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

function endGame() {
    gameRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    document.getElementById('finalScore').textContent = score;
    gameOverScreen.classList.remove('hidden');
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning || !currentPiece) return;
    if (gamePaused && e.key !== ' ') return;
    
    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece(1, 0);
            break;
        case 'ArrowDown':
            e.preventDefault();
            movePiece(0, 1);
            break;
        case 'ArrowUp':
            e.preventDefault();
            const oldShape = currentPiece.shape.map(row => [...row]);
            currentPiece.rotate();
            if (isColliding(currentPiece, 0, 0)) currentPiece.shape = oldShape;
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

if (startBtn) startBtn.addEventListener('click', startGame);
if (pauseBtn) pauseBtn.addEventListener('click', togglePause);

if (canvas) {
    initBoard();
    draw();
}
