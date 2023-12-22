import {
  IStoreOption
} from './iStore';

interface ITreeNodeData {
  id: string | number,
  type: string,
  label: string,
  children: ITreeNodeData[] | null,
  [key: string]: any,
}

interface ITreeNode extends ITreeNodeData {
  isChecked: boolean,
  isExpanded: boolean,
  isFolder: boolean,
  // isCollapsed: boolean,
  deepLevel: number,
  parent: ITreeNode | null,
  isChildLoad: boolean,
  hasChild: boolean,
  disabled: boolean,
  willLoadOnMount: boolean,
  nodePath: string | null,
  [key: string]: any,
}

interface ITreeOptions {
  defaultChildProperty?: string,
  loaderOptions?: IStoreOption,
  useCheckbox?: boolean,
  expandDepthLevelValue?: number,
  hiddenRoot?: boolean,
}

interface ITreeExpandFn {
  (treeNode: ITreeNode): void
}

interface ITreeRowCheckFn {
  (treeNode: ITreeNode, checked: boolean): void
}

interface ITreeSlotBind {
  treeNode: ITreeNode,
  events: {
    expand: ITreeExpandFn,
    rowCheck: ITreeRowCheckFn,
  }
}


export {
  ITreeNodeData,
  ITreeNode,
  ITreeOptions,
  ITreeExpandFn,
  ITreeRowCheckFn,
  ITreeSlotBind,
}