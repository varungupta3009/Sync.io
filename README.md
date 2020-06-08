# Sync.io

Create a music party on the go!

## Algorithm

1. User Clicks Start
2. Plays one beep (0.2s)
3. Listens to more beeps until max energy acquired (0.8s or sooner)
   1. On hearing a beep, increases energy by energy/10
4. Checks if number of beeps === 10
   1. If no, uses all energy to beep
   2. Else, this.player is assumed successfully synced. Proceeds to play media.
