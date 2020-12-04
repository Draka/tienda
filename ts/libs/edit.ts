/* eslint-disable class-methods-use-this */
/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
declare const Quill: any;
declare const mapboxgl: any;
declare const MapboxDraw: any;
declare const L: any;
declare const ClassicEditor: any;
declare const CKEDITOR: any;

export class Edit {
  token = 'pk.eyJ1Ijoic3JkcmFrYSIsImEiOiJja2FlZHBmYXUwMHpoMnJudHJnazZsOWY1In0.tAAoQbjhJKq_DdwpTTimrw'

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
  ];

  constructor() {
    this.cke();
    this.mapEdit();
    this.mapEditPoint();
    this.mapMarkers();
    this.addFeature();
  }

  cke() {
    const list = $('.cke');
    if (list.length) {
      list.each((_i, el) => {
        ClassicEditor
          .create(el)
          .then((editor) => {
            editor.model.document.on('change:data', () => {
              $(el).val(editor.getData());
            });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }

  mapEdit() {
    const list = $('#map-edit');
    if (list.length) {
      const points = (<string>$('#center').val()).split(',');
      this._mapEdit({ latitude: points[1] || 4.646876, longitude: points[0] || -74.087547 });
    }
  }

  _mapEdit(coords) {
    const points = $('#points').val() ? JSON.parse(<string>$('#points').val()) : '';
    mapboxgl.accessToken = this.token;
    const map = new mapboxgl.Map({
      container: 'map-edit', // container id
      style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
      center: [coords.longitude, coords.latitude], // starting position
      zoom: 10.5, // starting zoom
    });
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
    );

    map.addControl(draw, 'top-left');
    map.on('load', () => {
      if (points) {
        const gj = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: points,
          },
        };
        draw.add(gj);
      }
    });

    map.on('draw.modechange', (_e) => {
      const data = draw.getAll();
      // puntos
      $('#points').val(JSON.stringify(data.features[0].geometry.coordinates));

      if (draw.getMode() === 'draw_polygon') {
        const pids = [];
        const lid = data.features[data.features.length - 1].id;
        data.features.forEach((f) => {
          if (f.geometry.type === 'Polygon' && f.id !== lid) {
            pids.push(f.id);
          }
        });
        draw.delete(pids);
      }
    });
    map.on('draw.update', (_e) => {
      const data = draw.getAll();
      // puntos
      $('#points').val(JSON.stringify(data.features[0].geometry.coordinates));
    });
  }

  mapEditPoint() {
    const list = $('#map-edit-point');
    if (list.length) {
      const point = (<string>$('#point').val()).split(',');
      this._mapEditPoint({ latitude: point[1] || 4.646876, longitude: point[0] || -74.087547 });
    }
  }

  _mapEditPoint(coords) {
    const map = L.map('map-edit-point').setView([coords.latitude, coords.longitude], 13);
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

    const marker = L.marker([coords.latitude, coords.longitude], {
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      $('#point').val(`${marker.getLatLng().lng},${marker.getLatLng().lat}`);
    });

    function onLocationFound(e) {
      marker.setLatLng(e.latlng)
        .bindPopup('Mueva el marcador si es necesario').openPopup();
    }

    map.on('locationfound', onLocationFound);
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

  addFeature() {
    const list = $('.list-features');
    if (list.length) {
      list.each((_i, el) => {
        const $el = $(el);
        const fl:Array<any> = $el.data('features');

        const fc = () => {
          let html = '';
          fl.forEach((e, i) => {
            html += '<div class="form-group flex">';
            html += '<div class="form-control">';
            html += `<input type="text" id="i_${i}" class="input" placeholder=" " name="features[${i}][name]" value="${e.name}" data-index="${i}" data-name="name">`;
            html += `<label for="i_${i}">Nombre</label>`;
            html += '</div>';
            html += '<div class="form-control pl-1">';
            html += `<input type="text" id="v_${i}" class="input" placeholder=" " name="features[${i}][value]" value="${e.value}" data-index="${i}" data-name="value">`;
            html += `<label for="v_${i}">Valor</label>`;
            html += '</div>';
            html += '</div>';
          });

          $el.html(html);
          $el.find('input').each((_i, el) => {
            const $el = $(el);
            $el.on('input', () => {
              fl[$el.data('index')][$el.data('name')] = $el.val();
            });
          });
        };
        fc();

        $($el.data('btn')).on('click', () => {
          fl.push({ name: '', value: '', slug: '' });
          fc();
        });
      });
    }
  }
}
