<template>
  <div v-if = "isMounted && hasContent" v-show = "isActivate" style="height:100%;width:100%;">
    <slot />
    <component v-once v-if = "slotComponent" :is = "slotComponent()" /> 
  </div>
</template>
<script lang="ts">
import { ITabItem } from '@/interfaces/ui';
import {  useSlots, computed, defineComponent, inject, onBeforeMount, onMounted, reactive, toRefs } from 'vue'

export default defineComponent({
  name:'TabItemUi',
  props: {
    tabObj: {
      type: Object,
      default: null,
    },
    tabName: {
      type: String,
      default: 'TabItem',
    },
    isManual: {
      type: Boolean,
      default: false,
    },
    slotComponent: {
      type: Function,
      default: null,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    useContent: {
      type: Boolean,
      default: true,
    }
  },
  setup(props) {
    const addTabItem: Function = inject('addTabItem');
    const slots = useSlots()

    const setActivate = (toggle: boolean) => {     
      state.isMounted = (toggle === false && state.isMounted === false ) ? false : true;
      state.isActivate = toggle;
    }

    const hasContent = computed(() => {
      return slots['default'] || props.slotComponent; 
    });

    const doDelete = (): boolean => {
      state.isActivate = false;
      state.isMounted = false;
      return true;
    }

    const state = reactive({
      isActivate: false,
      isMounted: false,
      setActivate: setActivate,
    })

    onBeforeMount(() => {
      if (addTabItem) {
        addTabItem({
          tabName: props.tabName,
          isManual: props.isManual,
          canDelete: props.canDelete,
          useContent: props.useContent,
          setActivate,
          delete: doDelete,
          tabObj: props.tabObj,
        } as ITabItem)
      }
    });

    const getActivated = computed(() => {
      if(state.isMounted === true) {
        return true;
      }
      return false;
    });

    const getComponent = () => {
      if (props.slotComponent) {
        const raw = props.slotComponent();
        // //console.log(raw);
        return raw;
      }

      return '';      
    }

    onMounted(() => {
      // //console.error("tab name :", props.tabName);
    })
    
    return {
      hasContent,
      getActivated,
      getComponent,
      ...toRefs(state)
    }
  },
})
</script>
<style lang="scss">
 
</style>
