interface NodeConfig {
    id: string;
    x: number;
    y: number;
    size: number;
    color: string;
    borderColor: string;
    borderWidth: number;
    selected: boolean;
    shape?: "square" | "circle" | "star"; // New shape options,
    label?: string; // New property for node labels
    labelColor?: string; // Optional label text color    
}

interface EdgeConfig {
    id: string;
    from: string;
    to: string;
    color: string;
    width: number;
    label?: string;
    selected: boolean;
}

class DiagramCanvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private nodes: NodeConfig[] = [];
    private edges: EdgeConfig[] = [];
    private selectedEdge: EdgeConfig | null = null;
    private selectedNode: NodeConfig | null = null;
    private offsetX: number = 0;
    private offsetY: number = 0;

    constructor(container: HTMLElement, width: number, height: number) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        container.appendChild(this.canvas);

        const context = this.canvas.getContext("2d");
        if (!context) throw new Error("Canvas context could not be initialized");
        this.context = context;

        this.addEventListeners();
        this.render();
    }

    addNode(config: NodeConfig): void {
        this.nodes.push(config);
        console.log("nodes:", this.nodes);
        this.render();
    }

    addEdge(config: EdgeConfig): void {
        this.edges.push(config);
        console.log("edges:", this.edges);
        this.render();
    }

    removeNode(id: string): void {
        this.nodes = this.nodes.filter(node => node.id !== id);
        this.edges = this.edges.filter(edge => edge.from !== id && edge.to !== id);
        this.render();
    }

    removeEdge(from: string, to: string): void {
        this.edges = this.edges.filter(edge => edge.from !== from || edge.to !== to);
        this.render();
    }

    modifyNodeStyle(id: string, newStyles: Partial<NodeConfig>): void {
        const node = this.nodes.find(node => node.id === id);
        if (node) Object.assign(node, newStyles);
        this.render();
    }

    modifyEdgeStyle(from: string, to: string, newStyles: Partial<EdgeConfig>): void {
        const edge = this.edges.find(edge => edge.from === from && edge.to === to);
        if (edge) Object.assign(edge, newStyles);
        this.render();
    }

    private render(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw edges
        for (const edge of this.edges) {
            const fromNode = this.nodes.find(node => node.id === edge.from);
            const toNode = this.nodes.find(node => node.id === edge.to);
            if (!fromNode || !toNode) continue;

            const startX = fromNode.x + fromNode.size / 2;
            const startY = fromNode.y + fromNode.size / 2;
            const endX = toNode.x + toNode.size / 2;
            const endY = toNode.y + toNode.size / 2;

            this.context.strokeStyle = edge.color;
            this.context.lineWidth = this.selectedEdge === edge ? edge.width + 2 : edge.width;
            this.context.beginPath();
            this.context.moveTo(startX, startY);
            this.context.lineTo(endX, endY);
            this.context.stroke();


            // Calculate midpoint for label and arrow
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            // Draw edge label
            if (edge.label) {
                this.context.fillStyle = "black";
                this.context.font = "12px Arial";
                this.context.fillText(edge.label, midX, midY - 5); // Position slightly above the line
            }


            // Position arrow to the right of the label
            const arrowOffsetX = (endX - startX) / Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) * 20;
            const arrowOffsetY = (endY - startY) / Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2) * 20;

            const arrowX = midX + arrowOffsetX;
            const arrowY = midY + arrowOffsetY;

            // Draw arrowhead
            const arrowSize = 10;
            const angle = Math.atan2(endY - startY, endX - startX);
            this.context.beginPath();
            this.context.moveTo(arrowX, arrowY);
            this.context.lineTo(
                arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
                arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            this.context.lineTo(
                arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
                arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
            );

            this.context.closePath();
            this.context.fillStyle = edge.color;
            this.context.fill();

        }

        // Draw nodes
        // Draw nodes
        for (const node of this.nodes) {
            this.context.fillStyle = this.selectedNode === node ? "yellow" : node.color;
            this.context.strokeStyle = node.borderColor;
            this.context.lineWidth = node.borderWidth;

            // Draw node shape
            if (node.shape === "circle") {
                const radius = node.size / 2;
                this.context.beginPath();
                this.context.arc(
                    node.x + radius,
                    node.y + radius,
                    radius,
                    0,
                    Math.PI * 2
                );
                this.context.closePath();
                this.context.fill();
                this.context.stroke();
            } else if (node.shape === "star") {
                this.drawStar(node.x + node.size / 2, node.y + node.size / 2, 5, node.size / 2, node.size / 4);
                this.context.fill();
                this.context.stroke();
            } else {
                // Default to square
                this.context.fillRect(node.x, node.y, node.size, node.size);
                this.context.strokeRect(node.x, node.y, node.size, node.size);
            }

            // Draw node label
            if (node.label) {
                this.context.fillStyle = node.labelColor || "black";
                this.context.font = "12px Arial";
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                const centerX = node.x + node.size / 2;
                const centerY = node.y + node.size / 2;
                this.context.fillText(node.label, centerX, centerY);
            }
        }
    }

    private drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
        const step = Math.PI / spikes;
        this.context.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = cx + Math.cos(i * step) * radius;
            const y = cy + Math.sin(i * step) * radius;
            this.context.lineTo(x, y);
        }
        this.context.closePath();
    }


    private addEventListeners(): void {
        let isDragging = false; // Track if a node is being dragged

        this.canvas.addEventListener("pointerdown", (event) => {
            console.log('pointerdown');
            const { offsetX, offsetY } = event;
            isDragging = false;
            this.selectedNode = null;

            // Check if a node was clicked for dragging or selection
            for (const node of this.nodes) {
                console.log('checking node', node.id);
                if (
                    offsetX >= node.x &&
                    offsetX <= node.x + node.size &&
                    offsetY >= node.y &&
                    offsetY <= node.y + node.size
                ) {
                    // unselect any edge
                    if (this.selectedEdge) {
                        console.log('unselect the edge', this.selectedEdge.id);
                        this.selectedEdge.selected = false;
                        this.selectedEdge = null;
                    }
                    // check current selected node
                    const currentNode = this.nodes.find(node => node.id === this.selectedNode?.id);
                    if (currentNode && currentNode.id !== node.id) {
                        console.log('unselect the node', currentNode.id);
                        currentNode.selected = false;
                        console.log('unselect the node', node.id);
                        this.selectedNode = null;
                    }
                    // Select the node
                    node.selected = true;
                    this.selectedNode = node;
                    this.offsetX = offsetX - node.x;
                    this.offsetY = offsetY - node.y;
                    isDragging = true; // Prepare for dragging
                    console.log('selecting node', node.id);
                    this.render();
                    return;
                } else {
                    console.log('not in ', node.id);
                }
            }

            // Check if an edge was clicked for selection
            for (const edge of this.edges) {
                const fromNode = this.nodes.find(node => node.id === edge.from);
                const toNode = this.nodes.find(node => node.id === edge.to);
                if (!fromNode || !toNode) continue;

                const startX = fromNode.x + fromNode.size / 2;
                const startY = fromNode.y + fromNode.size / 2;
                const endX = toNode.x + toNode.size / 2;
                const endY = toNode.y + toNode.size / 2;

                const distance = Math.abs(
                    ((endY - startY) * offsetX - (endX - startX) * offsetY + endX * startY - endY * startX) /
                    Math.sqrt((endY - startY) ** 2 + (endX - startX) ** 2)
                );

                if (distance < 5) {
                    // Toggle edge selection
                    if (this.selectedEdge === edge) {
                        this.selectedEdge = null;
                    } else {
                        this.selectedEdge = edge;
                    }
                    this.selectedNode = null; // Clear node selection
                    this.render();
                    return;
                }
            }

            // If neither a node nor an edge is clicked, clear selections
            this.selectedNode = null;
            this.selectedEdge = null;
            this.render();
        });

        this.canvas.addEventListener("pointermove", (event) => {
            if (this.selectedNode && isDragging) {
                const { offsetX, offsetY } = event;
                this.selectedNode.x = offsetX - this.offsetX;
                this.selectedNode.y = offsetY - this.offsetY;
                this.render();
                console.log("Nodes:", this.nodes);
                console.log("Edges:", this.edges);
            }
        });

        this.canvas.addEventListener("pointerup", () => {
            isDragging = false; // Stop dragging
        });

        this.canvas.addEventListener("pointercancel", () => {
            isDragging = false; // Handle gesture cancellation (e.g., multitouch interruption)
        });
    }

}

export { DiagramCanvas };
export type { NodeConfig, EdgeConfig };

