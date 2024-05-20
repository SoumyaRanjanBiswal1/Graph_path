document.addEventListener("DOMContentLoaded", function () {
    // Priority queue implementation
    class PriorityQueue {
        constructor() {
            this.elements = [];
        }

        enqueue(priority, value) {
            this.elements.push({ priority, value });
            this.elements.sort((a, b) => a.priority - b.priority);
        }

        dequeue() {
            return this.elements.shift().value;
        }

        isEmpty() {
            return this.elements.length === 0;
        }
    }


    //dijkstra algorithm
    function dijkstra(graph, source, destination) {
        const n = graph.length;
        const distances = Array(n).fill(Infinity);
        const previousNodes = Array(n).fill(null);
        distances[source] = 0;

        const pq = new PriorityQueue();
        pq.enqueue(0, source);

        while (!pq.isEmpty()) {
            const current = pq.dequeue();

            if (current === destination) break;

            for (let neighbor = 0; neighbor < n; neighbor++) {
                if (graph[current][neighbor] !== Infinity) {
                    const alt = distances[current] + graph[current][neighbor];
                    if (alt < distances[neighbor]) {
                        distances[neighbor] = alt;
                        previousNodes[neighbor] = current;
                        pq.enqueue(alt, neighbor);
                    }
                }
            }
        }

        if (distances[destination] === Infinity) return { path: [], cost: Infinity };

        const path = [];
        let step = destination;
        while (step !== null) {
            path.unshift(step);
            step = previousNodes[step];
        }

        return { path, cost: distances[destination] };
    }

    //algorithm to find k shortest paths
    function yenKShortestPaths(graph, source, destination, k) {
        const { path, cost } = dijkstra(graph, source, destination);
        if (path.length === 0) return { shortestPaths: [], totalCosts: [] };

        const shortestPaths = [[...path]];
        const totalCosts = [cost];

        const potentialPaths = new PriorityQueue();

        for (let kIndex = 1; kIndex < k; kIndex++) {
            const lastPath = shortestPaths[kIndex - 1];

            for (let i = 0; i < lastPath.length - 1; i++) {
                const spurNode = lastPath[i];
                const rootPath = lastPath.slice(0, i + 1);

                const tempGraph = graph.map(row => [...row]);

                for (const path of shortestPaths) {
                    if (rootPath.every((value, index) => value === path[index])) {
                        const nextNode = path[i + 1];
                        tempGraph[spurNode][nextNode] = Infinity;
                    }
                }

                for (const node of rootPath) {
                    if (node !== spurNode) {
                        tempGraph[node] = Array(graph.length).fill(Infinity);
                        for (let j = 0; j < graph.length; j++) {
                            tempGraph[j][node] = Infinity;
                        }
                    }
                }

                const { path: spurPath, cost: spurCost } = dijkstra(tempGraph, spurNode, destination);

                if (spurPath.length > 0) {
                    const totalPath = rootPath.slice(0, -1).concat(spurPath);
                    const totalCost = rootPath.reduce((acc, node, idx) => {
                        if (idx < rootPath.length - 1) {
                            return acc + graph[node][rootPath[idx + 1]];
                        }
                        return acc;
                    }, 0) + spurCost;

                    potentialPaths.enqueue(totalCost, totalPath);
                }
            }

            if (potentialPaths.isEmpty()) break;

            const newPath = potentialPaths.dequeue();
            shortestPaths.push(newPath);
            const newPathCost = newPath.reduce((acc, node, index) => {
                if (index < newPath.length - 1) {
                    return acc + graph[newPath[index]][newPath[index + 1]];
                }
                return acc;
            }, 0);
            totalCosts.push(newPathCost);
        }

        return { shortestPaths, totalCosts };
    }
    //shortest path algorithm ends here

    // const graph = [
    //     [0, 10, Infinity, 30, 100],
    //     [10, 0, 50, Infinity, Infinity],
    //     [Infinity, 50, 0, 20, 10],
    //     [30, Infinity, 20, 0, 60],
    //     [100, Infinity, 10, 60, 0]
    // ];


    //DECLARING GRAPH
   // a random 6 node graph
   const graph = [
    //   1   2   3   4   5   6
        [0    , 400   , 100    , 200     , Infinity, Infinity], // 1

        [400  , 0     , 200    , Infinity  , Infinity, 200],  // 2

        [100  , 200   , 0      , 300      , Infinity, 600], // 3

        [200  ,Infinity, 300    , 0        ,  400   , Infinity], // 4

        [Infinity   ,Infinity, Infinity, 400      , 0     , 500], // 5

        [Infinity,200  , 600     , Infinity, 500      , 0]  // 6
    ];

    const colors = ['#FF4136', '#2ECC40', '#0000cc'];

    const elements = [];

    // Add nodes
    for (let i = 0; i < graph.length; i++) {
        elements.push({ data: { id: `n${i}`, label: `Node ${i+1}` } });
    }

    // Add edges
    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph[i].length; j++) {
            if (graph[i][j] !== Infinity && i !== j) {
                elements.push({ data: { id: `e${i}${j}`, source: `n${i}`, target: `n${j}`, weight: graph[i][j] } });
            }
        }
    }

    // Initialize Cytoscape
    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'color': '#fff',
                    'background-color': '#0074D9',
                    'text-outline-width': 2,
                    'text-outline-color': '#0074D9'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(weight)'
                }
            },
            {
                selector: '.highlighted0',
                style: {
                    'background-color': colors[0],
                    'line-color': colors[0],
                    'target-arrow-color': colors[0],
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            },
            {
                selector: '.highlighted1',
                style: {
                    'background-color': colors[1],
                    'line-color': colors[1],
                    'target-arrow-color': colors[1],
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            },
            {
                selector: '.highlighted2',
                style: {
                    'background-color': colors[2],
                    'line-color': colors[2],
                    'target-arrow-color': colors[2],
                    'transition-property': 'background-color, line-color, target-arrow-color',
                    'transition-duration': '0.5s'
                }
            }
        ],
        layout: {
            name: 'grid',
            rows: 2
        }
    });

    // Highlight paths
    function highlightPaths(shortestPaths) {
        // Clear previous highlights
        cy.elements().removeClass('highlighted0 highlighted1 highlighted2');

        shortestPaths.forEach((path, index) => {
            if (index >= 3) return;
            path.forEach((node, i) => {
                if (i < path.length - 1) {
                    const sourceNode = `n${node}`;
                    const targetNode = `n${path[i + 1]}`;
                    cy.$(`#${sourceNode}`).addClass(`highlighted${index}`);
                    cy.$(`#${targetNode}`).addClass(`highlighted${index}`);
                    cy.$(`#e${node}${path[i + 1]}`).addClass(`highlighted${index}`);
                }
            });
        });
    }

    // Display distances
    function displayDistances(totalCosts) {
        const distancesDiv = document.getElementById('distances');
        distancesDiv.innerHTML = '';
        totalCosts.forEach((cost, index) => {
            if (index >= 3) return;
            const p = document.createElement('p');
            p.textContent = `Path ${index + 1}: ${cost}`;
            p.style.color = colors[index];
            distancesDiv.appendChild(p);
        });
    }

    //
    //down

    function generatePathArrayString(shortestPaths) {
        let pathString = "";
        shortestPaths.forEach((path, index) => {
            //add 1 to each element of path array
            path = path.map((x) => x + 1);
            if (index >= 3) return;
            pathString += `Path ${index + 1}: [${path.join(" -> ")}]<br>`;
        });
        return pathString;
    }

    function displayPathArray(shortestPaths) {
        const pathArrayDiv = document.getElementById('pathArray');
        const pathArrayString = generatePathArrayString(shortestPaths);
        pathArrayDiv.innerHTML = pathArrayString;
    }

    //up

    document.getElementById('findPaths').addEventListener('click', () => {
        const source = parseInt(document.getElementById('source').value -1);
        const destination = parseInt(document.getElementById('destination').value -1);
        const k = parseInt(document.getElementById('k').value);

        if (isNaN(source) || isNaN(destination) || isNaN(k) || source < 0 || source >= graph.length || destination < 0 || destination >= graph.length || k < 1 || k > 3) {
            alert('Please enter valid source, destination, and k values.');
            return;
        }

        const { shortestPaths, totalCosts } = yenKShortestPaths(graph, source, destination, k);
        
        highlightPaths(shortestPaths);
        displayDistances(totalCosts);
        //
        //
        generatePathArrayString(shortestPaths);
        displayPathArray(shortestPaths);

        //
    });
});



console.log(555455)