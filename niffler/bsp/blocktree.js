const Block = require("./block");

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
        if (newNode.width < node.width) {
            if (node.left === null) node.left = newNode;
            else this.insertNode(node.left, newNode);
        } else {
            if (node.right === null) node.right = newNode;
            else this.insertNode(node.right, newNode);
        }
    }

    traverse(node) {
        if (node !== null) {
            this.traverse(node.left);
            console.log(node.width);
            this.traverse(node.right);
        }
    }
}

module.exports = BlockTree;
