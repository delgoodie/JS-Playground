class Node {
    static all = [];
    static BEFORE = 1;
    constructor(_x, _y, _edges = [], _connect) {
        this.x = _x;
        this.y = _y;
        this.edges = _edges;
        if (_connect) {
            if (_connect == Node.BEFORE) _connect = Node.all[Node.all.length - 1];
            new Edge(this, _connect);
        }
        Node.all.push(this);
    }

    get connected() {
        return this.edges.reduce((acc, e) => acc.concat([e.a, e.b]), []);
    }

    static draw() {
        Node.all.forEach(n => drawPoint({ x: n.x, y: n.y }, 'red'));
    }
}

class Edge {
    static all = [];
    constructor(_a = new Node(), _b = new Node()) {
        this.a = _a;
        this.b = _b;
        this.a.edges.push(this);
        this.b.edges.push(this);
        Edge.all.push(this);
    }

    get weight() {
        return Math.hypot(this.a.x - this.b.x, this.a.y - this.b.y);
    }

    static draw() {
        Edge.all.forEach(e => drawLine({ x: e.a.x, y: e.a.y }, { x: e.b.x, y: e.b.y }, 'green', 20 / e.weight));
    }
}

function randomNodes(n, eFreq) {
    for (let i = 0; i < n; i++) new Node(Math.random() * 20, Math.random() * 20, [], i == 0 ? null : Node.BEFORE);

    let randManip = Math.random() * eFreq + n / 3;
    for (let i = 0; i < randManip; i++) {
        var valid = false;
        var i1, i2;
        var it = 0;
        while (!valid && it < 100) {
            it++;
            i1 = Math.round(Math.random() * (Node.all.length - 1));
            i2 = Math.round(Math.random() * (Node.all.length - 1));
            valid =
                Node.all[i1].edges.length < n / 2
                && Node.all[i2].edges.length < n / 2
                && !Node.all[i1].edges.some(e => e.a == Node.all[i2] && e.b == Node.all[i2]);
        }
        new Edge(Node.all[i1], Node.all[i2]);
    }
}



drawGrid(20, 20, true);
randomNodes(5, 3);
Node.draw();
Edge.draw();


function BruteForce(nodes = Node.all) {
    return nodes.reduce((min, start) => {
        let sum = BruteRecurse(start, nodes.filter(n => n != start), []);
        console.log(sum);
        throw 'e';
        if (sum < min) return sum;
    });
}

function BruteRecurse(current, req, used) {
    if (req.length == 0) return used;
    else {
        current.forEach(edge)
        l.reduce((arr, n) => arr.concat(permutations(l.filter(n2 => n2 != n), p.concat([n]))), []);
    }
}