import type { Component } from "vue";

export interface App {
  id: number;
  name: string;
  path: string;
  component: Component;
}

export interface KeyboardEvent {
  key: string;
  ctrlKey: boolean;
}
