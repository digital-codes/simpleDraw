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
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    color: "lightblue",
    borderColor: "black",
    borderWidth: 2
  });

  diagram.addNode({
    id: "node2",
    x: 300,
    y: 200,
    width: 100,
    height: 50,
    color: "lightgreen",
    borderColor: "black",
    borderWidth: 2
  });

  // Add an edge
  diagram.addEdge({
    from: "node1",
    to: "node2",
    color: "gray",
    width: 2,
    label: "Link"
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
