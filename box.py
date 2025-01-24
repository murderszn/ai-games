import pygame
import math
import numpy as np

# Initialize Pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 800
FPS = 60
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
YELLOW = (255, 255, 0)
RED = (255, 0, 0)

# Hypercube parameters
HYPERCUBE_SIZE = 2.0
BALL_RADIUS = 0.1

# Set up display
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("4D Tesseract with Bouncing Ball")

# Generate tesseract vertices (4D)
vertices = np.array([[-1, -1, -1, -1],
                    [-1, -1, -1, 1],
                    [-1, -1, 1, -1],
                    [-1, -1, 1, 1],
                    [-1, 1, -1, -1],
                    [-1, 1, -1, 1],
                    [-1, 1, 1, -1],
                    [-1, 1, 1, 1],
                    [1, -1, -1, -1],
                    [1, -1, -1, 1],
                    [1, -1, 1, -1],
                    [1, -1, 1, 1],
                    [1, 1, -1, -1],
                    [1, 1, -1, 1],
                    [1, 1, 1, -1],
                    [1, 1, 1, 1]], dtype=np.float64)

# Edges connecting the vertices (pairs of indices)
edges = [(i, j) for i in range(16) for j in range(16) 
        if bin(i ^ j).count('1') == 1]

# Initialize 4D ball
ball_pos = np.array([0.0, 0.0, 0.0, 0.0], dtype=np.float64)
ball_vel = np.array([0.03, 0.02, 0.025, 0.015], dtype=np.float64)

# 4D rotation matrices
def rotate_4d(point, angles):
    x, y, z, w = point
    
    # XY-plane rotation
    xy_rot = np.array([[math.cos(angles[0]), -math.sin(angles[0]), 0, 0],
                      [math.sin(angles[0]), math.cos(angles[0]), 0, 0],
                      [0, 0, 1, 0],
                      [0, 0, 0, 1]])
    
    # ZW-plane rotation
    zw_rot = np.array([[1, 0, 0, 0],
                      [0, 1, 0, 0],
                      [0, 0, math.cos(angles[1]), -math.sin(angles[1])],
                      [0, 0, math.sin(angles[1]), math.cos(angles[1])]])
    
    return np.dot(zw_rot, np.dot(xy_rot, point))

# Project 4D to 2D with perspective
def project_4d_to_2d(point, distance=5.0):
    # Simple stereographic projection
    scale = distance / (distance - point[3])
    return (int(point[0] * scale * WIDTH/4 + WIDTH/2),
            int(point[1] * scale * HEIGHT/4 + HEIGHT/2))

# Main loop
clock = pygame.time.Clock()
angles = [0.0, 0.0]

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update rotations
    angles[0] += 0.01  # XY-plane rotation
    angles[1] += 0.015  # ZW-plane rotation

    # Update ball position in 4D space
    ball_pos += ball_vel

    # 4D boundary checking
    for i in range(4):
        if abs(ball_pos[i]) > HYPERCUBE_SIZE/2:
            ball_vel[i] *= -1
            ball_pos[i] = np.clip(ball_pos[i], 
                                -HYPERCUBE_SIZE/2 + BALL_RADIUS, 
                                HYPERCUBE_SIZE/2 - BALL_RADIUS)

    # Clear screen
    screen.fill(BLACK)

    # Project and draw tesseract edges
    rotated_vertices = [rotate_4d(v, angles) for v in vertices]
    projected_vertices = [project_4d_to_2d(v) for v in rotated_vertices]

    for edge in edges:
        pygame.draw.line(screen, WHITE, 
                        projected_vertices[edge[0]], 
                        projected_vertices[edge[1]], 1)

    # Project and draw ball
    rotated_ball = rotate_4d(ball_pos, angles)
    ball_proj = project_4d_to_2d(rotated_ball)
    pygame.draw.circle(screen, YELLOW, ball_proj, 10)

    pygame.display.flip()
    clock.tick(FPS)

pygame.quit()