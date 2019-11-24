const Block = require("./block");

class BlockTree {
    constructor(map, haliteMax) {
        this.root = this.createNewNode(map, "x");
        this.HALITE_BLOCK_MAX = haliteMax;
        this.buildNode(this.root);
    }

    createNewNode(map, orientation) {
        let partition = this.selectPartition(map, orientation);
        if (!partition) {
            //we have reached the bottom of the tree. Create a leaf
            return new Block(); //set leaf to true
        } else {
            //create a non-leaf node
            return new Block();
        }
        return new Block(map);
    }

    selectPartition(map, orientation) {
        //choose a partition that splits the halite in the current map in half along the orientation
        //if we have gone below the maximum halite per block, then select no partition.
    }

    buildNode(node) {
        if (node.isLeaf) return;

        node.left = this.createNewNode();
        node.right = this.createNewNode();
        this.buildNode(node.left);
        this.buildNode(node.right);
    }
}

module.exports = BlockTree;
