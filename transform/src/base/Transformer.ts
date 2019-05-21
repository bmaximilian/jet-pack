/**
 * Created on 2019-04-07.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { isNil } from 'lodash';

export abstract class Transformer<In = any, Out = any> {
    /**
     * The source that should be transformed
     */
    protected input: In|null = null;

    /**
     * Sets the input
     *
     * @param input
     */
    public setInput(input: In): this {
        this.input = input;
        return this;
    }

    /**
     * Runs the transformer
     *
     * @returns {Out} : The transformed input
     */
    public run(): Out {
        if (isNil(this.input)) {
            throw new Error('The input must be set before executing transform()');
        }

        return this.transform(this.input);
    }

    /**
     * Transform the input to get the output
     *
     * @return {*}: The desired format
     */
    protected abstract transform(input: In): Out;
}
