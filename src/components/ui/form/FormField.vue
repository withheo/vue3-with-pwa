<template>
  <div class = 'form-field-wrapper'>
    <div class = 'label' v-if = "props.useLabel">
      <slot name ='label-slot' />
    </div>
    <div class = 'field'>
      <slot name = 'field-slot' />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Form-Field-Ui',
  props: {
    useLabel: {
      type: Boolean,
      default: true,
    }
  },
  setup(props) {

    return {
      props,
    }
  },
})
</script>
<style lang="scss" scoped>
  .form-field-wrapper {
    display: flex;
    flex:1;
    padding: 5px;
    align-items: center;
    height:45px;

    .label {
      min-width: 100px;
    }

    .field {
      fleX:1;
    }
  }

</style>
