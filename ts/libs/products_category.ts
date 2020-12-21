import { Gtag } from './gtag';
import { Cart } from './cart';

export class ProductCategory {
  gtag = new Gtag()

  cart = new Cart()

  constructor() {
    this.placeProduct();
  }

  static originalImage() {
    $('.click-original').on('click', (event) => {
      sclib.modalShow('#modal-image');
      $('#modal-image').find('.original').attr({
        src: $(event.currentTarget).data('original'),
        alt: $(event.currentTarget).attr('alt'),
      });
    });
  }

  /**
   * De la lista de productos, agrega lógica para gtag y controles para agregarr al carro
   */
  placeProduct() {
    $('.place-product').each((_i, el) => {
      const $el = $(el);
      const product = $el.data('product');
      const objValue = $('.box-controls .value');

      // Controles de aumento y disminución
      $('.box-controls .minus').on('click', () => {
        const v = parseInt(objValue.html(), 10);
        if (v > 0) {
          objValue.html(`${v - 1}`);
        }
      });
      $('.box-controls .plus').on('click', () => {
        const v = parseInt(objValue.html(), 10);
        objValue.html(`${v + 1}`);
      });
      $('.quantity .add').on('click', () => {
        this.cart.setQuantity(product, parseInt(objValue.html(), 10), `${product.store}/view_product`);
      });
      this.gtag.viewItem(product, `${product.store}/view_product`);
      // pone la cantidad del producto en el campo
      const items = this.cart.stores[product.store]?.cart || {};
      if (items[product.sku]) {
        $('.box-controls .value').html(`${items[product.sku].quantity}`);
      }
    });
  }
}
