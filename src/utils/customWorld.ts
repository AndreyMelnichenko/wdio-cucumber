class CustomWorld<T> {
    private currentPage: T;
    private random: string;
    private store: Map<string, T> = new Map();

    public keepValue(k: string, v: T): void {
        console.log(this.store);
        this.store.set(k, v);
    }

    public setValues(map: Map<string, T>) {
        this.store = map;
    }

    public getValues(): Map<string, T> {
        return this.store;
    }

    public findValue(k: string): T {
        return this.store.get(k);
    }

    public setPage(v: T): void {
        this.currentPage = v;
    }

    public getPage(): T {
        return this.currentPage;
    }

    public getRandom(): string {
        return this.random;
    }

    public setRandom(v: string) {
        this.random = v;
    }

}

export { CustomWorld };
