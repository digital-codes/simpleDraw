<script setup lang="ts">
import { ref, onMounted } from 'vue'

import DataPipes from 'datapipes'

const container = ref(null);
const ready = ref(false)
const diagram = ref()

const evntName = "pup"
const handle = (e: CustomEvent) => {
  console.log('handle',e.detail)
}

onMounted(() => {
  // Create a container and initialize the canvas
  console.log(container.value)
  diagram.value = new DataPipes(container.value!, 2000, 2000,evntName);
  ready.value = true

  diagram.value.resetView()
  // Add nodes
  // const node1 = (diagram.value as unknown as DataPipes).addNode({
  const node1 = diagram.value.addNode({
      label:"Node 1",
    shape: "circle",
    x: 50,
    y: 50,
    size: 60,
    borderWidth: 2
  });

  const node2 = diagram.value.addNode({
    label:"Node 2",
    shape:"square",
    x: 150,
    y: 200,
    size: 60,
    borderWidth: 2
  });

  const node3 = diagram.value.addNode({
    label:"Node 3",
    x: 150,
    y: 300,
    size: 60,
  });

  // Add an edge
  diagram.value.addEdge({
    from: node1,
    to: node2,
    label: "Link"
  });
  diagram.value.addEdge({
    from: node1,
    to: node3
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
  <div class="ctl" v-if="ready">
    <button @click="diagram.resetView()">Center</button>
    <button @click="diagram.zoomin()">Zoom In</button>
    <button @click="diagram.zoomout()">Zoom out</button>
  <button @click="diagram.pan(100,50)">PanL</button>
  <button @click="diagram.pan(-100,-50)">PanR</button>
  </div>
  <div ref="container" class="container" @pup="handle"></div>
</template>

<style scoped>
.ctl {
  display: flex;
  justify-content: left;
  margin: 10px;
} 

.container {
  display:flex;
  width:100%;
  height: 75vh;
  /*
  max-height: inherit;
  */
  border: solid 1px black;
  overflow:hidden;
}
</style>
