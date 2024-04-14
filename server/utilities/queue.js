class Node{
    constructor(data){
        this.data = data;
        this.next = null;
    };
};

module.exports = class Queue{
    constructor(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    };

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

    dequeue(){
        if(this.isEmpty()) return null;
        const removedNode = this.head;
        this.head = this.head.next;
        if(this.head === null) this.tail = null;
        this.size--;
        return removedNode.data;
    };

    forEach(callback){
        let currentNode = this.head;
        while(currentNode !== null){
            callback(currentNode.data);
            currentNode = currentNode.next;
        }
    };

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

    peek(){
        if(this.isEmpty()) return null;
        return this.head.data;
    };

    clear(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    };

    getSize(){
        return this.size;
    };

    isEmpty(){
        return this.size === 0;
    }
};