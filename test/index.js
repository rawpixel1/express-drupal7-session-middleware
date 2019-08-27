import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createDrupalToken } from '../src/utils';

describe('CSRF Token', () => {
  it('create a valid Drupal token', () => {
    expect(createDrupalToken('PHC0SZ6jHa_fOrBa55M8y4C3-gK29GHIG8gKVU1lU4s', 'sdfweger34tgq34', 'j09bh0jh45jh45-jg', 'service')).to.eql('G5EzHQeNfBfsCXvqji6uqytHT5g58Ya_Z98drJKjoMk');
  });
});
