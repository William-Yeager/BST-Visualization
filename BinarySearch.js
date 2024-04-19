// Create the node class for each item in the tree
class TreeNode {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

// Class for handling animations
class AnimateTree {
    constructor() {
        // Global animation vars
        this.height = 800;
        this.length = window.innerWidth/2;
        this.nodeArr = new Array();
        this.resetPath = null;
        this.placements = new Array();
        this.lengthAdd = 60;
        this.check = true;
    }

    animateFirst(tree) {
        console.log("animate first node");
        // Set up canvas vars
        var canvas = document.getElementById("bstCanvas");
        var ctx = canvas.getContext("2d");
        // Draw circle
        ctx.beginPath();
        ctx.arc(this.length/2, 50, 30, 0, 2 * Math.PI);
        ctx.stroke();
        // Write number
        ctx.font = "20px Arial";
        ctx.strokeText(tree.data, this.length/2 - 7 - 5*tree.data/100, 55);
    }

    animateNode(tree, path, data, order) {
        if (this.resetPath != null) {
            this.resetNodes(this.resetPath);
        }
        console.log("animate node with path: " + path);
        // Set up canvas vars
        var canvas = document.getElementById("bstCanvas");
        var ctx = canvas.getContext("2d");
        // Set up height vars
        var tempHeight = 50;
        var tempLength = this.length / 2;
        // Iterate through array and find where the new node is
        for (let i = 0; i < path.length; i++) {
            let element = path[i];
            if (element == "left") {
                // Add new height and length to vars
                tempHeight += 75;
                if (i == path.length - 1) {
                    tempLength -= this.lengthAdd;
                } else {
                    tempLength -= 60;
                }
            } else if (element == "right") {
                // Add new height and length to vars
                tempHeight += 75;
                if (i == path.length - 1) {
                    tempLength += this.lengthAdd;
                } else {
                    tempLength += 60;
                }
            }
            console.log(tempLength);
            console.log(element);
        }
        // Check if node's place is already taken
        // If it is, change the amount each node spans by
        // call animate delete
        // return
        let tempLoc = tempHeight.toString() + tempLength.toString();
        if (this.placements.includes(tempLoc) && this.check) {
            this.lengthAdd += 60;
            this.placements = new Array();
            this.check = false;
            this.animateDelete("collision", "null", order, tree);
            this.check = true;
            return;
        }
        // Add to placements array
        this.placements.push(tempLoc);
        // Create node
        ctx.strokeStyle = "Black";
        ctx.font = "20px Arial";
        ctx.strokeText(data, tempLength - 5 - 3 * data.toString().length, tempHeight + 5);
        ctx.beginPath();
        ctx.arc(tempLength, tempHeight, 30, 0, 2 * Math.PI);
        ctx.stroke();
        // Create line
        let prevNodeArea = 0;
        let currNodeArea = 0;
        if (path.length == 1) {
            if (path[0] == "right") {
                prevNodeArea = -45 - this.lengthAdd + 60;
                currNodeArea = 0;
            } else {
                prevNodeArea = 40 + this.lengthAdd - 60;
                currNodeArea = 7;
            }
        } else {
            if (path[0] == "right") {
                prevNodeArea = -45;
                currNodeArea = 0;
            } else {
                prevNodeArea = 40;
                currNodeArea = 7;
            }
        }
        ctx.beginPath();
        ctx.moveTo(tempLength + prevNodeArea, tempHeight - 50);
        ctx.lineTo(tempLength + currNodeArea, tempHeight - 30);
        ctx.stroke();
        console.log(tree);
    }

