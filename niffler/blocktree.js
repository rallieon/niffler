const Block = require('./block');

class BlockTree {
    constructor() {
        this.root = null;
    }

    insert(cells, width, height) {
        let newNode = new Block(cells, width, height);

        if (this.root === null) this.root = newNode;
        else this.insertNode(this.root, newNode);
    }

    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if (node.left === null) node.left = newNode;
            else this.insertNode(node.left, newNode);
        } else {
            if (node.right === null) node.right = newNode;
            else this.insertNode(node.right, newNode);
        }
    }
}

module.exports = {
    BlockTree
};