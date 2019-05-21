/**
 * Created on 2019-05-21.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

declare module 'jsum' {
    export const stringify: (object: any) => string;
    export const digest: (object: any, hashAlgorithm: string, encoding: string) => string;
}
