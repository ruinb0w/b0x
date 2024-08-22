const IGNORE_REF_LIST = ["365.kdocs.cn"];

export function isIgnore(url: string) {
  return IGNORE_REF_LIST.some((item) => {
    return url.includes(item);
  });
}
