import type { Component } from "vue";

export interface Plugin {
  id: number | string;
  name: string;
  icon: Component;
  component: Component;
}

export interface Hooks {
  activeHook: () => void;
  unactiveHook: () => void;
}
