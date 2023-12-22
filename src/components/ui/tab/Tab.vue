<!--
  Tab 추가 되어야 할것 
  단일 화면으로 처리 할수 있나 ? 
  삭제 문제 처리
  Activate 문제 처리
  MultiSelect
-->
<template>    
  <div :class = "getTabWrapperClass">   
    <div class= "tab-item-wrapper" :class = "getTabItemWrapperClass" :style = "getTabItemWrapperStyle">
      <div v-if = 'state.useSlider' 
        class = 'tab-item-slider-icon-wrapper'
        @click = "onMoveSlider('prev')"
        >
        <slot name = 'tab-item-prev-btn'>
          <div :class = "getSliderClass('prev')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg> 
          </div>
        </slot>
      </div>
      <div class = 'tab-item-group-wrapper' ref = 'tabItemGroupEl' :style = "{
        'overflow' : direction === 'row' && useSlider === false ? 'auto' : 'hidden'
        }">        
        <div class = 'tab-item-group-list-wrapper' :class = "getTabItemGroupClass" ref = 'tabItemGroupListEl'>
          <div v-for = "(tab, i) in state.tabItems" :key = "i"
            class = 'tab-item-list'
            :class = "getTabItemTitleWrapperClass(tab)"
            @click = "onTabClick($event, tab, i)">
            <div class = 'tab-item-list-delete-icon' @click.stop = "onDeleteTab(tab)" v-if = 'tab.canDelete && showTabDeleteIcon'>
              <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-8.991 6.932 2.717-2.718c.146-.146.338-.219.53-.219.405 0 .751.325.751.75 0 .193-.073.384-.219.531l-2.718 2.717 2.728 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.531-.219l-2.728-2.728-2.728 2.728c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .384.073.53.219z" fill-rule="nonzero"/></svg>
            </div>
            <slot name = 'tab-item-list-slot' v-bind="tab">
              {{ tab.tabName }}
            </slot>
          </div>
        </div>
      </div>
      <div v-if = 'state.useSlider' 
        class = 'tab-item-slider-icon-wrapper'
        @click = "onMoveSlider('next')"
      >
        <slot name = 'tab-item-next-btn'>
          <div :class = "getSliderClass('next')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/></svg>
          </div>
        </slot>
      </div>
    </div>
    <div class = 'tab-item-content-wrapper' :class = '{"tab-item-content-fixed": tabType === "fixed" }' ref = 'childEls'>
      <slot/>
      <TabItem v-for="tabItem in state.manualItems" 
        :tabObj = "tabItem" 
        :key="tabItem" 
        :tabName="tabItem.tabName" 
        :canDelete="tabItem.canDelete"  
        :useContent="tabItem.slotComponent ? true : false"
        :isManual = "true"         
        :slotComponent="tabItem.slotComponent" />
    </div>
  </div>
</template>
<script lang="ts">
import { ITabItem } from '@/interfaces/ui';
import {computed, defineComponent, nextTick, onMounted, onUnmounted, PropType, provide, reactive, ref, SetupContext, watch } from 'vue';
import TabItem from './TabItem.vue';
import useSlider, { IUseSlider } from '@/compositions/useSlider';
import useCssApi from '@/compositions/useCssApi';

