import '../util/products.d';

declare global {
  // eslint-disable-next-line camelcase
  interface Window { dataLayer: any; google_tag_manager: any}
}
window.dataLayer = window.dataLayer || [];
export class Gtag {
  window=window;

  event(obj: any) {
    if (window.google_tag_manager) {
      this.window.dataLayer.push(obj);
    } else if (obj?.eventCallback) {
      console.log('e gtag');
      obj.eventCallback();
    }
  }

  removeItem(product:ProducInterface, quantity:number, list:string) {
    const l:Array<GProductInterface> = [];
    l.push({ // Provide product details in an impressionFieldObject.
      id: product.sku, // Product ID (string).
      name: product.name, // Product name (string).
      category: product.categoryText.join('/'), // Product category (string).
      brand: product.brandText, // Product brand (string).
      list_name: list, // Product list (string).
      position: 1, // Product position (number).
      price: product.price,
      quantity,
      store: product.store,
    });

    this.event({
      event: 'removeFromCart',
      ecommerce: {
        currencyCode: 'COP',
        remove: {
          actionField: { list },
          products: l,
        },
      },
    });
  }

  addItem(product:ProducInterface, quantity:number, list:string) {
    const l:Array<GProductInterface> = [];
    l.push({ // Provide product details in an impressionFieldObject.
      id: product.sku, // Product ID (string).
      name: product.name, // Product name (string).
      category: product.categoryText.join('/'), // Product category (string).
      brand: product.brandText, // Product brand (string).
      list_name: list, // Product list (string).
      position: 1, // Product position (number).
      price: product.price,
      quantity,
      store: product.store,
    });

    this.event({
      event: 'addToCart',
      ecommerce: {
        currencyCode: 'COP',
        add: {
          actionField: { list },
          products: l,
        },
      },
    });
  }

  /**
   * Evento para saber cuando se muestra un producto
   * @param products
   * @param list
   */

  list(products:[ProducInterface], list:string) {
    const l:Array<GProductInterface> = [];
    $.each(products, (i, product) => {
      l.push({ // Provide product details in an impressionFieldObject.
        id: product.sku, // Product ID (string).
        name: product.name, // Product name (string).
        category: product.categoryText.join('/'), // Product category (string).
        brand: product.brandText, // Product brand (string).
        list_name: list, // Product list (string).
        position: i, // Product position (number).
        price: product.price,
        store: product.store,
      });
    });

    this.event({
      ecommerce: {
        currencyCode: 'COP',
        impressions: l,
      },
    });
  }

  /**
   * Evento para saber cuando alguien le hace click a un producto
   * @param obj
   * @param product
   * @param i
   * @param list
   */
  clickItem(obj:any, product:ProducInterface, i:number | string | symbol, list:string) {
    const l:Array<GProductInterface> = [];
    l.push({ // Provide product details in an impressionFieldObject.
      id: product.sku, // Product ID (string).
      name: product.name, // Product name (string).
      category: product.categoryText.join('/'), // Product category (string).
      brand: product.brandText, // Product brand (string).
      list_name: list, // Product list (string).
      position: <number>i, // Product position (number).
      price: product.price,
      store: product.store,
    });

    this.event({
      event: 'productClick',
      ecommerce: {
        currencyCode: 'COP',
        click: {
          actionField: { list },
          products: l,
        },
      },
      eventCallback() {
        document.location.href = <string>$(obj).attr('href');
      },
    });
    return false;
  }

  viewItem(product:ProducInterface, list:string) {
    const l:Array<GProductInterface> = [];
    l.push({ // Provide product details in an impressionFieldObject.
      id: product.sku, // Product ID (string).
      name: product.name, // Product name (string).
      category: product.categoryText.join('/'), // Product category (string).
      brand: product.brandText, // Product brand (string).
      list_name: list, // Product list (string).
      position: 1, // Product position (number).
      price: product.price,
      store: product.store,
    });

    this.event({
      ecommerce: {
        currencyCode: 'COP',
        detail: {
          actionField: { list },
          products: l,
        },
      },
    });
  }

  cart1(obj:any, products:Array<ProducInterface>) {
    const l:Array<GProductInterface> = [];
    $.each(products, (_i, product) => {
      l.push({ // Provide product details in an impressionFieldObject.
        id: product.sku, // Product ID (string).
        name: product.name, // Product name (string).
        category: product.categoryText.join('/'), // Product category (string).
        brand: product.brandText, // Product brand (string).
        list_name: 'cart1', // Product list (string).
        position: 1, // Product position (number).
        price: product.price,
        store: product.store,
      });
    });

    this.event({
      event: 'checkout',
      ecommerce: {
        currencyCode: 'COP',
        checkout: {
          actionField: {
            step: 1,
          },
          products: l,
        },
      },
      eventCallback() {
        document.location.href = <string>$(obj).attr('href');
      },
    });
    return false;
  }

  cart2(obj:any, typePayment: string) {
    this.event({
      event: 'checkoutOption',
      ecommerce: {
        currencyCode: 'COP',
        checkout_option: {
          actionField: {
            step: 2,
            option: typePayment,
          },
        },
      },
      eventCallback() {
        document.location.href = <string>$(obj).attr('href');
      },
    });
  }

  cart3(order:any, products:Array<ProducInterface>) {
    const l:Array<GProductInterface> = [];
    $.each(products, (_i, product) => {
      l.push({ // Provide product details in an impressionFieldObject.
        id: product.sku, // Product ID (string).
        name: product.name, // Product name (string).
        category: product.categoryText.join('/'), // Product category (string).
        brand: product.brandText, // Product brand (string).
        list_name: 'cart1', // Product list (string).
        position: 1, // Product position (number).
        price: product.price,
        store: product.store,
      });
    });

    this.event({
      event: 'purchase',
      ecommerce: {
        currencyCode: 'COP',
        purchase: {
          actionField: {
            id: order.orderID, // Transaction ID. Required for purchases and refunds.
            affiliation: order.store.name,
            revenue: order.order.subtotal, // Total transaction value (incl. tax and shipping)
            tax: 0,
            shipping: order.order.shipping,
          },
          products: l,
        },
      },
    });
    return false;
  }

  search(searchTerm: string) {
    this.event({
      event: 'search',
      search_term: searchTerm,
    });
  }
}
