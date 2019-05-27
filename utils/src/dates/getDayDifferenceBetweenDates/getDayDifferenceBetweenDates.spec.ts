/**
 * Created on 17.04.18.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

import { expect } from 'chai';
import 'mocha';
import { getDayDifferenceBetweenDates } from './getDayDifferenceBetweenDates';

describe('getDayDifferenceBetweenDates', () => {
    it('Should throw if the parameters are not of type Date', () => {
        expect(() => getDayDifferenceBetweenDates('foo' as unknown as Date, 'bar' as unknown as Date)).to.throw;
        expect(() => getDayDifferenceBetweenDates('foo' as unknown as Date, new Date())).to.throw;
        expect(() => getDayDifferenceBetweenDates(new Date(), 'bar' as unknown as Date)).to.throw;
        expect(() => getDayDifferenceBetweenDates(new Date(), new Date())).not.to.throw;
    });

    it('Should return 0 when comparing the same dates', () => {
        expect(getDayDifferenceBetweenDates(new Date(), new Date())).to.equal(0);
    });

    it('Should calculate the difference', () => {
        expect(getDayDifferenceBetweenDates(new Date('2019-01-01'), new Date('2019-01-03'))).to.equal(2);
        expect(getDayDifferenceBetweenDates(new Date('2019-01-01'), new Date('2019-02-01'))).to.equal(31);
        expect(getDayDifferenceBetweenDates(new Date('2019-01-01'), new Date('2018-01-01'))).to.equal(365);
    });

    it('Should calculate the negative difference as positive value', () => {
        expect(getDayDifferenceBetweenDates(new Date('2019-01-03'), new Date('2019-01-01'))).to.equal(2);
        expect(getDayDifferenceBetweenDates(new Date('2019-02-01'), new Date('2019-01-01'))).to.equal(31);
        expect(getDayDifferenceBetweenDates(new Date('2018-01-01'), new Date('2019-01-01'))).to.equal(365);
    });

    it('Should round the days', () => {
        expect(getDayDifferenceBetweenDates(new Date('2019-01-01 03:00:00'), new Date('2019-01-01 03:10:00')))
        .to.equal(1);

        expect(getDayDifferenceBetweenDates(new Date('2019-01-01 03:00:00'), new Date('2019-01-01 15:00:00')))
        .to.equal(1);

        expect(getDayDifferenceBetweenDates(new Date('2019-01-01 03:00:00'), new Date('2019-01-01 15:00:01')))
        .to.equal(1);

        expect(getDayDifferenceBetweenDates(new Date('2019-01-01 03:00:00'), new Date('2019-01-01 02:59:59')))
        .to.equal(1);
    });
});
