type ClassValue = string | number | boolean | undefined | null | Record<string, boolean | undefined | null>;

export function classNames(...classes: ClassValue[]): string {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .filter(Boolean)
    .join(' ');
}
