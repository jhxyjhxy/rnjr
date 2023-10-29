# Sheepish

## Instructions
Corral the sheep by saying the word attached to the sheep using the correct emotion. Try not to let them get past you!

## idea: *emotional voice galaga* web app
* player is the shephard herding sheep
* use different fonts and/or colors on the sheep for each emotion
* entire phrases / sentences so hume can "hear" enough 
* 3 lives

## features
* hume for [speech prosody](https://dev.hume.ai/docs/speech-prosody), determines what emotion the player is speaking with
* hume for [language](https://dev.hume.ai/docs/emotional-language), determines which sheep we are talking about
* [stretch] would use convex for database like high scores table and progress

## game
* sheep roll into view (coming from right, rolling left)
  * poofs if you get it right
  * roll off screen, lives tick down
* player keps saying the phrases on sheep until all sheep cleared for the level or player ran out of lives

## levels
* level 1: 3 emotions
  * happy (anything joy / amusement), sad, anger
* level 2: the correct emotion should be top 2
* level 3: the correct emotion should be in first place