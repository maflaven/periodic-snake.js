# Periodic Snake
Periodic Snake is a pure JavaScript game based on Snake, but there are some key differences:
* Movement is from left to right, in a wavelike manner
* Controls modify the snake's amplitude and wavelength
* The snake grows by absorbing same-colored circles, and it shrinks by colliding with spikes
* Energy is limited, so the snake has to eat every 20 seconds or face death

### Technical Features
* Node.js
* Custom 8-bit sounds
* Snake movement and path projection are sine-wave based
* Custom transitions

### Planned Upgrades
- [ ] Difficulty levels: one spike collision either kills (HARD) or cuts the snake in half (EASY, current default difficulty)
- [ ] Score board
- [ ] Ripple graphics accompanying all motion
- [ ] Mouse controls
