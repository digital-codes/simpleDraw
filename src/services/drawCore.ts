// Define interfaces for the configuration objects
interface NodeConfig {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    borderColor: string;
    borderWidth: number;
}

interface EdgeConfig {
    from: string;
    to: string;
    color: string;
    width: number;
    label?: string;
}

class DiagramCanvas {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private nodes: NodeConfig[] = [];
    private edges: EdgeConfig[] = [];
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

    // Add a node to the canvas
    addNode(config: NodeConfig): void {
        this.nodes.push(config);
        this.render();
    }

    // Add an edge to the canvas
    addEdge(config: EdgeConfig): void {
        this.edges.push(config);
        this.render();
    }

    // Remove a node by ID
    removeNode(id: string): void {
        this.nodes = this.nodes.filter(node => node.id !== id);
        this.edges = this.edges.filter(edge => edge.from !== id && edge.to !== id);
        this.render();
    }

    // Remove an edge by source and target IDs
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
    
    
    // Resize the canvas
    resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.render();
    }

    // Render the canvas content
    private render(): void {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw edges
        for (const edge of this.edges) {
            const fromNode = this.nodes.find(node => node.id === edge.from);
            const toNode = this.nodes.find(node => node.id === edge.to);
            if (!fromNode || !toNode) continue;

            const startX = fromNode.x + fromNode.width / 2;
            const startY = fromNode.y + fromNode.height / 2;
            const endX = toNode.x + toNode.width / 2;
            const endY = toNode.y + toNode.height / 2;

            this.context.strokeStyle = edge.color;
            this.context.lineWidth = edge.width;
            this.context.beginPath();
            this.context.moveTo(startX, startY);
            this.context.lineTo(endX, endY);
            this.context.stroke();

            // Draw arrow
            const arrowSize = 6;
            const angle = Math.atan2(endY - startY, endX - startX);
            this.context.beginPath();
            this.context.moveTo(endX, endY);
            this.context.lineTo(
                endX - arrowSize * Math.cos(angle - Math.PI / 6),
                endY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            this.context.lineTo(
                endX - arrowSize * Math.cos(angle + Math.PI / 6),
                endY - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            this.context.closePath();
            this.context.fillStyle = edge.color;
            this.context.fill();

            // Draw edge label
            if (edge.label) {
                this.context.fillStyle = "black";
                this.context.font = "12px Arial";
                this.context.fillText(edge.label, (startX + endX) / 2, (startY + endY) / 2);
            }
        }

        // Draw nodes
        for (const node of this.nodes) {
            this.context.fillStyle = node.color;
            this.context.fillRect(node.x, node.y, node.width, node.height);

            this.context.strokeStyle = node.borderColor;
            this.context.lineWidth = node.borderWidth;
            this.context.strokeRect(node.x, node.y, node.width, node.height);
        }
    }

    // Handle mouse interactions
    private addEventListeners(): void {
        this.canvas.addEventListener("mousedown", (event) => {
            const { offsetX, offsetY } = event;
            for (const node of this.nodes) {
                if (
                    offsetX >= node.x &&
                    offsetX <= node.x + node.width &&
                    offsetY >= node.y &&
                    offsetY <= node.y + node.height
                ) {
                    this.selectedNode = node;
                    this.offsetX = offsetX - node.x;
                    this.offsetY = offsetY - node.y;
                    break;
                }
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            if (this.selectedNode) {
                const { offsetX, offsetY } = event;
                this.selectedNode.x = offsetX - this.offsetX;
                this.selectedNode.y = offsetY - this.offsetY;
                this.render();
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            this.selectedNode = null;
        });
    }
}

export { DiagramCanvas };    
export type { NodeConfig, EdgeConfig };

