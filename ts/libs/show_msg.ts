import { Cart } from './cart';

export class ShowMsg {
  // Muestra los errores del back
  static show(errors:any, alert = 'secondary') {
    const timeShow = 5000;
    let em = $('.error-modal');
    if (!em.length) {
      em = $('<div class="error-modal fixed ab-0 w-100 p-1">').hide();
      $('body').append(em);
    }
    em.show();
    if (errors.responseJSON && errors.responseJSON.values) {
      errors = errors.responseJSON.values;
    }

    $.each(errors, (_i, error) => {
      // error de los productos del carro, se pide actualizar
      if (error.code === 1000) {
        // cart.check();
      }
      // id de carro de compras dañado
      if (error.code === 1001) {
        Cart.updateUUID();
      }
      // id de carro de compras procesado
      if (error.code === 1002) {
        Cart.reset();
        setTimeout(() => {
          document.location.href = window.location.origin + window.location.pathname;
        }, timeShow);
      }
      const msg = $(`<div class="msg ${alert} ab-2 fixed p-1 center op-1">`);
      const close = $('<button class="btn-flat p-1 absolute ar-2" data-dismiss="modal" aria-label="Cerrar">')
        .html('<span aria-hidden="true"><i class="fas fa-times"></i></span>')
        .on('click', () => {
          msg.removeClass('op-1');
          setTimeout(() => {
            msg.remove();
            if (em.html() === '') {
              em.hide();
            }
          }, 300);
        });

      msg
        .append(close);
      if (error.title) {
        msg
          .append(`<div class="b">${error.title}</div>`);
      }
      msg
        .append(error.msg);

      em.append(msg);
      setTimeout(() => {
        msg.addClass('op-1');
      }, 1);
      setTimeout(() => {
        close.trigger('click');
      }, timeShow);
    });
  }
}
