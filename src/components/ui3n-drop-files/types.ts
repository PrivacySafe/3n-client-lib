import { VNode } from 'vue';

export interface Ui3nDropFilesProps {
  title?: string;
  text?: string;
  additionalText?: string;
}

export interface Ui3nDropFilesEmits {
  (e: 'select', fileList: FileList): void;
}

export interface Ui3nDropFilesSlots {
  default: () => VNode;
}