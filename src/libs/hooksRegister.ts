export function useHooksRegister() {
  const hooks: { [key: string]: Array<() => void> } = {};

  function register(key: string, fn: () => void) {
    if (hooks[key]) {
      hooks[key].push(fn);
    } else {
      hooks[key] = [fn];
    }
  }

  function runHooks(key: string) {
    if (!hooks[key]) return;
    hooks[key].forEach((fn) => fn());
  }

  return { register, runHooks };
}
