import { expect } from 'chai';
import 'mocha';
import { ServiceContainer } from './ServiceContainer';

class MockService {
    public myValue: string;

    constructor(initialValue: string = '') {
        this.myValue = initialValue;
    }

    public setMyValue(value: string) {
        this.myValue = value;
    }
}

describe('ServiceContainer', () => {
    it('Should initialize', () => {
        expect(new ServiceContainer()).to.be.instanceOf(ServiceContainer);
    });

    it('Should add and get a service', () => {
        const services = new ServiceContainer();

        expect(services.set('mock', MockService)).to.be.undefined;
        expect(services.get('mock')).to.be.instanceOf(MockService);
    });

    it('Should add, get and delete a service', () => {
        const services = new ServiceContainer();
        const getMockService = () => services.get('mock');

        expect(services.set('mock', MockService)).to.be.undefined;
        expect(getMockService()).to.be.instanceOf(MockService);
        expect(services.unset('mock')).to.be.undefined;
        expect(getMockService).to.throw();
    });

    it('Should check if a service is set', () => {
        const services = new ServiceContainer();

        expect(services.has('mock')).to.be.false;
        expect(services.set('mock', MockService)).to.be.undefined;
        expect(services.has('mock')).to.be.true;
    });

    it('Should keep the data of a service in a singleton', () => {
        const services = new ServiceContainer();

        expect(services.set('mock', MockService)).to.be.undefined;

        const myMockService = services.get('mock');
        expect(myMockService.myValue).to.equal('');

        myMockService.setMyValue('test');

        expect(myMockService.myValue).to.equal('test');
        const myMockService2 = services.get('mock');
        expect(myMockService2.myValue).to.equal('test');
    });

    it('Should not keep the data of a service in a factory', () => {
        const services = new ServiceContainer();

        expect(services.set('mock', MockService, 'factory')).to.be.undefined;

        const myMockService = services.get('mock');
        expect(myMockService.myValue).to.equal('');

        myMockService.setMyValue('test');
        expect(myMockService.myValue).to.equal('test');

        const myMockService2 = services.get('mock');
        expect(myMockService2.myValue).to.equal('');
    });

    it('Should construct singletons with arguments', () => {
        const services = new ServiceContainer();

        expect(services.set('mock', MockService)).to.be.undefined;
        expect(services.set('mockWithArgs', MockService, 'singleton', 'myValue')).to.be.undefined;

        const myMockService = services.get('mock');
        expect(myMockService.myValue).to.equal('');

        const myMockService2 = services.get('mockWithArgs');
        expect(myMockService2.myValue).to.equal('myValue');
    });

    it('Should construct factories with arguments', () => {
        const services = new ServiceContainer();

        expect(services.set('mock', MockService, 'factory')).to.be.undefined;
        expect(services.set('mockWithArgs', MockService, 'factory')).to.be.undefined;

        const myMockService = services.get('mock');
        expect(myMockService.myValue).to.equal('');

        const myMockService2 = services.get('mockWithArgs', 'myValue');
        expect(myMockService2.myValue).to.equal('myValue');
    });
});
