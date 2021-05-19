export interface JsonRpc<T> {
    jsonrpc: string;
    id: string;
    method: string;
    params: T
}

export function makeJsonRpc<T>(params: T, method: string, id: string = "dontcare"): JsonRpc<T> {
    return {
        jsonrpc: "2.0",
        id,
        method,
        params
    }
}

export interface JsonRpcOk<T> {
    jsonrpc: string;
    id: string;
    result: T;
}

export interface JsonRpcErr<T> {
    jsonrpc: string;
    id: string;
    error: T
}

export type JsonRpcResult<T, E> = JsonRpcOk<T> | JsonRpcErr<E>;

export function jsonRpcResultErr<T, E>(result: JsonRpcResult<T, E>): E | undefined {
    const asErr = result as JsonRpcErr<E>;
    return asErr?.error;
}

export function jsonRpcResultOk<T, E>(result: JsonRpcResult<T, E>): T | undefined {
    const asOk = result as JsonRpcOk<T>;
    return asOk?.result;
}
