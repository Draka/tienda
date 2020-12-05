import { Vars } from './vars';
import { Gtag } from './gtag';
import { Cart } from './cart';

export class Product {
  static img(product: ProducInterface, size = ['196x196', '392x392']) {
    if (product?.imagesSizes && product.imagesSizes.length) {
      const first = product.imagesSizes[0];
      let img1 = first[size[0]];
      let img2 = first[size[1]];
      if (!img1 && (size[0] === '48x48' || size[0] === '96x96')) {
        img1 = first['75x75'];
        img2 = first['150x150'];
      }
      return `<img class="w-100 lazy" data-src="${img1}" data-retina="${img2}" alt="${product.name}">`;
    }
    return `<img class="w-100 lazy" data-src="${Vars.imgNoAvailable}" alt="${product.name}">`;
  }

  static imgNow(product: ProducInterface, size = ['196x196', '392x392']) {
    const classSize = size[0].split('x')[0];
    if (product?.imagesSizes && product.imagesSizes.length) {
      const first = product.imagesSizes[0];
      return `<img class="h-img-${classSize}" src="${first[size[1]]}" alt="${product.name}">`;
    }
    return `<img class="h-img-${classSize}" src="${Vars.imgNoAvailable}" alt="${product.name}">`;
  }

  static single(product: ProducInterface, pos: number | string | symbol, list: string) {
    const gtag = new Gtag();
    let msg = '';
    if (product.inventory) {
      if (product.stock === 0) {
        msg = 'Agotado';
      } else if (product.stock && product.stock < 10) {
        msg = 'En stock, Pocas unidades';
      } else {
        msg = 'En stock';
      }
    } else {
      msg = 'En stock';
    }

    const productHTML = $('<div class="w-230p w-170p-xs w-170p-sm br-1 white h-100">');

    productHTML.html(`${`<div class="h-100 relative p-3 pb-7 product" data-sku="${product.sku}">`
    + `<a href="/${Vars.store}/productos/${product.sku}">${Product.img(product)}</a>`}${
      product.brandText ? `<div class="t-white-700 small mb-1">${product.brandText}</div>` : ''
    }<div class="t-primary tc b small">${product.name}</div>`
    + `<div class="t-secondary b big">${Vars.formatMoney(product.price)}</div>`
    + `<div class="t-action small mb-4">${msg}</div>`
    + '<div class="absolute w-100c2 ab-1">'
    + '<button class="secondary w-100 add"><i class="fas fa-cart-plus"></i> Agregar</button>'
    + '</div>'
    + '</div>'
    + '</div>');
    productHTML.find('.add').click((event) => {
      const cart = new Cart();
      cart.add(product.sku, list);
    });
    productHTML.find('a').click((event) => gtag.clickItem($(event.currentTarget), product, pos, list));
    return productHTML;
  }
}
