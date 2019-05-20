import { expect } from 'chai';
import 'mocha';
import { GlobalServiceContainer, ServiceContainer } from './ServiceContainer';

class MockService {
    public myValue: string;

    constructor(initialValue: string = '') {
        this.myValue = initialValue;
    }

    public setMyValue(value: string) {
        this.myValue = value;
    }
}

const getMockService = () => GlobalServiceContainer.get('mock');
const getMockWithArgsService = () => GlobalServiceContainer.get('mockWithArgs');
const deleteMockService = () => {
    if (GlobalServiceContainer.has('mock')) {
        expect(GlobalServiceContainer.unset('mock')).to.be.undefined;
        expect(getMockService).to.throw();
    }

    if (GlobalServiceContainer.has('mockWithArgs')) {
        expect(GlobalServiceContainer.unset('mockWithArgs')).to.be.undefined;
        expect(getMockWithArgsService).to.throw();
    }
};

describe('GlobalServiceContainer', () => {
    it('Should initialize', () => {
        expect(GlobalServiceContainer).to.be.instanceOf(ServiceContainer);
    });

    it('Should add and get a service', () => {
        expect(GlobalServiceContainer.set('mock', MockService)).to.be.undefined;
        expect(GlobalServiceContainer.get('mock')).to.be.instanceOf(MockService);
    });

    it('Should hold the services globally', () => {
        expect(getMockService()).to.be.instanceOf(MockService);
    });

    it('Should delete a service', () => {
        expect(GlobalServiceContainer.unset('mock')).to.be.undefined;
        expect(getMockService).to.throw();
    });

    it('Should check if a service is set', () => {
        expect(GlobalServiceContainer.has('mock')).to.be.false;
        expect(GlobalServiceContainer.set('mock', MockService)).to.be.undefined;
        expect(GlobalServiceContainer.has('mock')).to.be.true;
    });

    it('Should keep the data of a service in a singleton', () => {
        const myMockService = GlobalServiceContainer.get('mock');
        expect(myMockService.myValue).to.equal('');

        myMockService.setMyValue('test');
        expect(myMockService.myValue).to.equal('test');

        const myMockService2 = GlobalServiceContainer.get('mock');
        expect(myMockService2.myValue).to.equal('test');
    });

    it('Should not keep the data of a service in a factory', () => {
        deleteMockService();

        expect(GlobalServiceContainer.set('mock', MockService, 'factory')).to.be.undefined;

        const myMockService = GlobalServiceContainer.get('mock');
        expect(myMockService.myValue).to.equal('');

        myMockService.setMyValue('test');
        expect(myMockService.myValue).to.equal('test');

        const myMockService2 = GlobalServiceContainer.get('mock');
        expect(myMockService2.myValue).to.equal('');
    });

    it('Should construct singletons with arguments', () => {
        deleteMockService();

        expect(GlobalServiceContainer.set('mock', MockService)).to.be.undefined;
        expect(GlobalServiceContainer.set('mockWithArgs', MockService, 'singleton', 'myValue')).to.be.undefined;

        const myMockService = GlobalServiceContainer.get('mock');
        expect(myMockService.myValue).to.equal('');

        const myMockService2 = GlobalServiceContainer.get('mockWithArgs');
        expect(myMockService2.myValue).to.equal('myValue');
    });

    it('Should construct factories with arguments', () => {
        deleteMockService();

        expect(GlobalServiceContainer.set('mock', MockService, 'factory')).to.be.undefined;
        expect(GlobalServiceContainer.set('mockWithArgs', MockService, 'factory')).to.be.undefined;

        const myMockService = GlobalServiceContainer.get('mock');
        expect(myMockService.myValue).to.equal('');

        const myMockService2 = GlobalServiceContainer.get('mockWithArgs', 'myValue');
        expect(myMockService2.myValue).to.equal('myValue');
    });
});
