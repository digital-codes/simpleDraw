<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { DiagramCanvas, NodeConfig, EdgeConfig } from '../services/drawCore';

const container = ref(null);
const ready = ref(false)
const diagram = ref(null)

onMounted(() => {
  // Create a container and initialize the canvas
  console.log(container.value)
  diagram.value = new DiagramCanvas(container.value!, 300, 400);
  ready.value = true

  // Add nodes
  const node1 = diagram.value.addNode({
    label:"Node 1",
    shape: "circle",
    x: 50,
    y: 50,
    size: 80,
    color: "lightblue",
    borderColor: "black",
    borderWidth: 2
  });

  const node2 = diagram.value.addNode({
    label:"Node 2",
    shape:"square",
    x: 150,
    y: 200,
    size: 80,
    color: "lightgreen",
    borderColor: "black",
    borderWidth: 2
  });

  // Add an edge
  diagram.value.addEdge({
    from: node1,
    to: node2,
    color: "gray",
    width: 2,
    label: "Link",
    selected: false
  });

})

/*
// Remove node or edge later if needed
// diagram.removeNode("node1");
// diagram.removeEdge("node1", "node2");
*/

// Resize canvas
// diagram.resize(1000, 800);

// Zoom and pan actions
/*
diagramCanvas.zoomin();
diagramCanvas.zoomout();
diagramCanvas.pan(100, 50);
*/
</script>

<template>
  <div v-if="ready">
  <button @click="diagram.zoomin()">Zoom In</button>
  <button @click="diagram.zoomout()">Zoom out</button>
  <button @click="diagram.pan(100,50)">PanL</button>
  <button @click="diagram.pan(-100,-50)">PanR</button>
  </div>
  <div ref="container" class="container"></div>
</template>

<style scoped>
.container {
  width: 300px;
  height: 400px;
  border: solid 1px black;
  overflow:hidden;
}
</style>
