/**
 * Created on 2019-06-03.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

/**
 * Polyfill for constructor name
 */
export function polyfillConstructorName() {
    if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
        Object.defineProperty(Function.prototype, 'name', {
            get() {
                const funcNameRegex = /function\s([^(]{1,})\(/;
                const results = (funcNameRegex).exec((this).toString());
                return (results && results.length > 1) ? results[1].trim() : '';
            },
            set(value) { /* nothing */ },
        });
    }
}
