
interface IUseSliderParams {
  parentEl: HTMLElement,
  childWrapperEl: HTMLElement,
  childClassName: string,
  position: number,
  direction: string,
}

interface IUseSlider {
  getNextStartPosition: Function,
  getPrevStartPosition: Function,
  setStartPosition: Function,
  hasNextPosition: Function,
  hasPrevPosition: Function,
  updateParentEl: Function,
  focusElPosition: Function,
}

interface IUSerSliderPosition {
  position: number,
  prevBtn?: boolean,
  nextBtn?: boolean,
}

const useSlider = ({
    parentEl, 
    childWrapperEl,
    childClassName,   
    position,
    direction,
  } : IUseSliderParams): IUseSlider => {   

  let startPosition = position;  
  let childSizes = [] as number[];
  let totalSize = 0; 

  const getItemSize = (target: Element) => {
    return direction === 'row' 
    ? target.getBoundingClientRect().height 
    : target.getBoundingClientRect().width;
  }

  const updateParentEl = () => {   
    const itemElList = getItemElList();
    childSizes = [];
    totalSize = 0;   
    
    Array.from(itemElList).find((item, i) => {
      const itemSize = getItemSize(item);      
      childSizes.push(itemSize);
      totalSize += itemSize;
    });

    //console.log("totalSize ", totalSize);
  }

  const getParentElPosition = () => {
    return {
      width: parentEl.getBoundingClientRect().width,
      height: parentEl.getBoundingClientRect().height,
      scrollWidth : parentEl.scrollWidth,
      scrollHeight : parentEl.scrollHeight,
    }
  }

  const getItemElList = (): HTMLCollectionOf<Element> | null => {
    return childWrapperEl.getElementsByClassName(childClassName);
  }

  const getPrevStartPosition = (): number => {
    if (hasPrevPosition()) {
      // const { width } = getParentElPosition();    
      const parentSize = getItemSize(parentEl);   
      let itemsOffsetWidth = 0;
      let lastedItemStartPosition = 0; 
     
      childSizes.find((size, index) => {
        itemsOffsetWidth += size;      
        if (itemsOffsetWidth > startPosition) {          
          lastedItemStartPosition = itemsOffsetWidth - parentSize;
          return true;
        }
      });

      const movePosition = startPosition - parentSize < 0 
        ? 0
        : lastedItemStartPosition;   
      startPosition = movePosition;
      return movePosition
    } 
    return startPosition;
  }

  const getNextStartPosition = (): number => {
    if (hasNextPosition()) {
      // const { width } = getParentElPosition();  
      const parentSize = getItemSize(parentEl);  
      let itemsOffsetWidth = 0;
      let lastedItemStartPosition = 0; 
     
      childSizes.find((size, index) => {
        itemsOffsetWidth += size;      
        if (itemsOffsetWidth > parentSize + startPosition) { 
          //console.log(index, size);         
          lastedItemStartPosition = itemsOffsetWidth - childSizes[index];
          return true;
        }
      });

      const movePosition = totalSize - (startPosition + parentSize) >= parentSize
      ? lastedItemStartPosition
      : totalSize - parentSize;      
    
      startPosition = movePosition;

      return movePosition;
    }

    return startPosition;
  }

  const focusElPosition = (index: number) => {   
    const parentSize = getItemSize(parentEl); // parentEl.getBoundingClientRect().width;
    let indexStartPosition = 0;
    let indexEndPosition = 0;

    for (let i = 0; i < index; i++) {
      indexStartPosition += childSizes[i];
    }
    indexEndPosition = indexStartPosition + childSizes[index];
  
    if (startPosition + parentSize < indexEndPosition) {
      startPosition = indexEndPosition - parentSize;
    } else if (startPosition > indexStartPosition) {
      startPosition = indexStartPosition;
    }

    return startPosition;
  }
 
  const setStartPosition = (position: number) => {
    startPosition = position;
  }

  const hasNextPosition = (): boolean => {
    const size = getItemSize(parentEl);
    return totalSize - (startPosition + size) > 0;
  }

  const hasPrevPosition = (): boolean => {
    return startPosition > 0;
  }

  return {
    getNextStartPosition,
    getPrevStartPosition,
    setStartPosition,
    hasNextPosition,
    hasPrevPosition,
    updateParentEl,
    focusElPosition,
  }
}

export { IUseSlider, IUSerSliderPosition };
export default useSlider;