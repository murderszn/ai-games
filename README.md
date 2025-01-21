# Daedalus-Man: Cyberpunk Maze Game

A simple maze game with a cyberpunk aesthetic where the player navigates through a grid collecting pellets while avoiding walls.

## Overview

This game uses HTML5 Canvas to render a maze-inspired game where:
- **Walls** are represented by green blocks with a glow effect.
- **Pellets** are magenta glowing dots to be collected.
- The **player** is a cyan glowing entity that can move in four directions.

### Features
- Responsive design that adjusts to the viewport.
- Cyberpunk-themed visual effects with a neon glow.
- Time tracking for the game session.
- Win condition when all pellets are collected.

## Setup

To run this game:

1. **HTML Setup**: Ensure there's an HTML file with a canvas element with the ID `gameCanvas`.

    ```html
    <canvas id="gameCanvas"></canvas>
    ```

2. **CSS for Font**: Include the 'Press Start 2P' font for a retro gaming feel:

    ```html
    <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
    ```

3. **JavaScript**: Copy the provided JavaScript code into a script tag or an external .js file.

## Game Mechanics

- **Map**: Defined by a 2D array where `1` is a wall, `2` is a pellet, and `0` (or empty) is an open path.
- **Player Movement**: Controlled via arrow keys. The player moves continuously in the last pressed direction unless encountering a wall.
- **Win Condition**: The game ends when all pellets are collected, displaying "SYSTEM HACKED!".

## Code Structure

- **Initialization**: 
  - Canvas setup with context retrieval.
  - Game variables like `tileSize`, `rows`, `cols`.
  - Color palette for cyberpunk theme.

- **Functions**:
  - `resizeGame()` - Adjusts game size based on viewport.
  - `drawMap()` - Renders the maze with glow effects.
  - `drawPlayer()` - Draws the player with a glow.
  - `movePlayer()` - Handles player movement and pellet collection.
  - `checkWin()` - Checks if all pellets have been collected.
  - `gameLoop()` - Main game loop for rendering and updating game state.
  - Event listeners for input and resizing.

## How to Play

- Use arrow keys to navigate the maze.
- Collect all pellets to win the game.

## Future Enhancements

- Add enemies or hazards.
- Implement levels with increasing complexity.
- Add sound effects and background music.

## License

This software is licensed by Daedalus Solutions Inc. All rights reserved.
