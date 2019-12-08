const Block = require("./block");
const helper = require("./helper");
const hlt = require("../../hlt");
const { Direction, Position } = require("../../hlt/positionals");

class BlockTree {
    constructor(map, haliteMax, player) {
        helper.HALITE_BLOCK_MAX = haliteMax;
        helper.originalMap = map;
        helper.player = player;
        this.root = helper.createNewNode(map, "x", 0);
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

    buildChildNodes(node) {
        if (node.orientation === "x") {
            return helper.buildXOrientationNodes(node);
        } else if (node.orientation === "y") {
            return helper.buildYOrientationNodes(node);
        }
    }

    getLeaves() {
        let result = new Array();
        this.visit(result, this.root);
        return result;
    }

    visit(accumulator, currentValue) {
        if (!currentValue) return;

        this.visit(accumulator, currentValue.left);
        if (currentValue.leaf) accumulator.push(currentValue);
        this.visit(accumulator, currentValue.right);
    }
}

module.exports = BlockTree;
