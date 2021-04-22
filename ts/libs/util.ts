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
    this.changeTowns();
    this.btnBbcodeImg();
    this.openModalAction();
    this.openModalMsg();
    this.moveRow();
    this.showDetailOrder();
  }

  moveRow() {
    $('.move-up,.move-down,.move-top,.move-bottom').on('click', (event) => {
      const $el = $(event.currentTarget);
      const row = $el.parents('tr:first');
      if ($el.is('.move-up')) {
        row.insertBefore(<any>(row.prev()));
      } else if ($el.is('.move-down')) {
        row.insertAfter(<any>(row.next()));
      } else if ($el.is('.move-top')) {
        // row.insertAfter($("table tr:first"));
        row.insertBefore($('table tr:first'));
      } else {
        row.insertAfter($('table tr:last'));
      }
    });
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

  changeTowns() {
    $('.department').on('change', (event) => {
      const $el = $(event.currentTarget);
      this.getApi.g(`towns/${$el.val()}`)
        .done((data: any) => {
          const $target = $($el.data('target'));
          $target.empty(); // remove old options
          $target.append($('<option></option>').attr('value', '').text('--'));
          $.each(data, (_i, town) => {
            $target.append($('<option></option>').attr('value', town.name).text(town.name));
          });
        });
    });
  }

  btnBbcodeImg() {
    $('.btn-bbcode-img').on('click', (event) => {
      const $el = $(event.currentTarget);
      $($el.data('target')).html(`<div>${$el.data('bbcode')}</div><div>${$el.data('linkhtml')}<div>`);
    });
  }

  openModalAction() {
    $('.open-modal-action').on('click', (event) => {
      const $el = $(event.currentTarget);
      const $modal = $('#modalAction');
      const $form = $('#modalActionForm');
      $form.attr('action', $el.data('url'));
      $form.attr('method', $el.data('method'));
      $form.data('page', $el.data('page'));
      $modal.find('.title').html($el.data('title'));
      $modal.find('.btn-action').html($el.data('action'));
      $modal.find('.btn-cancel').html($el.data('cancel'));
      sclib.modalShow('#modalAction');
    });
  }

  openModalMsg() {
    $('.open-modal-msg').on('click', (event) => {
      const $el = $(event.currentTarget);
      const $modal = $('#modalMsg');
      $modal.find('.title').html($el.data('title'));
      $modal.find('.btn--primary').html($el.data('close'));
      $modal.find('.body').html($($el.data('body')).html());
      sclib.modalShow('#modalMsg');
    });
  }

  showDetailOrder() {
    $('.btn-cancel').on('click', () => {
      sclib.modalShow('#cancelOrder');
    });
  }
}
