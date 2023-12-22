<template>
  <div class ='toggle-container-wrapper' >
    <div class = 'toggle-header-wrapper' @click = "onToggle">
      <ArrowIcon :width = "12" :height = "12"
        class = "icon"
        :class = "{'rotate-90': state.isExpanded}"/>
      &nbsp;
      <slot name ='header-slot' />
    </div>
    <div class = 'toggle-body-wrapper' ref = "bodyEl">
      <slot name ='body-slot' />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import ArrowIcon from '@/components/icon/DropDownArrowIcon.vue';
export default defineComponent({
  name: 'Toggle-Container',
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
    expandHeight: {
      type: Number,
      default: 0,
    }
  },
  components:{
    ArrowIcon,
  },
  setup(props) {
    const bodyEl = ref<HTMLElement>();

    const state = reactive({
      isExpanded: props.isExpanded,
    });

    const onToggle = () => {
      state.isExpanded = !state.isExpanded;
      onChangeStyle();
    }

    const onChangeStyle = () => {
       if (state.isExpanded) {
        bodyEl.value.classList.add('expanded');
        if (props.expandHeight !== 0) {
          bodyEl.value.style.height = `${props.expandHeight}px`;
        }
      } else {
        bodyEl.value.classList.remove('expanded');
        if (props.expandHeight !== 0) {
          bodyEl.value.style.height = `0px`;
        }
      }
    }

    onMounted(() => {
      onChangeStyle();
    })

    return {
      bodyEl,
      state,
      onToggle,
    }

  },
})
</script>
<style lang="scss" scoped>

.toggle-container-wrapper {
  display: flex;
  flex:1;
  flex-direction: column;
}
.toggle-header-wrapper {
  padding:10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-body-wrapper {
  display: flex;
  height:0px;
  transition: all 0.2s ease-in-out;
  // overflow: hidden;
  opacity: 0;
  // visibility: visible;
  // padding:5px 20px;
  flex-direction: column;
  pointer-events: none;

  &.expanded {
    opacity: 1;
    height: 100%;
    pointer-events: all;
  }
}

.icon{
  fill:#fff;
  transition: 0.2s;
}
</style>