    animateSearch(path) {
        if (this.resetPath != null) {
            this.resetNodes(this.resetPath);
        }
        if (path == "DOES NOT EXIST") {
            document.getElementById("status-bar").innerHTML = "Node does not exist";
            return;
        }
        console.log("animate search with path: " + path);
        // Set up canvas vars
        var canvas = document.getElementById("bstCanvas");
        var ctx = canvas.getContext("2d");
        // Set up height vars
        var tempHeight = 50;
        var tempLength = this.length / 2;
        // Iterate through array and find where the new node is
        for (let i = 0; i < path.length; i++) {
            let element = path[i];
            if (element == "left") {
                // Add new height and length to vars
                tempHeight += 75;
                if (i == path.length - 1) {
                    tempLength -= this.lengthAdd;
                } else {
                    tempLength -= 60;
                }
            } else if (element == "right") {
                // Add new height and length to vars
                tempHeight += 75;
                if (i == path.length - 1) {
                    tempLength += this.lengthAdd;
                } else {
                    tempLength += 60;
                }
            }
            console.log(element);
        }
        // Search node
        ctx.strokeStyle = "Red";
        ctx.beginPath();
        ctx.arc(tempLength, tempHeight, 30, 0, 2 * Math.PI);
        ctx.stroke();
        this.resetPath = path;
    }

