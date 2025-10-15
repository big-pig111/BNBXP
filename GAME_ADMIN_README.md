# Snake Game Backend Management System

## Feature Overview

This backend management system allows administrators to control the running status of the snake game, including:
- Setting game round duration (default 20 minutes)
- Automatic game reset
- Manual pause/resume game
- View room status

## File Description

- `admin.html` - Backend management interface
- `snake.html` - Modified game main file (integrated with round control)
- `start-admin.bat` - Batch file to start the backend management system

## Usage Instructions

### 1. Start Backend Management System

```bash
# Method 1: Use batch file
start-admin.bat

# Method 2: Manual start
python -m http.server 8000
```

Then visit in browser: `http://localhost:8000/admin.html`

### 2. Backend Management Features

#### Game Status Control
- **Start Game**: Start game rounds
- **Pause Game**: Pause all players' games
- **Reset Now**: Immediately reset all room data

#### System Settings
- **Game Round Duration**: Set the duration of each game round (5-60 minutes)
- **Reset Interval**: Set the interval time between resets (1-10 minutes)

#### Room Status Monitoring
- Real-time display of player count and food count for all rooms

### 3. Game Round Mechanism

#### Automatic Reset
- After each game round ends, the system automatically clears all room data
- All players need to restart the game
- Reset time is controlled uniformly by the backend

#### Player Experience
- Game interface displays countdown
- Red warning when time is less than 5 minutes
- Yellow reminder when time is less than 10 minutes
- Pause message displayed when game is paused

## Firebase Data Structure

### Game State (`/gameState`)
```json
{
  "isRunning": true,
  "nextReset": 1640995200000,
  "gameDuration": 20,
  "resetInterval": 2,
  "lastUpdate": 1640995200000
}
```

### Settings (`/settings`)
```json
{
  "gameDuration": 20,
  "resetInterval": 2
}
```

### Room Data (`/rooms/{roomName}`)
- `players/` - Player data
- `foods/` - Food data
- `corpseFoods/` - Corpse food data
- `highScores/` - High score records

## Technical Implementation

### 1. Real-time Synchronization
- Use Firebase Realtime Database for real-time data synchronization
- All players and backend management interface update in real-time

### 2. Time Control
- Backend uniformly manages game time
- Use timestamps to ensure all clients are synchronized

### 3. State Management
- Game state stored in Firebase
- Clients listen for state changes and update accordingly

## Important Notes

1. **Permission Control**: Currently no permission verification, anyone can access the backend management interface
2. **Data Security**: Reset operations will clear all room data, please use with caution
3. **Network Requirements**: Stable network connection required to ensure real-time synchronization
4. **Browser Compatibility**: Recommend using modern browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

### Common Issues

1. **Game Not Synchronized**
   - Check network connection
   - Refresh page to reconnect

2. **Countdown Inaccurate**
   - Check if system time is correct
   - Refresh page to resynchronize

3. **Backend Cannot Access**
   - Ensure server is running
   - Check if port 8000 is occupied

### Contact Support

If you encounter issues, please check:
1. Firebase configuration is correct
2. Network connection is normal
3. Browser console has error messages 