export default defineComponent({
  name:'TabUi', 
  emits: ['tabChanged'],
  components: {
    TabItem
  },
  props: {
    cssPrefix: {
      type: String,
      default: '',
    },
    direction: {
      type: String as PropType <'row' | 'col' | 'under'>,
      default: 'col',
    },
    tabItemWrapperClass : {
      type: Array,
      default: [null] as unknown as String[],
    },
    tabItemTitleWrapperClass : {
      type: Array,
      default: [] as String[],
    },
    tabType: {
      type: String,
      default: 'fixed'
    },
    tabItemActivateClass : {
      type: Array,
      default: ['tab-activate'] as String[],
    },
    tabItemWrapperStyle: {
      type: Array,
      default: [] as Object[],
    },
    useSlider : {
      type: Boolean,
      default: true,
    },
    showTabDeleteIcon: {
      type: Boolean,
      default: true,
    },
    showTabGroup: {
      type: Boolean,
      default: true,
    },
    useMultiActivate: {
      type: Boolean,
      default: false, // false,
    }
  },
  setup(props, { emit }: any ) {
    const childEls = ref();
    const tabItemGroupEl = ref<HTMLDivElement>();
    const tabItemGroupListEl = ref<HTMLDivElement>();
    const { getClassPrefix } = useCssApi(props.cssPrefix ?? '');

    const state = reactive({
      tabItems: [] as ITabItem[],
      manualItems: [] as ITabItem[],
      activatedTabs: [] as ITabItem[],
      useSlider: false,
      position: 0,
      cnt: 1,
      sliderClickTime: new Date(),
      slider: null as IUseSlider,
      disableSliderPrevBtn: true,  
      disableSliderNextBtn: true,    
    })

    const getManualTabItems = computed(() => state.manualItems.filter((item) => item.isManual === true));
    const getItemGroupListOption = () => {
      return {
        width:  tabItemGroupEl.value?.getBoundingClientRect().width,
        scrollWidth : tabItemGroupEl.value?.scrollWidth,
        height:  tabItemGroupEl.value?.getBoundingClientRect().height,
        scrollHeight : tabItemGroupEl.value?.scrollHeight,
      }
    }

    const updateSliderBtn = () => {
      state.disableSliderPrevBtn = !state.slider.hasPrevPosition();
      state.disableSliderNextBtn = !state.slider.hasNextPosition();
    }

    const checkUseSlider = () => {  
      const { width, scrollWidth, height, scrollHeight } = getItemGroupListOption();
      
      if (props.useSlider === false) {
        state.useSlider = false;
        return;
      }

      if (props.direction === 'col' || props.direction === 'under') {
        if (scrollWidth + state.position > width) {
          state.useSlider = true;
        } else {
          state.useSlider = false;
        }
        state.slider.updateParentEl();
        updateSliderBtn(); 
      } else if (props.direction === 'row') { 
        if (scrollHeight + state.position > height) {
          state.useSlider = true;
        } else {
          state.useSlider = false;
        }

        state.slider.updateParentEl();
        updateSliderBtn();
      }
    }

    const addTabItem = (tab: ITabItem) => {
      // //console.log("addTabItem ", tab);
      return state.manualItems.push(tab)
    }

    provide('addTabItem', (tab: ITabItem) => {
      // //console.log("provide tab ", tab);
      tab.tabName = tab.tabName ? `${tab.tabName}`: 'unnamed tab';   
      state.tabItems.push(tab)
      nextTick(() => checkUseSlider());

      if ((tab.tabObj as any).activated === true) {
        nextTick(() => activateTab(tab));
      }
    });

    const findIndexTabInActivateTab = (tab: ITabItem): number => {
      return state.activatedTabs.findIndex((activatedTab) => activatedTab === tab);
    }


    const deActivateTab = (tab:ITabItem, index?: number) => {
      if (tab.setActivate) {
        tab.setActivate(false); 
      }
      
      if (index > -1) {
        state.activatedTabs.splice(index, 1);
      }
    }

    const activateTab = (tab:ITabItem) => {
      if (tab.setActivate) {
        props.useMultiActivate === true
        ? ((state.activatedTabs.length === 0) ? tab.setActivate(true) : '')
        : tab.setActivate(true); 
      }      
      props.useMultiActivate ? (state.activatedTabs.push(tab)) : state.activatedTabs = [tab]; 
      emit('tabChanged', tab, state.activatedTabs);
    }

    const onTabClick = (event: MouseEvent, tab: ITabItem, index: number) => {      
      if (tab) {    
        if (props.useMultiActivate) {
          const findIndex = findIndexTabInActivateTab(tab);
          findIndex > -1 ?  deActivateTab(tab, findIndex) : activateTab(tab);
        } else {
          state.tabItems.forEach((tabItem) => {
            if (tabItem !== tab) {
              tabItem.setActivate(false);
            }
          });
          activateTab(tab);
        }

        if (state.useSlider) {
          state.position = state.slider.focusElPosition(index);
          chnageTranslate();
          updateSliderBtn();
        }
      }
    }

    const getTabItemWrapperClass = computed(() => {
      const itenDirectionClass =  props.direction === 'row' ? 'tab-flex-col' : 'tab-flow-row'
      return [itenDirectionClass, props.tabItemWrapperClass];
    });

    const getTabItemGroupClass = computed(() => {
      const itenDirectionClass =  props.direction === 'row' ? 'tab-flex-col' : 'tab-flow-row'
      return [itenDirectionClass];
    });
    
    const getTabWrapperClass = computed(() => {
      const directionClass =  props.direction === 'row' 
             ? 'tab-flex-row' 
             : props.direction === 'under' ? 'tab-flex-row-reverse'  :  'tab-flex-col';
      
      const typeClass = props.tabType === 'fixed' ? 'overflow-hidden' : '';

      return [getClassPrefix('tab-wrapper'), directionClass, typeClass];
    })

    const getTabItemTitleWrapperClass = computed(() => (tab: ITabItem)=> {
      const itemClass = [...props.tabItemTitleWrapperClass];
      if (findIndexTabInActivateTab(tab) > -1) itemClass.push([...props.tabItemActivateClass]);
      // if (tab.canDelete === true) itemClass.push('can-delete');
      return itemClass;
    });

    const onMoveSlider = (direction: string) => {
      if (state.slider && new Date().getTime() - state.sliderClickTime.getTime() > 200) {
        state.sliderClickTime = new Date();
        state.position = direction === 'next' ? state.slider.getNextStartPosition() : state.slider.getPrevStartPosition();
        updateSliderBtn();
        chnageTranslate();
      }
    }

    const chnageTranslate = () => {
      const transformStr = props.direction === 'row' 
      ? `translateY(-${state.position}px)`
      : `translateX(-${state.position}px)`
      tabItemGroupListEl.value.style.transform = `${transformStr}`;
    }

    const getTabItemWrapperStyle = computed(() => {
      return [props.tabItemWrapperStyle];
    });

    const getSliderBtnClass = computed(() => (btnType: string) => {
      const classList = [];
      if(btnType === 'prev') {
        if (state.disableSliderPrevBtn) {
          classList.push('disabled');
        }
      }      
      return classList; 
    });

    const getSliderClass = computed(() => (btnType: string) => {
      const classList = [];
      if(btnType === 'prev') {
        if (state.disableSliderPrevBtn) {
          classList.push('disabled');
        }
        classList.push(props.direction === 'row' ? 'rotate--90' : 'rotate-180')
      } else if (btnType === 'next') {
         if (state.disableSliderNextBtn) {
          classList.push('disabled');
        }
         classList.push(props.direction === 'row' ? 'rotate-90' : '')
      }

      return classList;
    });

    const onResize = () => checkUseSlider();
    const onDeleteTab = (tab: ITabItem) => {
      const findTabItemIndex = state.tabItems.findIndex((tabItem) => tabItem === tab);
      if (findTabItemIndex > -1) {
        state.tabItems.splice(findTabItemIndex, 1);
        tab.delete ? tab.delete() : '';
        nextTick(()=>checkUseSlider());
      }
    }

    const setActiveTab = (tab: any) => {
      activateTab(tab as ITabItem)
    }

    onUnmounted(() => {
      window.removeEventListener('resize', onResize);
    })

    onMounted(() => {
      window.addEventListener('resize', onResize);
      state.slider = useSlider({
        parentEl: tabItemGroupEl.value,
        childWrapperEl: tabItemGroupListEl.value,
        childClassName: 'tab-item-list',
        position: 0,        
        direction: props.direction,
      });

      watch(
        () => props.useSlider,
        () => checkUseSlider(),
      )
      
      tabItemGroupEl.value.style.display = props.showTabGroup === true ? 'block' : 'none';
    })

    return {
      state,
      getClassPrefix,
      addTabItem,
      setActiveTab,
      onTabClick,
      onMoveSlider,
      onDeleteTab,
      childEls,
      tabItemGroupEl,
      tabItemGroupListEl,
      getTabItemWrapperClass,
      getTabWrapperClass,
      getTabItemGroupClass,
      getManualTabItems,
      getTabItemTitleWrapperClass,
      getTabItemWrapperStyle,
      getSliderBtnClass,
      getSliderClass,
    }

  },
})
</script>
<style lang="scss">

  .display-none {
    display: none;
  }

  .rotate--90 {
    transform: rotate(-90deg);
  }

  .overflow-hidden {
    overflow: hidden;
  }

  .tab-wrapper {
    display: flex; 
    min-width: 0;  
    height:100%;
  }

  .tab-item-content-fixed {
    overflow: auto;
    flex:1;
  }

  .tab-flex-col {
    flex-direction: column;
  }

  .tab-flex-row {
    flex-direction: row;
  }

  .tab-inline-row {
    display: inline-block;
  }

  .tab-flex-row-reverse {
    flex-direction: column-reverse;
  }

  .tab-item-content-wrapper {
    flex:1;
  }

  .tab-item-wrapper {
    display:flex;
    // min-width: 0px;    
    .tab-item-slider-icon-wrapper {
      // min-width:45px; 
      padding:0.5rem;  
      // height:100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      cursor: pointer;

      .disabled {
        opacity: 0.1;
        cursor: not-allowed;
      }
    }

    .tab-item-group-list-wrapper {
      display:flex;
      flex:1;
      flex-wrap: nowrap;
      min-width: 100%;
      max-width: 0px;  
      // overflow: hidden;
      transition: 0.2s ease;
    }

    .tab-item-group-wrapper {
      flex: 1;
      overflow: auto;
    }
  }

  .tab-item-list {
    // @apply p-[1rem] bg-[#999] hover:bg-[#666] min-w-[100px] max-w-[350px];
    // padding: 0px 20px;
    // background:  #999;
    flex: 0 0 auto;
    color:#fff;
    align-items: center;    
    justify-content: center;
    cursor: pointer;
    position:relative;

    .tab-item-list-delete-icon {
      position: absolute;
      top:0;
      right:0;
      width:20px;
      height:20px;
      padding:2px;
    }
  }

  .tab-activate {
    background-color: #e2e2e2;
    // filter: brightness(1.75);
  }

</style>
