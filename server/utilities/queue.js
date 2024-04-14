/**
 * Represents a single node in a linked list, used within the queue implementation.
*/
class Node{
    /**
     * Creates a new node.
     * @param {*} data - The data to be stored within the node.
    */
    constructor(data){
        this.data = data;
        // Reference to the next node (initially null)
        this.next = null;
    };
};

/**
 * Implementation of a Queue data structure. Follows the FIFO (First in, First out) principle. 
*/
module.exports = class Queue{
    /**
     * Initializes an empty queue.
    */
    constructor(){
        // Front of the queue
        this.head = null;
        // End of the queue
        this.tail = null;
        // Number of elements 
        this.size = 0;
    };

    /**
     * Adds an element to the end of the queue.
     * @param {*} data - The element to be added.
    */
    enqueue(data){
        const newNode = new Node(data);
        if(this.isEmpty()){
            this.head = newNode;
            this.tail = newNode;
        }else{
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    };

    /**
     * Removes and returns the element at the front of the queue.
     * @returns {*} The removed element, or null if the queue is empty.
    */
    dequeue(){
        if(this.isEmpty()) return null;
        const removedNode = this.head;
        this.head = this.head.next;
        if(this.head === null) this.tail = null;
        this.size--;
        return removedNode.data;
    };


    /**
     * Iterates through the queue, applying the provided callback function to each element.
     * @param {function} callback - Callback function that receives each node's data as parameter. Example: (data) => console.log(data)
    */
    forEach(callback){
        let currentNode = this.head;
        while(currentNode !== null){
            callback(currentNode.data);
            currentNode = currentNode.next;
        }
    };

    /**
     * Generates a string representation of the queue.
     * @returns {string} String representing the queue's contents. 
    */
    toString(){
        let str = '[';
        let currentNode = this.head;
        while(currentNode !== null){
            str += `${currentNode.data}`;
            if(currentNode.next !== null) str += ', ';
            currentNode = currentNode.next;
        }
        str += ']';
        return str;
    };

    /**
     * Returns the element at the front of the queue without removing it.
     * @returns {*} The front element, or null if the queue is empty.
    */
    peek(){
        if(this.isEmpty()) return null;
        return this.head.data;
    };

    /**
     * Clears all elements from the queue.
    */
    clear(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    };

    /**
     * Returns the number of elements in the queue.
     * @returns {number} The size of the queue.
    */
    getSize(){
        return this.size;
    };

    /**
     * Returns true if the queue is empty, false otherwise.
     * @returns {boolean} 
    */
    isEmpty(){
        return this.size === 0;
    }
};