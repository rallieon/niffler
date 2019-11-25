const Block = require("./block");
const helper = require("./helper");
const hlt = require("../../hlt");
const { Direction, Position } = require("../../hlt/positionals");

class BlockTree {
    constructor(map, haliteMax) {
        this.HALITE_BLOCK_MAX = haliteMax;
        this.root = this.createNewNode(map, "x");
        this.buildNode(this.root);
    }

    buildNode(node) {
        if (node.leaf) return;

        //based on the partition, split the map into two
        let { left, right } = this.buildChildNodes(node);
        node.left = left;
        node.right = right;
        this.buildNode(node.left);
        this.buildNode(node.right);
    }

    createNewNode(map, orientation) {
        let { partition, totalHalite } = this.selectPartition(map, orientation);
        let node = new Block(map);
        node.totalHalite = totalHalite;

        if (!partition) {
            node.leaf = true;
        } else {
            node.orientation = orientation;
            node.partition = partition;
        }
        return node;
    }

    buildChildNodes(node) {
        let gameLeft,
            gameRight,
            nodeLeft,
            nodeRight = null;

        if (node.orientation === "x") {
            // x-axis is harder because we are splitting rows.
            // go ahead and set up the game board
            gameLeft = new Array().fill(new Array(node.partition));
            gameRight = new Array().fill(new Array(node.partition));
            for (let i = 0; i < node.map.height; i++) {
                gameLeft.push(node.map._cells[i].slice(0, node.partition));
                gameRight.push(node.map._cells[i].slice(node.partition));
            }

            nodeLeft = this.createNewNode(
                new hlt.GameMap(gameLeft, gameLeft[0].length, gameLeft.length),
                "y"
            );
            nodeRight = this.createNewNode(
                new hlt.GameMap(
                    gameRight,
                    gameRight[0].length,
                    gameRight.length
                ),
                "y"
            );
        } else if (node.orientation === "y") {
            gameLeft = new Array();
            gameRight = new Array();

            //y axis is easy because we are moving entire lines
            for (let i = 0; i < node.map.height; i++) {
                if (i < node.partition) {
                    gameLeft.push(node.map._cells[i]);
                } else {
                    gameRight.push(node.map._cells[i]);
                }
            }

            nodeLeft = this.createNewNode(
                new hlt.GameMap(gameLeft, gameLeft[0].length, gameLeft.length),
                "x"
            );
            nodeRight = this.createNewNode(
                new hlt.GameMap(
                    gameRight,
                    gameRight[0].length,
                    gameRight.length
                ),
                "x"
            );
        }

        return { left: nodeLeft, right: nodeRight };
    }

    selectPartition(map, orientation) {
        //choose a partition that splits the halite in the current map in half along the orientation
        //if we have gone below the maximum halite per block, then select no partition.
        let { xTotals, yTotals, total } = this.getHaliteTotals(map);
        let partitionIndex = null;

        if (total < this.HALITE_BLOCK_MAX)
            return {
                partition: partitionIndex,
                totalHalite: total
            };

        //TODO refactor this to be less copy/paste
        if (orientation === "x") {
            //this is a vertical split of the node
            let currentTotal = 0;
            for (let i = 0; i < xTotals.length; i++) {
                currentTotal += xTotals[i];
                if (currentTotal > total / 2) {
                    partitionIndex = i;
                    break;
                }
            }
        } else if (orientation === "y") {
            //this is a horizontal split of the node
            let currentTotal = 0;
            for (let i = 0; i < yTotals.length; i++) {
                currentTotal += yTotals[i];
                if (currentTotal > total / 2) {
                    partitionIndex = i;
                    break;
                }
            }
        }

        return { partition: partitionIndex, totalHalite: total };
    }

    getHaliteTotals(map) {
        let xTotals = new Array(map.width).fill(0);
        let yTotals = new Array(map.height).fill(0);
        let finalTotal = 0;

        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                const cell = map.get(new Position(i, j));
                yTotals[j] += cell.haliteAmount;
                xTotals[i] += cell.haliteAmount;
                finalTotal += cell.haliteAmount;
            }
        }

        return { xTotals: xTotals, yTotals: yTotals, total: finalTotal };
    }
}

module.exports = BlockTree;
