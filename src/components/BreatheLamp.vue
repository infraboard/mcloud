<script setup></script>

<template>
  <div class="breathe"></div>
</template>

<style scoped>
.breathe {
  position: relative;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #08b963;
  animation: breathe 2s ease-in-out infinite;
}

@keyframes breathe {
  0% {
    box-shadow: 0 0 0 0px rgba(8, 166, 87, 0.2);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(16, 246, 58, 0.5);
  }
  100% {
    box-shadow: 0 0 0 0px rgba(27, 151, 100, 0.2);
  }
}
</style>
