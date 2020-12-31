/* eslint-disable class-methods-use-this */

import { Session } from './session';
import { GetApi } from './get_api';

export class Util {
  session = new Session();

  getApi:GetApi

  constructor() {
    this.session = new Session();
    this.getApi = new GetApi(this.session.token);
    this.count();
    this.lazy();
    this.showDetailOrder();
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

  lazy() {
    const webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    (<any>$('.lazy')).Lazy({
      beforeLoad(element: any) {
        if (webp) {
          element.attr('data-src', element.data('src').replace('.jpg', '.webp'));
          if (element.data('retina')) {
            element.attr('data-retina', element.data('retina').replace('.jpg', '.webp'));
          }
        }
      },
    });
  }

  showDetailOrder() {
    $('.btn-next-status').on('click', () => {
      sclib.modalShow('#modalNextStatus');
    });
    $('.btn-cancel').on('click', () => {
      sclib.modalShow('#cancelOrder');
    });
  }
}
