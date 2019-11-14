# Niffler

## Definition

A Niffler is a creature with a long snout and a coat of black, fluffy fur. They're attracted to shiny things, which made them wonderful for locating treasure, but this also means they could wreak havoc if kept (or set loose) indoors.

## Purpose

Niffler is a [Halite III bot](https://2018.halite.io/learn-programming-challenge/game-overview) developed by Keith LaForce as a part of the Levvel Twin Challenge, 2019. The code is developed using the MIT license. Please use at your peril. Remember, Nifflers can wreak havoc.

## High Level Algorithm

Niffler combines a few concepts together into a metaheuristic based approach to solving the problem of resource collection in Halite III. The algorithm is composed into a couple of steps

1. Build a BSP tree subdividing the Halite III map into `Blocks` of approximately `HALITE_BLOCK_MAX` halite.
2. Once subdivided, a `ShipOrchestrator` will direct a ship to a `Block` utilizing a greedy algorithm based on the `fitness()` of the `Block`. Only `MAX_SHIPS_PER_BLOCK` can be directed to a single `Block`.
3. Once a `Ship` reaches a `Block` it will collect halite until a certain `IDEAL_CAPACITY`.
4. After collecting `IDEAL_CAPACITY` the `Ship` will return to the `Shipyard` or `Dropoff`.

## Primary Domain Objects

```javascript
class Ship
{
    Position position
}
```

each block will have following attributes
list of mapcells
total halite
manhattan distance from spawn point OR dropoff (based on the center of block)
queue of ships in the block
queue of ships headed to the block
mapcell of the center of the block

algorithm

1. Build BSP Tree (every 100 turns?)
2. if halite > 1000 && we are not 75% of the way through the game then spawn ship
3. push ship into queue of block with highest fitness function
4. navigate ship towards center of block
