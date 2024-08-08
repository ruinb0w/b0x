export interface Tab extends RawTab {
  id: number;
}

export interface RawTab {
  name: string;
  icon: string;
  path: string;
}

export interface Hooks {
  onSwitchTab: () => void;
}
