<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { DiagramCanvas, NodeConfig, EdgeConfig } from '../services/drawCore';

const container = ref(null);
const ready = ref(false)

onMounted(() => {
  // Create a container and initialize the canvas
  console.log(container.value)
  const diagram = new DiagramCanvas(container.value!, 800, 600);
  ready.value = true

  // Add nodes
  diagram.addNode({
    id: "node1",
    label:"Node 1",
    shape: "circle",
    x: 50,
    y: 50,
    size: 80,
    color: "lightblue",
    borderColor: "black",
    borderWidth: 2,
    selected: false
  });

  diagram.addNode({
    id: "node2",
    label:"Node 2",
    shape:"star",
    x: 300,
    y: 200,
    size: 80,
    color: "lightgreen",
    borderColor: "black",
    borderWidth: 2,
    selected: false
  });

  // Add an edge
  diagram.addEdge({
    id: "edge1",
    from: "node1",
    to: "node2",
    color: "gray",
    width: 2,
    label: "Link",
    selected: false
  });

  // Remove node or edge later if needed
  // diagram.removeNode("node1");
  // diagram.removeEdge("node1", "node2");

  // Resize canvas
  // diagram.resize(1000, 800);
})

/*
// Remove node or edge later if needed
// diagram.removeNode("node1");
// diagram.removeEdge("node1", "node2");
*/

// Resize canvas
// diagram.resize(1000, 800);

</script>

<template>
  <div ref="container" class="container"></div>
</template>

<style scoped>
.container {
  width: 800px;
  height: 600px;
  border: solid 1px black;
}
</style>
