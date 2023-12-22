<!-- 
  flex column
  최상의 ui panel
   - header deafult 50px
   - body flex 1
   - footer default 50px 
  
-->
<template>
  <div ref = "el" :class = "getClassPrefix('panel-wrapper')">
    <div v-if = "useSlot('header-slot')"      
      :class = "getClassPrefix('panel-header-wrapper')">
       <slot name = 'header-slot'/>
    </div>  
    <div       
      :class = "getClassPrefix('panel-body-wrapper')">
      <slot name = 'body-slot'/>
    </div>
    <div v-if = "useSlot('footer-slot')"      
      :class = "getClassPrefix('panel-footer-wrapper')">
       <slot name = 'footer-slot'/>
    </div> 
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, SetupContext } from 'vue'
import useContext from '@/compositions/useContext'
import useCssApi from '@/compositions/useCssApi';

export default defineComponent({
  name: 'PanelUi',
  props: {
    cssPrefix: {
      type: String,
      default: '',
    }
  },
  setup(props, context: SetupContext) {
    const el = ref<HTMLDivElement>();
    const { useSlot } = useContext(context);
    const { getClassPrefix } = useCssApi(props.cssPrefix ?? '');

    return {
      el,
      useSlot,
      getClassPrefix,
    }
  },
})
</script>
<style lang="scss">
  @import "@/scss/ui/panel/index.scss";

  
</style>