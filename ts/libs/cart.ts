/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */

import { Vars } from './vars';
import { GetApi } from './get_api';
import { Gtag } from './gtag';
import { CartCount } from './cart_count';
import { ShowMsg } from './show_msg';
import { Product } from './product';
import { CartList } from './cart_list';

declare const L: any;
export class Cart {
  stores!: StoresInterface;

  getApi: GetApi = new GetApi();

  cartCount: CartCount = new CartCount();

  gtag = new Gtag()

  cartID = ''

  constructor() {
    this.getCart();
  }

  static reset() {
    localStorage.removeItem('stores');
    Cart.updateUUID();
  }

  private getCart() {
    try {
      this.stores = JSON.parse(<string>localStorage.getItem('stores')) || {};
    } catch (error) {
      this.stores = {};
    }
  }

  /**
   * Pone los valores del carrito en el localstorage
   */
  set() {
    localStorage.setItem('stores', JSON.stringify(this.stores));
    this.cartCount.count();
  }

  /**
   * Trae el producto de la tienda o lo crea con 0
   * @param store
   * @param sku
   * @param cb
   */
  get(store: string, sku: string, cb: any) {
    if (!this.stores[store]) {
      this.stores[store] = { cart: {}, name: '' };
    }
    const item = this.stores[store].cart[sku];
    // no esta, se trae los datos
    if (!item?.sku) {
      let url = '';
      if (Vars.place) {
        url = `products/${sku}?place=${Vars.place}`;
      } else {
        url = `products/${sku}`;
      }
      this.getApi.gs(url, store)
        .done((data: any) => {
          const product: ProducInterface = {
            store,
            sku,
            name: data.name,
            categoryText: data.categoryText,
            brandText: data.brandText,
            price: data.price,
            quantity: 0,
            imagesSizes: data.imagesSizes,
          };
          this.stores[store].cart[sku] = product;
          this.stores[store].name = data.storeName;
          this.set();
          cb(product);
        });
    } else { cb(item); }
  }

  /**
   * Genera el html parra mostrar una imagen de un producto
   * @param product
   */
  static lineImg(product: ProducInterface):string {
    return `<div class="flex mt-1"><div class="mr-1">${Product.imgNow(product, ['48x48', '96x96'])}</div><div>${product.name}</div></div>`;
  }

  static updateUUID() {
    localStorage.setItem('cartID', Cart.uuidv4());
  }

  static uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Asigna un cartID
   */
  getCartID(): string {
    this.cartID = <string>localStorage.getItem('cartID');
    if (!this.cartID) {
      this.cartID = Cart.uuidv4();
      localStorage.setItem('cartID', this.cartID);
    }
    return this.cartID;
  }

  /**
   * Asigna al carro de una tienda una cantidad a un producto
   * @param productPre
   * @param quantity
   * @param list
   */
  setQuantity(productPre: ProducPreInterface, quantity: number, list: string) {
    this.getCartID();
    this.get(productPre.store, productPre.sku, (product: ProducInterface) => {
      if (product) {
        const msg = Cart.lineImg(product);
        if (quantity === 0) {
          product.quantity = quantity;
          this.gtag.removeItem(product, quantity, list);
          ShowMsg.show([
            {
              code: 0,
              title: 'Producto eliminado',
              msg,
            },
          ], 'info');
          delete this.stores[product.store]?.cart[product.sku];
        } else if (product.quantity < quantity) {
          this.gtag.addItem(product, quantity - product.quantity, list);
          product.quantity = quantity;
          ShowMsg.show([
            {
              code: 0,
              title: 'Producto agregado',
              msg,
            },
          ], 'info');
        } else if (product.quantity > quantity) {
          this.gtag.removeItem(product, product.quantity - quantity, list);
          product.quantity = quantity;
          ShowMsg.show([
            {
              code: 0,
              title: 'Producto modificado',
              msg,
            },
          ], 'info');
        } else {
          return;
        }
        this.set();
        this.subtotal();
        const cartList = new CartList();
        cartList.showCart();
      }
    });
  }

  getProduct(store: string, sku: string) {
    return this.stores[store]?.cart[sku];
  }

  /**
   * Suma el valor de los productos
   */
  subtotal() {
    let subtotal = 0;
    $.each(this.stores, (_slug, store) => {
      $.each(store.cart, (_sku, product) => {
        subtotal += product.quantity * product.price;
      });
    });
    $('.cart-subtotal').html(`${Vars.formatMoney(subtotal)}`);
  }

  /**
   * Agrega 1 unidad a el producto de una tienda
   * @param product
   * @param list
   */
  add(sku: string, list: string, store: string) {
    const product = this.stores[store]?.cart[sku];
    this.setQuantity({ store, sku }, (product?.quantity || 0) + 1, list);
  }

  minus(sku: string, list: string, store = Vars.store) {
    const product = this.stores[store].cart[sku];
    if (product && product.quantity > 0) {
      this.setQuantity(product, product.quantity - 1, list);
    }
  }

  remove(sku: string, list: string, store: string) {
    const product = this.stores[store].cart[sku];
    if (product) {
      this.setQuantity(product, 0, list);
    }
  }

  static getAddressJSON() {
    try {
      return JSON.parse(localStorage.getItem('address') || '{}');
    } catch (error) {
      localStorage.removeItem('address');
      return {};
    }
  }

  static setAddressJSON(address: any) {
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address);
      } catch (error) {
        address = '';
      }
    }
    localStorage.setItem('address', JSON.stringify(address));
    return address;
  }

  static prepareFormAddress() {
    // llena datos de la direccion
    const address = Cart.getAddressJSON();
    if (address.form) {
      $.each(address.form, (_i, v) => {
        $(`[name="${v.name}"]`).val(v.value);
      });
    }
    if (address.address) {
      $('.user-address').html(address.address);
      $('.data-address .address').html(address.address.split(',')[0]);
    } else {
      $('.user-address').html('<div class="msg error">Proporcione una dirección para continuar</div>');
    }

    $('#addressForm').data('post', Cart.checkAddress);
    $('#mapForm .back').on('click', () => {
      $('#addressForm').show();
      $('#mapForm').hide();
    });
    $('#mapForm').data('post', () => {
      const address = Cart.setAddressJSON($('#addressJSON').val());
      sclib.modalHide('#address');
      $('.user-address').html(address.address);
      const cartList = new CartList();
      cartList.showStepAddress();
    });
  }

  static checkAddress(data: any) {
    $('#map-container').html('<div id="map" class="w-100 h-460p"></div>');
    const address = {
      city: $('#addressForm input[name="city"]').val(),
      address: data.address,
      location: data.location,
      extra: $('#extra').val(),
      form: $('#addressForm').serializeArray(),
    };

    $('#addressJSON').val(JSON.stringify(address));
    // this.setAddressJSON(address);

    $('#addressForm').hide();
    $('#mapForm').show();

    const coords = [data.location.lat || 4.646876, data.location.lng || -74.087547];
    const map = L.map('map').setView(coords, 16);
    L.control.locate({
      initialZoomLevel: 16,
      locateOptions: {
        enableHighAccuracy: true,
        maxZoom: 16,
      },
      strings: {
        title: 'Localizar mi posición',
      },
    }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker(coords, {
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      address.location = marker.getLatLng();
      $('#addressJSON').val(JSON.stringify(address));
    });

    function onLocationFound(e) {
      address.location = e.latlng;
      $('#addressJSON').val(JSON.stringify(address));
      marker.setLatLng(e.latlng)
        .bindPopup('Mueva el marcador si es necesario').openPopup();
    }

    map.on('locationfound', onLocationFound);
  }
}
