export interface CreateComponentInterface<T, U> {
  create(componentName: string, system?: U): Promise<T>;

  findByName(childName: string, parentName?: string, grandParent?: string): Promise<T>;
}
