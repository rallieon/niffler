const Block = require("./block");
const helper = require("./helper");
const hlt = require("../../hlt");
const { Direction, Position } = require("../../hlt/positionals");

class BlockTree {
    constructor(map, config, player) {
        helper.config = config;
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

        //TODO comment better, tracking absolute position
        if (node.orientation === "x") {
            node.right.xModifier = node.xModifier + node.partition;
            node.left.xModifier = node.xModifier;

            node.right.yModifier = node.yModifier;
            node.left.yModifier = node.yModifier;
        }
        if (node.orientation === "y") {
            node.right.yModifier = node.yModifier + node.partition;
            node.left.yModifier = node.yModifier;

            node.right.xModifier = node.xModifier;
            node.left.xModifier = node.xModifier;
        }
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
