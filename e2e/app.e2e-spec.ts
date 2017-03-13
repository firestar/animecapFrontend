import { AnimecapPage } from './app.po';

describe('animecap App', function() {
  let page: AnimecapPage;

  beforeEach(() => {
    page = new AnimecapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
