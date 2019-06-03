/**
 * Created on 2019-05-26.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import chai from 'chai';
import chaiSpies from 'chai-spies';
import { JSDOM } from 'jsdom';

chai.use(chaiSpies);

interface IGlobal extends NodeJS.Global {
    window: Window,
    document: Document,
    navigator: {
        userAgent: string
    }
}

const globalNode: IGlobal = {
    window,
    document: window.document,
    navigator: {
        userAgent: 'node.js',
    },
    ...global,
};

// Simulate window for Node.js
if (!globalNode.window && !globalNode.document) {
    const { window } = new JSDOM('<!doctype html><html><body></body></html>', {
        beforeParse(win: any) {
            win.scrollTo = () => { /* nothing */ };
        },
        pretendToBeVisual: false,
        userAgent: 'mocha',
    });

    // Configure global variables which like to be used in testing
    globalNode.window = window;
    globalNode.document = window.document;
    globalNode.navigator = window.navigator;
}

import * as enzyme from 'enzyme';
import enzymeAdapterReact16 from 'enzyme-adapter-react-16';
enzyme.configure({ adapter: new enzymeAdapterReact16() });
