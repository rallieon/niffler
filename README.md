# Niffler

## Definition

A Niffler is a creature with a long snout and a coat of black, fluffy fur. They're attracted to shiny things, which made them wonderful for locating treasure, but this also means they could wreak havoc if kept (or set loose) indoors.

## Purpose

Niffler is a [Halite III bot](https://2018.halite.io/learn-programming-challenge/game-overview) developed by Keith LaForce as a part of the Levvel Twin Challenge, 2019. The code is developed using the MIT license. Please use at your peril. Remember, Nifflers can wreak havoc.

## High Level Algorithm

Niffler combines a few concepts together into a metaheuristic based approach to solving the problem of resource collection in Halite III. Niffler is implemented using the Strategy Design pattern via `BotStrategyManager`. The first iteration of Niffler contains two strategies: `SimpleBotStrategy` and `BinarySpaceBotStrategy`. The `SimpleBotStrategy` will choose a direction at random to collect halite and based on simple rules will direct the `Ship` back to the `Shipyard`.

The `BinarySpaceStrategy` is the primary strategy used for Niffler. The algorithm is composed into a couple of steps

1. Build a BSP tree [`BlockTree`] subdividing the Halite III map into `Blocks` of approximately `HALITE_BLOCK_MAX` halite.
2. Once subdivided, a `ShipOrchestrator` will direct a ship to a `Block` utilizing a greedy algorithm based on the `fitness()` of the `Block`. Only `MAX_SHIPS_PER_BLOCK` can be directed to a single `Block`.
3. Once a `Ship` reaches a `Block` it will collect halite until a certain `IDEAL_CAPACITY`.
4. After collecting `IDEAL_CAPACITY` the `Ship` will return to the `Shipyard` or `Dropoff`.
5. The BSP will be recreated every `TURNS_TO_RECREATE` and the algorithm will retune itself.

## Primary Domain Objects

The following lists (in psuedocode) the primary domain objects in Niffler. The first few domain objects are from the Halite III toolkit and represented here for context purposes.

[//]: # "using csharp here as the markdown language to get syntax highlighting to work better and keep the code small since javascript classes are more verbose"

```csharp
class Location
{
    int x
    int y
}

class Ship
{
    Location position
    int owner
    int id
    int halite
}

class MapCell
{
    Location position
    int halite
    Ship ship
    bool hasStructure
}

class BlockTree
{
    Block root
    Block traverseTree
}

class Block
{
    Block left
    Block right
    list MapCell cells
    int x
    int y
    int width
    int height
    int totalHalite
    int distanceFromClosestDropoff
    list shipsInRouteToBlock
}

class ShipOrchestrator
{
    BlockTree tree
    Move determineNextMoveForShip
}
```

## Optimization

Depending on time constraints of the Twin Challenge a genetic algorithm can be utilized to optimize the following variables by running the bot through thousands of iterations.

1. `HALITE_BLOCK_MAX`
2. `MAX_SHIPS_PER_BLOCK`
3. `IDEAL_CAPACITY`
4. `TURNS_TO_RECREATE`
