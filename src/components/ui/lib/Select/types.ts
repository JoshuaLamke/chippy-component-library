// Utility to convert a union type to an intersection type (used to detect unions)
type UnionToIntersection<U> = 
  (U extends any ? (x: U) => void : never) extends ((x: infer I) => void) ? I : never;

// Utility type to check if a type is a union type
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// The SelectOption type
export type SelectOption<
  OptionValueName extends string = 'value',
  OptionLabelName extends string = 'label'
> = IsUnion<OptionValueName> extends true
  ? never // Disallow union types for OptionValueName
  : IsUnion<OptionLabelName> extends true
  ? never // Disallow union types for OptionLabelName
  : {
      // If no union types, use the keys OptionValueName and OptionLabelName
      [K in OptionValueName | OptionLabelName]: string;
    } & {
      // Allow any other keys with the `string` value type
      [key: string]: any;
    };