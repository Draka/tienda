/* eslint-disable class-methods-use-this */
/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
declare const L: any;
declare const ClassicEditor: any;

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
          .create(el, {

            toolbar: {
              items: [
                'heading',
                '|',
                'fontColor',
                'bold',
                'italic',
                'strikethrough',
                'link',
                'bulletedList',
                'numberedList',
                '|',
                'indent',
                'outdent',
                '|',
                'imageInsert',
                'blockQuote',
                'insertTable',
                'horizontalLine',
                'undo',
                'redo',
              ],
            },
            language: 'es',
            image: {
              toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side',
                'linkImage',
              ],
            },
            table: {
              contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties',
              ],
            },
            licenseKey: '',
          })
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
      const points = (<string>$('#center').val() || ',').split(',');
      this._mapEdit({ latitude: points[1] || 4.646876, longitude: points[0] || -74.087547 });
    }
  }

  _mapEdit(coords) {
    // center of the map
    const center = [coords.latitude, coords.longitude];
    const map = L.map('map-edit').setView(center, 13);
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

    let points = [];

    try {
      points = JSON.parse(<string>$('#points').val());
    } catch (error) {
      points = [];
    }

    if (points.length) {
      const geoJsonData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                points.map((p) => [p.lng, p.lat]),
              ],
            },
          },
        ],
      };

      // const geoJsonButton = document.getElementById('test-geojson');
      const geoJsonLayer = L.geoJson(null, { pmIgnore: false });
      geoJsonLayer.addTo(map);
      geoJsonLayer.addData(geoJsonData);
      geoJsonLayer.on('pm:edit', (e) => {
        const points = e.layer._latlngs[0];
        $('#points').val(JSON.stringify(points));
      });
      geoJsonLayer.on('pm:dragend', (e) => {
        const points = e.layer._latlngs[0];
        $('#points').val(JSON.stringify(points));
      });
      geoJsonLayer.on('pm:remove', () => {
        $('#points').val('[]');
      });
    }

    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawRectangle: false,
      drawPolyline: false,
      drawCircle: false,
      cutPolygon: false,
    });
    map.on('pm:drawstart', () => {
      const layers = map.pm.getGeomanDrawLayers();
      $.each(layers, (_i, layer) => {
        layer.remove();
      });
    });
    map.on('pm:create', (e) => {
      const points = e.layer._latlngs[0];
      $('#points').val(JSON.stringify(points));
      e.layer.on('pm:ediit', (e) => {
        const points = e.layer._latlngs[0];
        $('#points').val(JSON.stringify(points));
      });
      e.layer.on('pm:dragend', (e) => {
        const points = e.layer._latlngs[0];
        $('#points').val(JSON.stringify(points));
      });

      e.layer.on('pm:remove', () => {
        $('#points').val('[]');
      });
    });
  }

  mapEditPoint() {
    const list = $('#map-edit-point');
    if (list.length) {
      const point = (<string>$('#point').val(), ',').split(',');
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
      $('#point').val(`${marker.getLatLng().lng},${marker.getLatLng().lat}`);
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
