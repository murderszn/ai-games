// Select the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
let tileSize, rows, cols;

// Cyberpunk color palette
const colors = {
    wall: '#00ff41',      // Matrix green
    wallGlow: '#003B00',  // Darker green for glow effect
    pellet: '#ff00ff',    // Bright magenta
    player: '#00ffff',    // Cyan
    background: '#000033', // Dark blue background
    text: '#ff00ff'       // Magenta text
};

// Extended vertical map (1 = wall, 2 = pellet)
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1],
    [1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1],
    [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const player = {
    x: 1,
    y: 1,
    direction: '',
    size: 0,
    speed: 0.05,
};

let startTime, elapsedTime;

// Resize and scale game to fit viewport
function resizeGame() {
    const width = window.innerWidth;
    const height = window.innerHeight * 0.9;

    rows = map.length;
    cols = map[0].length;
    
    // Calculate tile size based on both width and height constraints
    const tileWidth = Math.floor(width / cols);
    const tileHeight = Math.floor(height / rows);
    tileSize = Math.min(tileWidth, tileHeight);

    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;

    player.size = tileSize / 2;
}

// Draw the map with cyberpunk effects
function drawMap() {
    // Fill background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tile = map[row][col];
            if (tile === 1) {
                // Wall with glow effect
                ctx.shadowColor = colors.wall;
                ctx.shadowBlur = 10;
                ctx.fillStyle = colors.wallGlow;
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                
                ctx.shadowBlur = 5;
                ctx.fillStyle = colors.wall;
                ctx.fillRect(
                    col * tileSize + 2, 
                    row * tileSize + 2, 
                    tileSize - 4, 
                    tileSize - 4
                );
            } else if (tile === 2) {
                // Pellet with glow
                ctx.shadowColor = colors.pellet;
                ctx.shadowBlur = 15;
                ctx.fillStyle = colors.pellet;
                ctx.beginPath();
                ctx.arc(
                    col * tileSize + tileSize / 2,
                    row * tileSize + tileSize / 2,
                    tileSize / 6,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }
    // Reset shadow effects
    ctx.shadowBlur = 0;
}

// Draw the player with cyberpunk effect
function drawPlayer() {
    ctx.shadowColor = colors.player;
    ctx.shadowBlur = 20;
    ctx.fillStyle = colors.player;
    ctx.beginPath();
    ctx.arc(
        player.x * tileSize + tileSize / 2,
        player.y * tileSize + tileSize / 2,
        player.size,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Move player
function movePlayer() {
    const directions = {
        ArrowUp: { dx: 0, dy: -1 },
        ArrowDown: { dx: 0, dy: 1 },
        ArrowLeft: { dx: -1, dy: 0 },
        ArrowRight: { dx: 1, dy: 0 },
    };

    const move = directions[player.direction];
    if (move) {
        const newX = player.x + move.dx * player.speed;
        const newY = player.y + move.dy * player.speed;
        if (map[Math.floor(newY)][Math.floor(newX)] !== 1) {
            player.x = newX;
            player.y = newY;

            // Collect pellets
            const tileX = Math.floor(player.x);
            const tileY = Math.floor(player.y);
            if (map[tileY][tileX] === 2) {
                map[tileY][tileX] = 0;
            }
        }
    }
}

// Check for win condition
function checkWin() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (map[row][col] === 2) {
                return false;
            }
        }
    }
    return true;
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawPlayer();
    movePlayer();

    elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    // Draw time with glow effect
    ctx.shadowColor = colors.text;
    ctx.shadowBlur = 10;
    ctx.fillStyle = colors.text;
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText(`TIME: ${elapsedTime}s`, 10, 30);

    if (checkWin()) {
        ctx.fillStyle = colors.text;
        ctx.font = '30px "Press Start 2P"';
        const text = 'SYSTEM HACKED!';
        const textWidth = ctx.measureText(text).width;
        ctx.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2);
        return;
    }

    requestAnimationFrame(gameLoop);
}

// Input handling
window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        player.direction = e.key;
    }
});

// Adjust the game viewport on resize
window.addEventListener('resize', resizeGame);

// Start the game
function startGame() {
    resizeGame();
    startTime = Date.now();
    gameLoop();
}

startGame();
