<template>
  <router-view v-slot="{Component}">
    <component :is="Component" />
  </router-view>
</template>

<script lang="ts">
// import axios from 'axios';
 import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
  components: {
  
  },
  setup() { 
    return {
      
    }
  }
});
</script>

<style lang="scss">

</style>
