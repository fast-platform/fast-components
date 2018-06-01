/* global describe, it, before */

import chai from 'chai';
import FastComponents from '../lib/fast-components.js';

chai.expect();

const expect = chai.expect;

let component;

describe('Given an instance of a ChartComponent', () => {
  before(() => {
    lib = new FastComponents.components['chart'];
  });
  describe('when I need the name', () => {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('ChartComponent');
    });
  });
});
