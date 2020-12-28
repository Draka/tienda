/* eslint-disable class-methods-use-this */

export class Util {
  constructor() {
    this.count();
  }

  count() {
    $('[data-count]').each((_i, el) => {
      const $el = $(el);
      this._color($el);
      $el.on('input', () => { this._color($el); });
    });
  }

  _color($el) {
    const l = (<string>$el.val()).length;
    const $t = $($el.data('target'));
    if (l > parseInt($el.data('count'), 10)) {
      $t.parent().addClass('t-error');
    } else {
      $t.parent().removeClass('t-error');
    }
    $t.html(`${l}`);
  }
}
