/**
 * Created on 2019-05-08.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */


import { expect } from 'chai';
import { render } from 'enzyme';
import 'mocha';
import React, { Component } from 'react';
import { IWithLocalSearchProps, withLocalSearch } from './withLocalSearch';

interface IData {
    foo: string;
    bar: string;
    baz: string;
}

interface IProps extends IWithLocalSearchProps<IData> {
    data: IData[];
}

const data = [
    { foo: 'Aerosmith', bar: 'Beatles', baz: 'Creedance Clearwater Revival' },
    { foo: 'Deep Purple', bar: 'Elton John', baz: 'Foghat' },
    { foo: 'Guns N\' Roses ', bar: 'Heaven Shall Burn', baz: 'Incubus' },
];

class TheComponent extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        expect(props.data).to.deep.equal(data);
    }

    public componentDidMount(): void {
        expect(this.props.results).to.deep.equal([
            { foo: 'Aerosmith', bar: 'Beatles', baz: 'Creedance Clearwater Revival' },
            { foo: 'Deep Purple', bar: 'Elton John', baz: 'Foghat' },
        ]);
    }

    public render(): React.ReactElement|null {
        return null;
    }
}

describe('withLocalSearch', () => {
    it('Should be able to apply a filter on the given prop key', () => {
        const MyComponent = withLocalSearch('data', ['foo', 'bar'])(TheComponent);

        render(<MyComponent
            data={data}
            intialQuery="le"
        />);
    });
});
