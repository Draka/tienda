import { Cart } from './cart';
import { Gtag } from './gtag';

declare const L: any;

/* eslint-disable class-methods-use-this */
export class StoreUtil {
  gtag = new Gtag()

  constructor() {
    this.prepareBtns();
    this.mapMarkers();
    this.openModalWhatsapp();
  }

  prepareBtns() {
    $('.product').each((_i, el) => {
      const $el = $(el);
      $el.find('.add').on('click', () => {
        const cart = new Cart();
        const product = $el.data('product');
        cart.add(product.sku, $el.data('list'), product.store);
      });
      $el.find('a').on('click', (event) => this.gtag.clickItem($(event.currentTarget), $el.data('product'), $el.data('pos'), $el.data('list')));
    });
  }

  mapMarkers() {
    const list = $('#map-markers');
    if (list.length) {
      try {
        const markers = JSON.parse(<string>$('#markers').val());
        this._mapMarkers(markers);
      } catch (error) {
        this._mapMarkers([]);
      }
    }
  }

  _mapMarkers(coords) {
    const center = (<string>$('#center').val() || ',').split(',');
    const map = L.map('map-markers').setView([center[1] || 4.646876, center[0] || -74.087547], 11);
    L.control.locate({
      initialZoomLevel: 15,
      locateOptions: {
        enableHighAccuracy: true,
        maxZoom: 15,
      },
      strings: {
        title: 'Localizar mi posición',
      },
    }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    coords.forEach((i) => {
      L.marker([i[1], i[0]]).addTo(map);
    });
  }

  openModalWhatsapp() {
    $('#open-modal-whatsapp').on('click', () => {
      sclib.modalShow('#modal-whatsapp');
    });
  }
}
