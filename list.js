
function List() {
    this._length = 0;
    this.head = null;
    this._nextPointer = this.head;
    this.add = function(value) {
        var node = new Node(value);
        var temp = this.head;
        this.head = node;
        node.next = temp;
        node.prev = null;
        if (temp != null)
            temp.prev = node;
        this._length++;
        return node;
    }

    this.next = function() {
        if (this._nextPointer == null)
            this._nextPointer = this.head;
        else
            this._nextPointer = this._nextPointer.next;
        return this._nextPointer;
    }
    this.getBody = function() {
        if (this.head != null)
            return this.head.next;
        else
            return null;
    }

}


function Node(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
    this.clone = function() {
        var ris = new Node(null);
        ris.data = JSON.parse(JSON.stringify( this.data ));
        ris.next = this.next;
        ris.prev = this.prev;
        return ris;
    }
}
