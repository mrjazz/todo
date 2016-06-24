import 'should';

import 'datejs';
import moment from 'moment';

import {getDateTypeForItem, ItemDateType} from '../public/js/components/Items/Item.jsx';

describe('date test', function() {

  it('simple datejs test', () => {
    // console.log(Date.parse("tomorrow"));
  });

  it('expired date', () => {
    const d1 = moment().add(-2, 'day');
    const d2 = moment().add(-1, 'day');
    getDateTypeForItem(d1, d2).should.equal(ItemDateType.EXPIRED);
  });

  it('today', () => {
    const d1 = moment().startOf('day');
    const d2 = moment().endOf('day');
    getDateTypeForItem(d1, d2).should.equal(ItemDateType.TODAY);
  });

  it('in progress', () => {
    const d1 = moment().add(-1, 'day');
    const d2 = moment().add(1, 'day');
    getDateTypeForItem(d1, d2).should.equal(ItemDateType.IN_PROGRESS);
  });

});
