export abstract class IError extends Error {
    stack?: string;

    formatError(): string {
        return `${this.name}: ${this.message}`;
    }

    logError(): void {
        console.error(this.formatError());
    }
}
