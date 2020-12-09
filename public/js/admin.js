/**
 * Aunque no lo crea, este script permite usar la funcionalidad de ts que exporta a un solo archivo
 * usarse en una página sin cargar módulos, sin complejidad y con menos líneas
 */
var System = {
    functions: {},
    register: function (name, requires, cb) {
        System.functions[name] = { requires: requires, cb: cb };
    },
    active: function () {
        $.each(System.functions, function (name, fc) {
            var m = fc.cb(function (nameClass, fcClass) {
                fc[nameClass] = fcClass;
            }, { id: name });
            $.each(m.setters, function (i, fcs) {
                fcs(System.functions[fc.requires[i]]);
            });
            m.execute();
        });
    }
};
System.register("libs/edit", [], function (exports_1, context_1) {
    "use strict";
    var Edit;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Edit = /** @class */ (function () {
                function Edit() {
                    this.token = 'pk.eyJ1Ijoic3JkcmFrYSIsImEiOiJja2FlZHBmYXUwMHpoMnJudHJnazZsOWY1In0.tAAoQbjhJKq_DdwpTTimrw';
                    this.toolbarOptions = [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                    ];
                    this.cke();
                    this.mapEdit();
                    this.mapEditPoint();
                    this.mapMarkers();
                    this.addFeature();
                }
                Edit.prototype.cke = function () {
                    var list = $('.cke');
                    if (list.length) {
                        list.each(function (_i, el) {
                            ClassicEditor
                                .create(el)
                                .then(function (editor) {
                                editor.model.document.on('change:data', function () {
                                    $(el).val(editor.getData());
                                });
                            })
                                .catch(function (error) {
                                console.error(error);
                            });
                        });
                    }
                };
                Edit.prototype.mapEdit = function () {
                    var list = $('#map-edit');
                    if (list.length) {
                        var points = ($('#center').val() || ',').split(',');
                        this._mapEdit({ latitude: points[1] || 4.646876, longitude: points[0] || -74.087547 });
                    }
                };
                Edit.prototype._mapEdit = function (coords) {
                    // center of the map
                    var center = [coords.latitude, coords.longitude];
                    var map = L.map('map-edit').setView(center, 13);
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
                    var points = [];
                    try {
                        points = JSON.parse($('#points').val());
                    }
                    catch (error) {
                        points = [];
                    }
                    if (points.length) {
                        var geoJsonData = {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: 'Polygon',
                                        coordinates: [
                                            points.map(function (p) { return [p.lng, p.lat]; }),
                                        ],
                                    },
                                },
                            ],
                        };
                        // const geoJsonButton = document.getElementById('test-geojson');
                        var geoJsonLayer = L.geoJson(null, { pmIgnore: false });
                        geoJsonLayer.addTo(map);
                        geoJsonLayer.addData(geoJsonData);
                        geoJsonLayer.on('pm:edit', function (e) {
                            var points = e.layer._latlngs[0];
                            $('#points').val(JSON.stringify(points));
                        });
                        geoJsonLayer.on('pm:dragend', function (e) {
                            var points = e.layer._latlngs[0];
                            $('#points').val(JSON.stringify(points));
                        });
                        geoJsonLayer.on('pm:remove', function () {
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
                    map.on('pm:drawstart', function () {
                        var layers = map.pm.getGeomanDrawLayers();
                        $.each(layers, function (_i, layer) {
                            layer.remove();
                        });
                    });
                    map.on('pm:create', function (e) {
                        var points = e.layer._latlngs[0];
                        $('#points').val(JSON.stringify(points));
                        e.layer.on('pm:ediit', function (e) {
                            var points = e.layer._latlngs[0];
                            $('#points').val(JSON.stringify(points));
                        });
                        e.layer.on('pm:dragend', function (e) {
                            var points = e.layer._latlngs[0];
                            $('#points').val(JSON.stringify(points));
                        });
                        e.layer.on('pm:remove', function () {
                            $('#points').val('[]');
                        });
                    });
                };
                Edit.prototype.mapEditPoint = function () {
                    var list = $('#map-edit-point');
                    if (list.length) {
                        var point = $('#point').val().split(',');
                        this._mapEditPoint({ latitude: point[1] || 4.646876, longitude: point[0] || -74.087547 });
                    }
                };
                Edit.prototype._mapEditPoint = function (coords) {
                    var map = L.map('map-edit-point').setView([coords.latitude, coords.longitude], 13);
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
                    var marker = L.marker([coords.latitude, coords.longitude], {
                        draggable: true,
                    }).addTo(map);
                    marker.on('dragend', function () {
                        $('#point').val(marker.getLatLng().lng + "," + marker.getLatLng().lat);
                    });
                    function onLocationFound(e) {
                        $('#point').val(marker.getLatLng().lng + "," + marker.getLatLng().lat);
                        marker.setLatLng(e.latlng)
                            .bindPopup('Mueva el marcador si es necesario').openPopup();
                    }
                    map.on('locationfound', onLocationFound);
                };
                Edit.prototype.mapMarkers = function () {
                    var list = $('#map-markers');
                    if (list.length) {
                        try {
                            var markers = JSON.parse($('#markers').val());
                            this._mapMarkers(markers);
                        }
                        catch (error) {
                            this._mapMarkers([]);
                        }
                    }
                };
                Edit.prototype._mapMarkers = function (coords) {
                    var center = ($('#center').val() || ',').split(',');
                    var map = L.map('map-markers').setView([center[1] || 4.646876, center[0] || -74.087547], 11);
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
                    coords.forEach(function (i) {
                        L.marker([i[1], i[0]]).addTo(map);
                    });
                };
                Edit.prototype.addFeature = function () {
                    var list = $('.list-features');
                    if (list.length) {
                        list.each(function (_i, el) {
                            var $el = $(el);
                            var fl = $el.data('features');
                            var fc = function () {
                                var html = '';
                                fl.forEach(function (e, i) {
                                    html += '<div class="form-group flex">';
                                    html += '<div class="form-control">';
                                    html += "<input type=\"text\" id=\"i_" + i + "\" class=\"input\" placeholder=\" \" name=\"features[" + i + "][name]\" value=\"" + e.name + "\" data-index=\"" + i + "\" data-name=\"name\">";
                                    html += "<label for=\"i_" + i + "\">Nombre</label>";
                                    html += '</div>';
                                    html += '<div class="form-control pl-1">';
                                    html += "<input type=\"text\" id=\"v_" + i + "\" class=\"input\" placeholder=\" \" name=\"features[" + i + "][value]\" value=\"" + e.value + "\" data-index=\"" + i + "\" data-name=\"value\">";
                                    html += "<label for=\"v_" + i + "\">Valor</label>";
                                    html += '</div>';
                                    html += '</div>';
                                });
                                $el.html(html);
                                $el.find('input').each(function (_i, el) {
                                    var $el = $(el);
                                    $el.on('input', function () {
                                        fl[$el.data('index')][$el.data('name')] = $el.val();
                                    });
                                });
                            };
                            fc();
                            $($el.data('btn')).on('click', function () {
                                fl.push({ name: '', value: '', slug: '' });
                                fc();
                            });
                        });
                    }
                };
                return Edit;
            }());
            exports_1("Edit", Edit);
        }
    };
});
System.register("libs/util", [], function (exports_2, context_2) {
    "use strict";
    var Util;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            /* eslint-disable class-methods-use-this */
            Util = /** @class */ (function () {
                function Util() {
                    this.count();
                }
                Util.prototype.count = function () {
                    var _this = this;
                    $('[data-count]').each(function (_i, el) {
                        var $el = $(el);
                        _this._color($el);
                        $el.on('input', function () { _this._color($el); });
                    });
                };
                Util.prototype._color = function ($el) {
                    var l = $el.val().length;
                    var $t = $($el.data('target'));
                    if (l > parseInt($el.data('count'), 10)) {
                        $t.parent().addClass('t-error');
                    }
                    else {
                        $t.parent().removeClass('t-error');
                    }
                    $t.html("" + l);
                };
                return Util;
            }());
            exports_2("Util", Util);
        }
    };
});
System.register("admin", ["./libs/define", "libs/edit", "libs/util"], function (exports_3, context_3) {
    "use strict";
    var edit_1, util_1;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (_1) {
            },
            function (edit_1_1) {
                edit_1 = edit_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            }
        ],
        execute: function () {
            new edit_1.Edit();
            new util_1.Util();
        }
    };
});
System.active();