    animateDelete(pathNode, pathReplace, addOrder, tree) {
        console.log("animate delete with path: " + pathNode + " Replaced with: " + pathReplace);
        // Check to make sure the search isnt active
        if (this.resetPath != null) {
            this.resetNodes(this.resetPath);
        }
        // Check to make sure it's not collision to reset paths
        if (pathNode != "collision") {
            this.placements = new Array();
        }
        // Clear canvas
        var canvas = document.getElementById("bstCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Print to console
        console.log(addOrder);

        // Create new tree to model the order to animate the add nodes
        var tempTree = null;
        var right = false;
        // Iterate through all nodes to be added
        for (let i = 0; i < addOrder.length - 1; i++) {
            let currPath = new Array();
            var temp = tempTree;
            var past = temp;
            if (i == 0) {
                tempTree = new TreeNode(Number(addOrder[i]));
                this.animateFirst(tempTree);
            } else {
                // Iterate through tree
                while (temp != null) {
                    if (addOrder[i] < temp.data) {
                        currPath.push("left");
                        past = temp;
                        temp = temp.left;
                        right = false;
                    } else {
                        currPath.push("right");
                        past = temp;
                        temp = temp.right;
                        right = true;
                    }
                }
                // Add to tree
                if (right) {
                    past.right = new TreeNode(Number(addOrder[i]));
                } else {
                    // left
                    past.left = new TreeNode(Number(addOrder[i]));
                }
                // Animate current node
                this.animateNode(tree, currPath.reverse(), Number(addOrder[i]));
            }
        }
    }

    animateDeleteRoot() {
        console.log("delete root");
        var canvas = document.getElementById("bstCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    resetNodes(path) {
        console.log("reset with path: " + path);
        // Set up canvas vars
        var canvas = document.getElementById("bstCanvas");
        var ctx = canvas.getContext("2d");
        // Set up height vars
        var tempHeight = 50;
        var tempLength = this.length / 2;
        // Iterate through array and find where the new node is
        for (let i = 0; i < path.length; i++) {
            let element = path[i];
            if (element == "left") {
                // Add new height and length to vars
                tempHeight += 75;
                tempLength -= 60;
            } else if (element == "right") {
                // Add new height and length to vars
                tempHeight += 75;
                tempLength += 60;
            }
            console.log(element);
        }
        // Reset node
        ctx.strokeStyle = "Black";
        ctx.beginPath();
        ctx.arc(tempLength, tempHeight, 30, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.stroke();
        this.resetPath = null;
    }
}

// Class for the actual tree
class BST {
    // Sets up the BST
    constructor() {
        this.tree = new TreeNode(null);
        this.count = 0;
        this.animation = new AnimateTree();
        this.currPrintText = "";
    }

    // Recursive method for placing node in correct spot in the tree
    placeNode(currentTree, data) {
        // Base Cases
        if (currentTree.left == null && data < currentTree.data) {
            console.log("final left");
            currentTree.left = new TreeNode(data);
            var currPath = new Array();
            currPath.push("left");
            return currPath;
        }
        if (currentTree.right == null && data >= currentTree.data) {
            console.log("final right");
            currentTree.right = new TreeNode(data);
            var currPath = new Array();
            currPath.push("right");
            return currPath;
        }

        // Recursive cases
        if (data < currentTree.data) {
            console.log("recursive left", data, currentTree.data);
            let currPath = this.placeNode(currentTree.left, data);
            currPath.push("left");
            return currPath;
        } else {
            console.log("recursive right", data, currentTree.data);
            let currPath = this.placeNode(currentTree.right, data);
            currPath.push("right");
            return currPath;
        }
    }

    // Method for adding a node
    addNode(data) {
        // Checks if it's the first one
        if (this.count == 0) {
            this.tree.data = data;
            this.count++;
            this.animation.animateFirst(this.tree);
        } else {
            let path = this.placeNode(this.tree, data);
            this.count++;
            let addOrder = this.printPreOrder();
            this.animation.animateNode(this.tree, path, data, addOrder.split(' '));
        }
    }

    // Recursive method for finding node
    findNode(currentTree, value) {
        // Base case for finding the node
        if (currentTree.data == value) {
            console.log("found node");
            let temp = new Array();
            temp.push("found");
            return temp;
        }

        // Base cases for if it doesn't exist
        if (currentTree.left == null && value < currentTree.data) {
            return "DOES NOT EXIST";
        }
        if (currentTree.right == null && value >= currentTree.data) {
            return "DOES NOT EXIST";
        }

        // Recursive cases
        if (value < currentTree.data) {
            console.log("recursive left");
            let currPath = this.findNode(currentTree.left, value);
            if (currPath == "DOES NOT EXIST") {
                return currPath;
            } else {
                currPath.push("left");
                return currPath;
            }
        } else {
            console.log("recursive right");
            let currPath = this.findNode(currentTree.right, value);
            if (currPath == "DOES NOT EXIST") {
                return currPath;
            } else {
                currPath.push("right");
                return currPath;
            }
        }
    }

    // Method for finding a node
    searchNode(data) {
        if (this.count == 0) {
            console.log("no nodes available");
            return;
        }
        let path = this.findNode(this.tree, data);
        this.animation.animateSearch(path);
    }

    // Method for deletion
    deleteNode(value) {
        // Find node with prev
        let curr = this.tree;
        let prev = curr;
        let path = new Array();
        while (curr != null) {
            // Check if it's found the node
            if (curr.data == value) {
                // Delete

                // If node is root
                if (curr == this.tree) {
                    if (this.tree.left == null && this.tree.right == null) {
                        this.tree.data = null;
                        console.log("deleted root node");
                        this.count -= 1;
                        this.animation.animateDeleteRoot();
                        return;
                    } else { 
                        // Return error - can't delete root node unless it is isolated
                        console.log("Cannot delete root node unless all other nodes are deleted");
                        document.getElementById("status-bar").innerHTML = "Cannot delete root node unless all other nodes are delete";
                        return;
                    }
                }

                // Check if both children are null
                if (curr.left == null && curr.right == null) {
                    if (prev.data > curr.data) {
                        prev.left = curr.left;
                    } else {
                        prev.right = curr.left;
                    }
                    console.log("Deleted Node " + curr.data);
                    let addOrder = this.printPreOrder();
                    this.animation.animateDelete(path, null, addOrder.split(' '), this.tree);
                    this.count -= 1;
                    return;
                }
                // Check if one of the children are null
                if (curr.left == null) {
                    if (prev.data > curr.data) {
                        prev.left = curr.right;
                    } else {
                        prev.right = curr.right;
                    }
                    console.log("Deleted Node " + curr.data);
                    let addOrder = this.printPreOrder();
                    this.animation.animateDelete(path, "right", addOrder.split(' '), this.tree);
                    this.count -= 1;
                    return;
                } else if (curr.right == null) {
                    if (prev.data > curr.data) {
                        prev.left = curr.left;
                    } else {
                        prev.right = curr.left;
                    }
                    console.log("Deleted Node " + curr.data);
                    let addOrder = this.printPreOrder();
                    this.animation.animateDelete(path, "left", addOrder.split(' '), this.tree);
                    this.count -= 1;
                    return;
                } else {
                    // Both children are present
                    let successorPath = new Array();
                    let successor = curr.right;
                    let successorPar = curr.right;
                    successorPath.push("right");
                    while (successor.left != null) {
                        successorPar = successor;
                        successor = successor.left;
                        successorPath.push("left");
                    }

                    // Delete Node
                    let temp = new TreeNode(successor.data);
                    if (successorPar == successor) {
                        temp.right = successor.right;
                    } else {
                        // Not the first node right so delete left
                        successorPar.left = successor.right;
                        temp.right = curr.right;
                    }

                    temp.left = curr.left;

                    if (prev.data > curr.data) {
                        prev.left = temp;
                    } else {
                        prev.right = temp;
                    }
                    
                    console.log("Deleted Node " + curr.data);
                    let addOrder = this.printPreOrder();
                    this.animation.animateDelete(path, successorPath, addOrder.split(' '), this.tree);
                    this.count -= 1;
                    return;
                }
            }
            if (value < curr.data) {
                prev = curr;
                curr = curr.left;
                path.push("left");
            } else {
                prev = curr;
                curr = curr.right;
                path.push("right");
            }
        }

        // Couldn't find node
        console.log("Node does not exist");
        document.getElementById("status-bar").innerHTML = "Node does not exist";
    }

    // Print methods
    printInOrder() {
        // Resets vars
        this.currPrintText = "";
        // Starts the recursive method
        this.printInOrderRecursive(this.tree)
        // Return print text
        return this.currPrintText;
    }
    printInOrderRecursive(curr) {
        // Base Case
        if (curr == null) {
            return;
        }
        // First goes left
        this.printInOrderRecursive(curr.left);
        // Print once reached as far left as the sub tree can
        this.currPrintText += curr.data + " ";
        // Then proceed right
        this.printInOrderRecursive(curr.right);
    }

    printPreOrder() {
        // Resets vars
        this.currPrintText = "";
        // Starts the recursive method
        this.printPreOrderRecursive(this.tree)
        // Return print text
        return this.currPrintText;
    }
    printPreOrderRecursive(curr) {
        // Base Case
        if (curr == null) {
            return;
        }
        // First prints root
        this.currPrintText += curr.data + " ";
        // Then goes left
        this.printPreOrderRecursive(curr.left);
        // Then goes right
        this.printPreOrderRecursive(curr.right);
    }

    printPostOrder() {
        // Resets vars
        this.currPrintText = "";
        // Starts the recursive method
        this.printPostOrderRecursive(this.tree)
        // Return print text
        return this.currPrintText;
    }
    printPostOrderRecursive(curr) {
        // Base Case
        if (curr == null) {
            return;
        }
        // First goes left
        this.printPostOrderRecursive(curr.left);
        // Then goes right
        this.printPostOrderRecursive(curr.right);
        // Finally, prints
        this.currPrintText += curr.data + " ";
    }
}

// Begin seperate call functions for the html
// variables
var bstTree = null;

function onLoad() {
    bstTree = new BST();
}

function addNode() {
    bstTree.addNode(Number(document.getElementById('addNode').value));
    document.getElementById("status-bar").innerHTML = "Animation Complete";
}

function searchNode() {
    document.getElementById("status-bar").innerHTML = "Animation Complete";
    bstTree.searchNode(Number(document.getElementById('searchNode').value));
}

function deleteNode() {
    document.getElementById("status-bar").innerHTML = "Animation Complete";
    bstTree.deleteNode(Number(document.getElementById('deleteNode').value));
}

function inOrder() {
    document.getElementById("status-bar").innerHTML = bstTree.printInOrder();
}
function postOrder() {
    document.getElementById("status-bar").innerHTML = bstTree.printPostOrder();
}
function preOrder() {
    document.getElementById("status-bar").innerHTML = bstTree.printPreOrder();
}
