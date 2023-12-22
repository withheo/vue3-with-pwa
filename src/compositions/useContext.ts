import { EmitsOptions, SetupContext } from "vue";
import { EContextSlotFilterType } from '@/enums/ui';

const useContext = (context: SetupContext) => {
  const useSlot = (findSlotNm: string): boolean => {
    return Object.keys(context.slots).findIndex((slotNm) => slotNm === findSlotNm) > -1;
  }

  const getSlotFilter = (filterType: EContextSlotFilterType, filterName: string): string[] => {
    if (filterType === EContextSlotFilterType.End) {
      return Object.keys(context.slots).filter((slotKey) => slotKey.endsWith(filterName));
    } else if (filterType === EContextSlotFilterType.Start) {
      return Object.keys(context.slots).filter((slotKey) => slotKey.startsWith(filterName));
    }
    return [];
  }

  return {
    useSlot,
    getSlotFilter,
  }
}

export default useContext;
