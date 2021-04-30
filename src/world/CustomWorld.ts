class CustomWorld<T> {
  private random: string | undefined;
  private store: Map<string, T> = new Map();

  public keepValue(k: string, v: T): void {
    this.store.set(k, v);
  }

  public setValues(map: Map<string, T>) {
    this.store = map;
  }

  public getValues(): Map<string, T> {
    return this.store;
  }

  public findValue(k: string): T {
    return this.store.get(k) as T;
  }

  public getRandom(): string {
    return <string>this.random;
  }

  public setRandom(v: string) {
    this.random = v;
  }

}

export { CustomWorld };
