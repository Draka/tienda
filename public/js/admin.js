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
    },
};
System.register("libs/edit", [], function (exports_1, context_1) {
    "use strict";
    var Edit;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            window.ckeditors = [];
            Edit = /** @class */ (function () {
                function Edit() {
                    this.itemsAdmin = [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'indent',
                        'outdent',
                        '|',
                        'imageInsert',
                        'insertTable',
                        'mediaEmbed',
                        'blockQuote',
                        '|',
                        'alignment',
                        'fontBackgroundColor',
                        'fontColor',
                        'fontSize',
                        'fontFamily',
                        'horizontalLine',
                        '|',
                        'htmlEmbed',
                        'removeFormat',
                        '|',
                        'code',
                        'codeBlock',
                        '|',
                        'subscript',
                        'superscript',
                        '|',
                        'undo',
                        'redo',
                    ];
                    this.itemsUser = [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'indent',
                        'outdent',
                        '|',
                        'imageInsert',
                        'insertTable',
                        'mediaEmbed',
                        'blockQuote',
                        '|',
                        'alignment',
                        'fontBackgroundColor',
                        'fontColor',
                        'horizontalLine',
                        '|',
                        'removeFormat',
                        '|',
                        'undo',
                        'redo',
                    ];
                    this.heading = {
                        options: [
                            { model: 'paragraph', title: 'Parrafo', class: 'ck-heading_paragraph' },
                            {
                                model: 'heading2', view: 'h2', title: 'Encabezado 2', class: 'ck-heading_heading2',
                            },
                            {
                                model: 'heading3', view: 'h3', title: 'Encabezado 3', class: 'ck-heading_heading3',
                            },
                            {
                                model: 'heading4', view: 'h4', title: 'Encabezado 4', class: 'ck-heading_heading4',
                            },
                            {
                                model: 'title',
                                view: {
                                    name: 'div',
                                    classes: 'title',
                                },
                                title: 'Título',
                            },
                            {
                                model: 'subtitle',
                                view: {
                                    name: 'div',
                                    classes: 'subtitle',
                                },
                                title: 'Subtítulo',
                            },
                            {
                                model: 'big',
                                view: {
                                    name: 'div',
                                    classes: 'big',
                                },
                                title: 'Grande',
                            },
                            {
                                model: 'bigx2',
                                view: {
                                    name: 'div',
                                    classes: 'bigx2',
                                },
                                title: 'Muy Grande',
                            },
                            {
                                model: 'small',
                                view: {
                                    name: 'div',
                                    classes: 'small',
                                },
                                title: 'Pequeño',
                            },
                            {
                                model: 'social',
                                view: {
                                    name: 'div',
                                    classes: 'social',
                                },
                                title: 'Social',
                            },
                            {
                                model: 'remark-error',
                                view: {
                                    name: 'div',
                                    classes: 'remark error',
                                },
                                title: 'Remark - error',
                            },
                            {
                                model: 'remark-info',
                                view: {
                                    name: 'div',
                                    classes: 'remark info',
                                },
                                title: 'Remark - info',
                            },
                            {
                                model: 'remark-action',
                                view: {
                                    name: 'div',
                                    classes: 'remark action',
                                },
                                title: 'Remark - action',
                            },
                            {
                                model: 'remark-primary',
                                view: {
                                    name: 'div',
                                    classes: 'remark primary',
                                },
                                title: 'Remark - primary',
                            },
                            {
                                model: 'remark-secondary',
                                view: {
                                    name: 'div',
                                    classes: 'remark secondary',
                                },
                                title: 'Remark - secondary',
                            },
                            {
                                model: 'msg-error',
                                view: {
                                    name: 'div',
                                    classes: 'msg error',
                                },
                                title: 'Mensaje - error',
                            },
                            {
                                model: 'msg-info',
                                view: {
                                    name: 'div',
                                    classes: 'msg info',
                                },
                                title: 'Mensaje - info',
                            },
                            {
                                model: 'msg-action',
                                view: {
                                    name: 'div',
                                    classes: 'msg action',
                                },
                                title: 'Mensaje - action',
                            },
                            {
                                model: 'msg-primary',
                                view: {
                                    name: 'div',
                                    classes: 'msg primary',
                                },
                                title: 'Mensaje - primary',
                            },
                            {
                                model: 'msg-secondary',
                                view: {
                                    name: 'div',
                                    classes: 'msg secondary',
                                },
                                title: 'Mensaje - secondary',
                            },
                        ],
                    };
                    this.optionsAdmin = {
                        toolbar: {
                            items: this.itemsAdmin,
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
                        heading: this.heading,
                        htmlEmbed: {
                            showPreviews: true,
                        },
                        simpleUpload: {
                            uploadUrl: '/v1/admin/super/multimedia',
                        },
                    };
                    this.optionsUser = {
                        toolbar: {
                            items: this.itemsUser,
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
                        heading: this.heading,
                    };
                    this.cke();
                    this.mapEdit();
                    this.mapEditPoint();
                    this.mapMarkers();
                    this.addFeature();
                    this.addGroups();
                }
                Edit.prototype.cke = function () {
                    var _this = this;
                    var list = $('.cke-admin,.cke-user');
                    if (list.length) {
                        list.each(function (_i, el) {
                            var options = {};
                            if ($(el).hasClass('cke-admin')) {
                                options = _this.optionsAdmin;
                            }
                            else {
                                options = _this.optionsUser;
                            }
                            ClassicEditor
                                .create(el, options)
                                .then(function (editor) {
                                window.ckeditors.push(editor);
                                editor.model.document.on('change:data', function () {
                                    $(el).val(editor.getData());
                                });
                            })
                                .catch(function (error) {
                                // eslint-disable-next-line no-console
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
                        var point = ($('#point').val(), ',').split(',');
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
                Edit.prototype.addGroups = function () {
                    var list = $('.list-groups');
                    if (list.length) {
                        list.each(function (_i, el) {
                            var $el = $(el);
                            var fl = $el.data('groups');
                            var fc = function () {
                                var html = '';
                                fl.forEach(function (e, i) {
                                    html += '<div class="form-group flex">';
                                    html += '<div class="form-control">';
                                    html += "<input type=\"text\" id=\"g_" + i + "\" class=\"input\" placeholder=\" \" name=\"groups[" + i + "][feature]\" value=\"" + e.feature + "\" data-index=\"" + i + "\" data-name=\"feature\">";
                                    html += "<label for=\"g_" + i + "\">Caracter\u00EDstica</label>";
                                    html += '</div>';
                                    html += '<div class="form-control pl-1 w-100">';
                                    html += "<input type=\"text\" id=\"s_" + i + "\" class=\"input\" placeholder=\" \" name=\"groups[" + i + "][sku]\" value=\"" + e.sku + "\" data-index=\"" + i + "\" data-name=\"sku\">";
                                    html += "<label for=\"s_" + i + "\">SKU's</label>";
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
                                fl.push({ sku: '', feature: '' });
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
System.register("libs/session", [], function (exports_2, context_2) {
    "use strict";
    var Session;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            Session = /** @class */ (function () {
                function Session() {
                }
                Session.checkWebpFeature = function (feature, callback) {
                    var kTestImages = {
                        lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
                        lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
                        alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
                        animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
                    };
                    var img = new Image();
                    img.onload = function () {
                        var result = (img.width > 0) && (img.height > 0);
                        callback(feature, result);
                    };
                    img.onerror = function () {
                        callback(feature, false);
                    };
                    img.src = "data:image/webp;base64," + kTestImages[feature];
                };
                return Session;
            }());
            exports_2("Session", Session);
        }
    };
});
System.register("libs/vars", ["../util/products.d"], function (exports_3, context_3) {
    "use strict";
    var Vars;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (_1) {
            }
        ],
        execute: function () {
            Vars = /** @class */ (function () {
                function Vars() {
                }
                Vars.badge = function (input) {
                    var status = {
                        created: 'Creado',
                        paid: 'Pagado',
                        cancelled: 'Cancelado',
                        cancelledAdmin: 'Cancelado',
                        picking: 'Buscando Productos',
                        ready: 'Listo Para Envíar',
                        onway: 'En Camino',
                        arrived: 'Llegó',
                        missing: 'No Respondieron',
                        completed: 'Completado',
                    };
                    var color = {
                        created: 'primary',
                        paid: 'alert',
                        cancelled: 'error',
                        cancelledAdmin: 'error',
                        picking: 'alert',
                        ready: 'info',
                        onway: 'info',
                        arrived: 'info',
                        missing: 'error',
                        completed: 'action',
                    };
                    return "<span class=\"badge " + color[input] + " inline\">" + status[input] + "</span>";
                };
                Vars.payment = function (orderID) {
                    return "<button class=\"primary small id_" + orderID + " w-100\">Pagar</button>";
                };
                Vars.statusToDate = function (arr, status) {
                    var st = arr.filter(function (s) { return s.status === status; });
                    if (!st.length) {
                        return '';
                    }
                    return Vars.format(st[0].date);
                };
                Vars.format = function (str) {
                    if (!str)
                        return '';
                    var days = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                    var d = new Date();
                    d.setTime(Date.parse(str));
                    return d.getDate() + " de " + days[d.getMonth()] + " de " + d.getFullYear();
                };
                Vars.formatMoney = function (number, decPlaces, simbol, decSep, thouSep) {
                    if (decPlaces === void 0) { decPlaces = 0; }
                    if (simbol === void 0) { simbol = '$'; }
                    if (decSep === void 0) { decSep = ','; }
                    if (thouSep === void 0) { thouSep = '.'; }
                    var re = "\\d(?=(\\d{" + 3 + "})+" + (decPlaces > 0 ? '\\D' : '$') + ")";
                    // eslint-disable-next-line no-bitwise
                    var num = number.toFixed(Math.max(0, ~~decPlaces));
                    return simbol + num.replace('.', thouSep).replace(new RegExp(re, 'g'), "$&" + decSep);
                };
                Vars.getParameterByName = function (name, url) {
                    if (url === void 0) { url = window.location.href; }
                    name = name.replace(/[[\]]/g, '\\$&');
                    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
                    var results = regex.exec(url);
                    if (!results)
                        return null;
                    if (!results[2])
                        return '';
                    return decodeURIComponent(results[2].replace(/\+/g, ' '));
                };
                Vars.capitalize = function (input) {
                    return input[0].toUpperCase() + input.slice(1);
                };
                Vars.b = $('body');
                Vars.urlSite = Vars.b.data('urlSite');
                Vars.urlApi = Vars.b.data('urlApi');
                Vars.urlS3 = Vars.b.data('urlS3');
                Vars.urlS3Images = Vars.b.data('urlS3Images');
                Vars.imgNoAvailable = '/images/imagen_no_disponible.svg';
                Vars.store = Vars.b.data('store');
                Vars.place = Vars.b.data('defaultPlace');
                Vars.webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
                return Vars;
            }());
            exports_3("Vars", Vars);
        }
    };
});
System.register("libs/get_api", ["../util/sclib.d", "libs/vars"], function (exports_4, context_4) {
    "use strict";
    var vars_1, GetApi;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (_2) {
            },
            function (vars_1_1) {
                vars_1 = vars_1_1;
            }
        ],
        execute: function () {
            GetApi = /** @class */ (function () {
                function GetApi() {
                    this.h = {};
                }
                /**
                 * GET: api la ruta de la tienda
                 * @param path ruta del api
                 * @param store Opcional, tienda activa
                 */
                GetApi.prototype.gs = function (path, store) {
                    if (store === void 0) { store = vars_1.Vars.store; }
                    return this.g("stores/" + store + "/" + path);
                };
                GetApi.prototype.g = function (path) {
                    return sclib.ajax({
                        url: vars_1.Vars.urlApi + path,
                        type: 'GET',
                        headers: this.h,
                    });
                };
                /**
                 * POST: api la ruta de la tienda
                 * @param path ruta del api
                 * @param data Opcional, data
                 */
                GetApi.prototype.ps = function (path, data) {
                    if (data === void 0) { data = {}; }
                    return this.p("stores/" + vars_1.Vars.store + "/" + path, data);
                };
                GetApi.prototype.p = function (path, data) {
                    if (data === void 0) { data = {}; }
                    return sclib.ajax({
                        url: vars_1.Vars.urlApi + path,
                        type: 'POST',
                        headers: this.h,
                        data: JSON.stringify(data),
                    });
                };
                return GetApi;
            }());
            exports_4("GetApi", GetApi);
        }
    };
});
/* eslint-disable class-methods-use-this */
System.register("libs/util", ["libs/session", "libs/get_api"], function (exports_5, context_5) {
    "use strict";
    var session_1, get_api_1, Util;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (session_1_1) {
                session_1 = session_1_1;
            },
            function (get_api_1_1) {
                get_api_1 = get_api_1_1;
            }
        ],
        execute: function () {/* eslint-disable class-methods-use-this */
            Util = /** @class */ (function () {
                function Util() {
                    this.session = new session_1.Session();
                    this.session = new session_1.Session();
                    this.getApi = new get_api_1.GetApi();
                    this.count();
                    this.lazy();
                    this.changeTowns();
                    this.btnBbcodeImg();
                    this.openModalAction();
                    this.openModalMsg();
                    this.moveRow();
                    this.showDetailOrder();
                    this.updateValue();
                }
                Util.prototype.moveRow = function () {
                    $('.move-up,.move-down,.move-top,.move-bottom').on('click', function (event) {
                        var $el = $(event.currentTarget);
                        var row = $el.parents('tr:first');
                        if ($el.is('.move-up')) {
                            row.insertBefore((row.prev()));
                        }
                        else if ($el.is('.move-down')) {
                            row.insertAfter((row.next()));
                        }
                        else if ($el.is('.move-top')) {
                            // row.insertAfter($("table tr:first"));
                            row.insertBefore($('table tr:first'));
                        }
                        else {
                            row.insertAfter($('table tr:last'));
                        }
                    });
                };
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
                Util.prototype.lazy = function () {
                    var webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
                    $('.lazy').Lazy({
                        beforeLoad: function (element) {
                            if (webp) {
                                element.attr('data-src', element.data('src').replace('.jpg', '.webp'));
                                if (element.data('retina')) {
                                    element.attr('data-retina', element.data('retina').replace('.jpg', '.webp'));
                                }
                            }
                        },
                    });
                };
                Util.prototype.changeTowns = function () {
                    var _this = this;
                    $('.department').on('change', function (event) {
                        var $el = $(event.currentTarget);
                        _this.getApi.g("towns/" + $el.val())
                            .done(function (data) {
                            var $target = $($el.data('target'));
                            $target.empty(); // remove old options
                            $target.append($('<option></option>').attr('value', '').text('--'));
                            $.each(data, function (_i, town) {
                                $target.append($('<option></option>').attr('value', town.name).text(town.name));
                            });
                        });
                    });
                };
                Util.prototype.btnBbcodeImg = function () {
                    $('.btn-bbcode-img').on('click', function (event) {
                        var $el = $(event.currentTarget);
                        $($el.data('target')).html("<div>" + $el.data('bbcode') + "</div><div>" + $el.data('linkhtml') + "<div>");
                    });
                };
                Util.prototype.openModalAction = function () {
                    $('.open-modal-action').on('click', function (event) {
                        var $el = $(event.currentTarget);
                        var $modal = $('#modalAction');
                        var $form = $('#modalActionForm');
                        $form.attr('action', $el.data('url'));
                        $form.attr('method', $el.data('method'));
                        $form.data('page', $el.data('page'));
                        $modal.find('.title').html($el.data('title'));
                        $modal.find('.btn-action').html($el.data('action'));
                        $modal.find('.btn-cancel').html($el.data('cancel'));
                        sclib.modalShow('#modalAction');
                    });
                };
                Util.prototype.openModalMsg = function () {
                    $('.open-modal-msg').on('click', function (event) {
                        var $el = $(event.currentTarget);
                        var $modal = $('#modalMsg');
                        $modal.find('.title').html($el.data('title'));
                        $modal.find('.btn--primary').html($el.data('close'));
                        $modal.find('.body').html($($el.data('body')).html());
                        sclib.modalShow('#modalMsg');
                    });
                };
                Util.prototype.showDetailOrder = function () {
                    $('.btn-cancel').on('click', function () {
                        sclib.modalShow('#cancelOrder');
                    });
                };
                Util.prototype.updateValue = function () {
                    $('.update').each(function (_i, el) {
                        var $el = $(el);
                        $($el.data('value') + "," + $el.data('percentage')).on('change', function () {
                            var value = parseFloat($($el.data('value')).val());
                            var percentage = parseFloat($($el.data('percentage')).val());
                            var fixed = parseFloat($($el.data('fixed')).val() || '0');
                            var newV = (value * (1 - (percentage / 100))).toFixed(fixed);
                            $el.val(newV);
                        });
                    });
                };
                return Util;
            }());
            exports_5("Util", Util);
        }
    };
});
System.register("libs/gtag", ["../util/products.d"], function (exports_6, context_6) {
    "use strict";
    var Gtag;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (_3) {
            }
        ],
        execute: function () {
            window.dataLayer = window.dataLayer || [];
            Gtag = /** @class */ (function () {
                function Gtag() {
                    this.window = window;
                }
                Gtag.prototype.event = function (obj) {
                    if (window.google_tag_manager) {
                        this.window.dataLayer.push(obj);
                    }
                    else if (obj === null || obj === void 0 ? void 0 : obj.eventCallback) {
                        console.log('e gtag');
                        obj.eventCallback();
                    }
                };
                Gtag.prototype.removeItem = function (product, quantity, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: 1,
                        price: product.price,
                        quantity: quantity,
                        store: product.store,
                    });
                    this.event({
                        event: 'removeFromCart',
                        ecommerce: {
                            currencyCode: 'COP',
                            remove: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                    });
                };
                Gtag.prototype.addItem = function (product, quantity, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: 1,
                        price: product.price,
                        quantity: quantity,
                        store: product.store,
                    });
                    this.event({
                        event: 'addToCart',
                        ecommerce: {
                            currencyCode: 'COP',
                            add: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                    });
                };
                /**
                 * Evento para saber cuando se muestra un producto
                 * @param products
                 * @param list
                 */
                Gtag.prototype.list = function (products, list) {
                    var l = [];
                    $.each(products, function (i, product) {
                        l.push({
                            id: product.sku,
                            name: product.name,
                            category: product.categoryText.join('/'),
                            brand: product.brandText,
                            list_name: list,
                            position: i,
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
                };
                /**
                 * Evento para saber cuando alguien le hace click a un producto
                 * @param obj
                 * @param product
                 * @param i
                 * @param list
                 */
                Gtag.prototype.clickItem = function (obj, product, i, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: i,
                        price: product.price,
                        store: product.store,
                    });
                    this.event({
                        event: 'productClick',
                        ecommerce: {
                            currencyCode: 'COP',
                            click: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                        eventCallback: function () {
                            document.location.href = $(obj).attr('href');
                        },
                    });
                    return false;
                };
                Gtag.prototype.viewItem = function (product, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: 1,
                        price: product.price,
                        store: product.store,
                    });
                    this.event({
                        ecommerce: {
                            currencyCode: 'COP',
                            detail: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                    });
                };
                Gtag.prototype.cart1 = function (obj, products) {
                    var l = [];
                    $.each(products, function (_i, product) {
                        l.push({
                            id: product.sku,
                            name: product.name,
                            category: product.categoryText.join('/'),
                            brand: product.brandText,
                            list_name: 'cart1',
                            position: 1,
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
                        eventCallback: function () {
                            document.location.href = $(obj).attr('href');
                        },
                    });
                    return false;
                };
                Gtag.prototype.cart2 = function (obj, typePayment) {
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
                        eventCallback: function () {
                            document.location.href = $(obj).attr('href');
                        },
                    });
                };
                Gtag.prototype.cart3 = function (order, products) {
                    var l = [];
                    $.each(products, function (_i, product) {
                        l.push({
                            id: product.sku,
                            name: product.name,
                            category: product.categoryText.join('/'),
                            brand: product.brandText,
                            list_name: 'cart1',
                            position: 1,
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
                                    id: order.orderID,
                                    affiliation: order.store.name,
                                    revenue: order.order.subtotal,
                                    tax: 0,
                                    shipping: order.order.shipping,
                                },
                                products: l,
                            },
                        },
                    });
                    return false;
                };
                Gtag.prototype.search = function (searchTerm) {
                    this.event({
                        event: 'search',
                        search_term: searchTerm,
                    });
                };
                return Gtag;
            }());
            exports_6("Gtag", Gtag);
        }
    };
});
System.register("libs/cart_count", ["../util/products.d", "libs/gtag"], function (exports_7, context_7) {
    "use strict";
    var gtag_1, CartCount;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (_4) {
            },
            function (gtag_1_1) {
                gtag_1 = gtag_1_1;
            }
        ],
        execute: function () {
            CartCount = /** @class */ (function () {
                function CartCount() {
                    this.gtag = new gtag_1.Gtag();
                    this.stores = {};
                    this.count();
                }
                CartCount.prototype.getCart = function () {
                    try {
                        this.stores = JSON.parse(localStorage.getItem('stores'));
                    }
                    catch (error) {
                        this.stores = {};
                    }
                };
                /**
                 * Pone el número de productos encima del carrito
                 */
                CartCount.prototype.count = function () {
                    this.getCart();
                    var number = 0;
                    var products = [];
                    $.each(this.stores, function (_i, store) {
                        $.each(store === null || store === void 0 ? void 0 : store.cart, function (_i, product) {
                            number += product.quantity;
                            products.push(product);
                        });
                    });
                    if (number) {
                        $('.num-shopping-cart').html(number.toString()).removeClass('start-hide');
                        $('.cart-empty').addClass('start-hide');
                    }
                    else {
                        $('.num-shopping-cart').html(number.toString()).addClass('start-hide');
                        $('.cart-empty').removeClass('start-hide');
                    }
                    // $('.link-shopping-cart').click((event) => {
                    //   this.gtag.cart1($(event.currentTarget), products);
                    // });
                };
                return CartCount;
            }());
            exports_7("CartCount", CartCount);
        }
    };
});
System.register("libs/product", ["libs/vars", "libs/gtag", "libs/cart"], function (exports_8, context_8) {
    "use strict";
    var vars_2, gtag_2, cart_1, Product;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (vars_2_1) {
                vars_2 = vars_2_1;
            },
            function (gtag_2_1) {
                gtag_2 = gtag_2_1;
            },
            function (cart_1_1) {
                cart_1 = cart_1_1;
            }
        ],
        execute: function () {
            Product = /** @class */ (function () {
                function Product() {
                }
                Product.img = function (product, size) {
                    if (size === void 0) { size = ['196x196', '392x392']; }
                    if ((product === null || product === void 0 ? void 0 : product.imagesSizes) && product.imagesSizes.length) {
                        var ext = vars_2.Vars.webp ? '_webp' : '_jpg';
                        var first = product.imagesSizes[0];
                        var img1 = first["" + size[0] + ext];
                        var img2 = first["" + size[1] + ext];
                        return "<img class=\"w-100 lazy\" data-src=\"" + img1 + "\" data-retina=\"" + img2 + "\" alt=\"" + product.name + "\">";
                    }
                    return "<img class=\"w-100 lazy\" data-src=\"" + vars_2.Vars.imgNoAvailable + "\" alt=\"" + product.name + "\">";
                };
                /**
                 * Genera la url para mostrar una imagen
                 * @param product
                 * @param size
                 */
                Product.imgNow = function (product, size) {
                    if (size === void 0) { size = ['196x196', '392x392']; }
                    var classSize = size[0].split('x')[0];
                    if ((product === null || product === void 0 ? void 0 : product.imagesSizes) && product.imagesSizes.length) {
                        var ext = vars_2.Vars.webp ? '_webp' : '_jpg';
                        var first = product.imagesSizes[0];
                        return "<img class=\"h-" + classSize + "p\" src=\"" + first["" + size[1] + ext] + "\" alt=\"" + product.name + "\">";
                    }
                    return "<img class=\"h-" + classSize + "p\" src=\"" + vars_2.Vars.imgNoAvailable + "\" alt=\"" + product.name + "\">";
                };
                Product.single = function (product, pos, list) {
                    var gtag = new gtag_2.Gtag();
                    var msg = '';
                    if (product.inventory) {
                        if (product.stock === 0) {
                            msg = 'Agotado';
                        }
                        else if (product.stock && product.stock < 10) {
                            msg = 'En stock, Pocas unidades';
                        }
                        else {
                            msg = 'En stock';
                        }
                    }
                    else {
                        msg = 'En stock';
                    }
                    var productHTML = $('<div class="w-230p w-170p-xs w-170p-sm br-1 white h-100">');
                    productHTML.html("" + ("<div class=\"h-100 relative p-3 pb-7 product\" data-sku=\"" + product.sku + "\">"
                        + ("<a href=\"/tiendas/" + vars_2.Vars.store + "/productos/" + product.sku + "\">" + Product.img(product) + "</a>")) + (product.brandText ? "<div class=\"t-white-700 small mb-1\">" + product.brandText + "</div>" : '') + "<div class=\"t-primary tc b small\">" + product.name + "</div>"
                        + ("<div class=\"t-secondary b big\">" + vars_2.Vars.formatMoney(product.price) + "</div>")
                        + ("<div class=\"t-action small mb-4\">" + msg + "</div>")
                        + '<div class="absolute w-100c2 ab-1">'
                        + '<button class="secondary w-100 add"><i class="fas fa-cart-plus"></i> Agregar</button>'
                        + '</div>'
                        + '</div>'
                        + '</div>');
                    productHTML.find('.add').on('click', function () {
                        var cart = new cart_1.Cart();
                        cart.add(product.sku, list, product.store);
                    });
                    productHTML.find('a').on('click', function (event) { return gtag.clickItem($(event.currentTarget), product, pos, list); });
                    return productHTML;
                };
                return Product;
            }());
            exports_8("Product", Product);
        }
    };
});
System.register("libs/cart_list", ["libs/cart", "libs/product", "libs/vars", "libs/get_api", "libs/session", "libs/gtag", "libs/show_msg"], function (exports_9, context_9) {
    "use strict";
    var cart_2, product_1, vars_3, get_api_2, session_2, gtag_3, show_msg_1, CartList;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (cart_2_1) {
                cart_2 = cart_2_1;
            },
            function (product_1_1) {
                product_1 = product_1_1;
            },
            function (vars_3_1) {
                vars_3 = vars_3_1;
            },
            function (get_api_2_1) {
                get_api_2 = get_api_2_1;
            },
            function (session_2_1) {
                session_2 = session_2_1;
            },
            function (gtag_3_1) {
                gtag_3 = gtag_3_1;
            },
            function (show_msg_1_1) {
                show_msg_1 = show_msg_1_1;
            }
        ],
        execute: function () {
            CartList = /** @class */ (function () {
                function CartList() {
                    this.cart = new cart_2.Cart();
                    this.gtag = new gtag_3.Gtag();
                    this.session = new session_2.Session();
                    this.paymentsMethods = {};
                    this.sum = { subtotal: 0, shipping: 0, total: 0 };
                    this.session = new session_2.Session();
                    this.getApi = new get_api_2.GetApi();
                }
                CartList.prototype.putTotals = function () {
                    var _this = this;
                    // Valor del sub total
                    $('.cart-subtotal').html(vars_3.Vars.formatMoney(this.sum.subtotal));
                    // Valor del sub total
                    this.sum.shipping = 0;
                    $.each(this.cart.stores, function (i) {
                        var val = parseFloat($("input[name=\"shipping-methods-" + i + "\"]:checked").data('price'));
                        if (val) {
                            _this.sum.shipping += val;
                        }
                    });
                    $('.cart-shipping').html(vars_3.Vars.formatMoney(this.sum.shipping));
                    // Valor del sub total
                    this.sum.total = this.sum.subtotal + this.sum.shipping;
                    $('.cart-total').html(vars_3.Vars.formatMoney(this.sum.total));
                };
                CartList.showAddresss = function () {
                    $('.cart-screen-adrress').show();
                    $('.show-addresss').on('click', function () {
                        sclib.modalShow('#address');
                    });
                };
                CartList.prototype.showCart = function () {
                    var _this = this;
                    var valid = false;
                    $('.cart-list').each(function (_i, el) {
                        var $el = $(el);
                        $el.html('');
                        // Dibuja en la pantalla de vista de productos
                        $.each(_this.cart.stores, function (i, elem) {
                            var slug = i;
                            if (Object.keys(elem.cart).length) {
                                valid = true;
                                var lineStore = $("<div id=\"cart_" + slug + "\" class=\"mb-1\">")
                                    .append("<div class=\"row\"><div class=\"col-md-8\"><div class=\"title\">Pedido de: " + elem.name + "</div></div>"
                                    + ("<div class=\"col-md-4 mt-0-5-sm mt-0-5-xs\"><a href=\"/tiendas/" + slug + "\" class=\"btn btn--secondary w-100 small\">Seguir comprando</a></div></div>"));
                                var desktop_1 = $('<table class="table table--striped small hide-xs">')
                                    .append('<thead><tr>'
                                    + '<th>&nbsp;</th>'
                                    + '<th colspan="2" class="tc">PRODUCTO</th>'
                                    + '<th class="tr">PRECIO</th>'
                                    + '<th class="tc">CANTIDAD</th>'
                                    + '<th class="tr">SUBTOTAL</th>'
                                    + '</tr></thead>');
                                // Mobile
                                var mobile_1 = $('<div class="mobile show-xs">');
                                $.each(elem.cart, function (sku, product) {
                                    var img = product_1.Product.img(product, ['48x48', '96x96']);
                                    var remove = $('<button class="btn btn--secondary small">')
                                        .html('<i class="fas fa-times hand"></i>')
                                        .click(function () {
                                        _this.cart.remove(product.sku, slug + "/page_cart", slug);
                                    });
                                    var add = $('<button class="btn btn--secondary small mr-0-25">')
                                        .html('<i class="fas fa-plus"></i><span class="out-screen">Aumentar cantidad</span>')
                                        .click(function () {
                                        _this.cart.add(sku, slug + "/page_cart", slug);
                                    });
                                    var minus = $('<button class="btn btn--secondary small mr-0-25">')
                                        .html('<i class="fas fa-minus"></i><span class="out-screen">Disminuir cantidad</span>')
                                        .click(function () {
                                        _this.cart.minus(sku, slug + "/page_cart", slug);
                                    });
                                    var controls = $('<div class="box-controls flex justify-content-center">')
                                        .append(minus.clone(true, true))
                                        .append("<div class=\"value w-48p mr-0-25 tc b p-0-25 br-1 rd-0-2 h-100\">" + product.quantity + "</div>")
                                        .append(add.clone(true, true));
                                    // Desktop
                                    desktop_1
                                        .append($('<tr>')
                                        .append($('<td>').append(remove.clone(true, true)))
                                        .append("<td class=\"w-48p\">" + img + "</td>"
                                        + ("<td><div class=\"b\">" + product.name + "</div></td>")
                                        + ("<td class=\"tr\">" + vars_3.Vars.formatMoney(product.price) + "</td>"))
                                        .append($('<td class="tr">').append(controls.clone(true, true)))
                                        .append("<td class=\"tr t-secondary b\">" + vars_3.Vars.formatMoney(product.quantity * product.price) + "</td>"));
                                    // Mobile
                                    mobile_1
                                        .append($('<table class="table table--striped small">')
                                        .append("<tr><th class=\"h-img-48\">" + img + "</th><td class=\"b big\">" + product.name + "</td></tr>")
                                        .append($('<tr>')
                                        .append("<th class=\"b\">PRECIO</th><td class=\"t-secondary tr\">" + vars_3.Vars.formatMoney(product.price) + "</td>"))
                                        .append($('<tr>')
                                        .append('<th class="b">CANTIDAD</th>')
                                        .append($('<td>').append(controls.clone(true, true))))
                                        .append($('<tr>')
                                        .append("<th class=\"b\">SUBTOTAL</th><td class=\"t-secondary tr b\">" + vars_3.Vars.formatMoney(product.quantity * product.price) + "</td>")));
                                });
                                lineStore
                                    .append(desktop_1)
                                    .append(mobile_1);
                                $el.append(lineStore);
                            }
                        });
                        $el.find('.lazy').Lazy();
                        _this.cart.subtotal();
                    });
                    $('.btn-cart1').click(function (event) {
                        var products = [];
                        $.each(_this.cart.stores, function (_i, elem) {
                            $.each(elem.cart, function (_sku, product) {
                                products.push(product);
                            });
                        });
                        _this.gtag.cart1($(event.currentTarget), products);
                    });
                    if (valid) {
                        $('.cart-screen').removeClass('hide');
                        $('.cart-empty').addClass('hide');
                    }
                    else {
                        $('.cart-screen').addClass('hide');
                        $('.cart-empty').removeClass('hide');
                    }
                };
                CartList.prototype.fixProductsInCart = function () {
                    var _this = this;
                    var list = $('.cart-list-address');
                    if (list.length) {
                        list.html('');
                        this.sum.subtotal = 0;
                        $.each(this.cart.stores, function (i, elem) {
                            if (Object.keys(elem.cart).length === 0) {
                                return;
                            }
                            var slug = i;
                            _this.getApi.p("stores/" + i + "/services/check-cart", { items: elem.cart })
                                .done(function (data) {
                                var valid = false;
                                _this.cart.stores[i].cart = data.validateItems.items;
                                _this.cart.set();
                                // pinta los productos
                                var lineStore = "<div id=\"cart_" + slug + "\" class=\"mt-1\">"
                                    + ("<div class=\"b\">" + elem.name + "</div>");
                                lineStore += '<table class="table table--striped small">'
                                    + '<thead>'
                                    + '<tr>'
                                    + '<th class="tc">PRODUCTO</th>'
                                    + '<th class="tr">SUBTOTAL</th>'
                                    + '</tr>'
                                    + '</thead>';
                                $.each(data.validateItems.items, function (sku, product) {
                                    valid = true;
                                    // Desktop
                                    lineStore += '<tr>'
                                        + ("<td><span class=\"b\">" + product.name + "</span> (" + product.quantity + ")</td>")
                                        + ("<td class=\"tr t-secondary\">" + vars_3.Vars.formatMoney(product.quantity * product.price) + "</td>");
                                    _this.sum.subtotal += product.quantity * product.price;
                                });
                                lineStore += '</table></div>';
                                list.append(lineStore);
                                // muestra totales
                                _this.putTotals();
                                if (valid) {
                                    $('.cart-screen-adrress').removeClass('hide');
                                    $('.cart-empty').addClass('hide');
                                }
                                else {
                                    $('.cart-screen-adrress').addClass('hide');
                                    $('.cart-empty').removeClass('hide');
                                }
                            });
                        });
                    }
                };
                CartList.prototype.showStepAddress = function () {
                    var _this = this;
                    var valid = false;
                    var list = $('.cart-list-availability');
                    if (list.length) {
                        $('.cart-list-availability').each(function (_i, el) {
                            var $el = $(el);
                            $el.html('');
                            // Dibuja en la pantalla de vista de productos
                            $.each(_this.cart.stores, function (i, store) {
                                if (Object.keys(store.cart).length === 0) {
                                    return;
                                }
                                valid = true;
                                var details = "<div id=\"step-store-" + i + "\" class=\"white br-1 rd-0-2 p-1 mt-1\">"
                                    + ("<div class=\"title\">" + store.name + "</div>")
                                    + '<div class="hr"></div>'
                                    + '<div class="subtitle b mt-0-25">Método de envío</div>'
                                    + '<div class="shipping-methods"><div class="bigx2"><i class="fas fa-sync fa-spin"></i></div></div>'
                                    + '<div class="subtitle b mt-0-25">Método de pago</div>'
                                    + '<div class="payments-methods"><div class="bigx2"><i class="fas fa-sync fa-spin"></i></div></div>'
                                    + '</div>';
                                $el.append(details);
                                // busca en el api los métodos de envío
                                _this.getApi.p("stores/" + i + "/services/search-shipping-methods", cart_2.Cart.getAddressJSON())
                                    .done(function (data) {
                                    var m = '';
                                    var area = false;
                                    $.each(data.shippingMethods, function (k, methods) {
                                        if ((data.inArea && methods.personalDelivery) || !methods.personalDelivery) {
                                            area = true;
                                            m += "<div class=\"mt-1 mb-1 ml-1 small\"><label data-payments='" + JSON.stringify(methods.payments) + "'>"
                                                + ("<input id=\"r-shipping-methods-" + i + "-" + k + "\" type=\"radio\" class=\"radio\" name=\"shipping-methods-" + i + "\" ")
                                                + ("value=\"" + methods.slug + "\" data-price=\"" + methods.price + "\" " + (k === 0 ? 'checked="checked"' : '') + ">")
                                                + ("<span>" + methods.name + "</span> - <span class=\"t-secondary\">" + vars_3.Vars.formatMoney(methods.price) + "</span></label>")
                                                + ("<div class=\"remark\">" + methods.description + "</div>")
                                                + '</div>';
                                        }
                                    });
                                    if (!area) {
                                        m = '<div class="remark error mh-2">La tienda no tiene cobertura a la dirección de entrega proporcionada.</div>';
                                        $el.find("#step-store-" + i + " .shipping-methods").html(m);
                                        $el.find("#step-store-" + i + " .payments-methods").html('');
                                        return;
                                    }
                                    $el.find("#step-store-" + i + " .shipping-methods").html(m)
                                        .find('label').on('click', function (event) {
                                        var list = $(event.currentTarget).data('payments');
                                        _this.showStepAddressPayment($el, i, list);
                                        _this.putTotals();
                                    });
                                    // busca en el api los métodos de pago
                                    _this.getApi.p("stores/" + i + "/services/search-payments-methods", { shippingMethod: $("input[name=\"shipping-methods-" + i + "\"]").val() })
                                        .done(function (data) {
                                        _this.paymentsMethods[i] = data.paymentsMethods;
                                        $el.find("#step-store-" + i + " .shipping-methods").find('label').first().trigger('click');
                                    });
                                });
                            });
                        });
                    }
                    $('.btn-cart2').on('click', function () {
                        // Mira la dirección
                        var address = cart_2.Cart.getAddressJSON();
                        if (_this.checkAddress() && !address.address) {
                            return sclib.modalShow('#address');
                        }
                        var errors = [];
                        $.each(_this.cart.stores, function (i, store) {
                            if (Object.keys(store.cart).length === 0) {
                                return;
                            }
                            if (!$("input[name=\"shipping-methods-" + i + "\"]:checked").val()) {
                                errors.push({ msg: "Seleccione el M\u00E9todo de Env\u00EDo para <b>" + store.name + "</b>" });
                            }
                            _this.cart.stores[i].shipping = $("input[name=\"shipping-methods-" + i + "\"]:checked").val();
                            if (!$("input[name=\"payments-methods-" + i + "\"]:checked").val()) {
                                errors.push({ msg: "Seleccione el M\u00E9todo de Pago para <b>" + store.name + "</b>" });
                            }
                            _this.cart.stores[i].payment = $("input[name=\"payments-methods-" + i + "\"]:checked").val();
                        });
                        // if (!$('#pptu').is(':checked')) {
                        //   errors.push('Debes aceptar <b>la Política de privacidad y los Términos de uso*</b>');
                        // }
                        if (errors.length) {
                            show_msg_1.ShowMsg.show(errors, 'error');
                            return;
                        }
                        // Manda a back
                        _this.getApi.p('orders', {
                            stores: _this.cart.stores,
                            cartID: _this.cart.getCartID(),
                            address: address,
                            pptu: $('#pptu').is(':checked'),
                        })
                            .done(function () {
                            cart_2.Cart.reset();
                            document.location.href = window.location.origin + "/carrito-resumen";
                        })
                            .fail(show_msg_1.ShowMsg.show);
                    });
                    if (valid) {
                        $('.cart-screen-adrress').removeClass('hide');
                        $('.cart-empty').addClass('hide');
                    }
                    else {
                        $('.cart-screen-adrress').addClass('hide');
                        $('.cart-empty').removeClass('hide');
                    }
                };
                CartList.prototype.showStepAddressPayment = function ($el, i, list) {
                    var _this = this;
                    var m = '';
                    $.each(list, function (k, slug) {
                        var methods = _this.paymentsMethods[i].find(function (o) { return o.slug === slug; });
                        if (methods) {
                            m += '<div class="mh-1 ml-1 small"><label>'
                                + ("<input id=\"r-payments-methods-" + i + "-" + k + "\" type=\"radio\" class=\"radio\"  name=\"payments-methods-" + i + "\" ")
                                + ("value=\"" + methods.slug + "\" data-price=\"" + methods.price + "\" " + (k === 0 ? 'checked="checked"' : '') + ">")
                                + ("<span>" + methods.name + "</span></label>")
                                + ("<div class=\"remark\">" + methods.description + "</div>")
                                + '</div>';
                        }
                    });
                    $el.find("#step-store-" + i + " .payments-methods").html(m);
                };
                CartList.prototype.checkAddress = function () {
                    var checkAddress = false;
                    $.each(this.cart.stores, function (i, store) {
                        if (Object.keys(store.cart).length === 0) {
                            return;
                        }
                        $.each(store.cart, function (i, product) {
                            var _a;
                            if (!((_a = product.digital) === null || _a === void 0 ? void 0 : _a.is)) {
                                checkAddress = true;
                            }
                        });
                    });
                    return checkAddress;
                };
                return CartList;
            }());
            exports_9("CartList", CartList);
        }
    };
});
/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
System.register("libs/cart", ["libs/vars", "libs/get_api", "libs/gtag", "libs/cart_count", "libs/show_msg", "libs/product", "libs/cart_list"], function (exports_10, context_10) {
    "use strict";
    var vars_4, get_api_3, gtag_4, cart_count_1, show_msg_2, product_2, cart_list_1, Cart;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (vars_4_1) {
                vars_4 = vars_4_1;
            },
            function (get_api_3_1) {
                get_api_3 = get_api_3_1;
            },
            function (gtag_4_1) {
                gtag_4 = gtag_4_1;
            },
            function (cart_count_1_1) {
                cart_count_1 = cart_count_1_1;
            },
            function (show_msg_2_1) {
                show_msg_2 = show_msg_2_1;
            },
            function (product_2_1) {
                product_2 = product_2_1;
            },
            function (cart_list_1_1) {
                cart_list_1 = cart_list_1_1;
            }
        ],
        execute: function () {/* eslint-disable no-mixed-operators */
            /* eslint-disable no-bitwise */
            Cart = /** @class */ (function () {
                function Cart() {
                    this.getApi = new get_api_3.GetApi();
                    this.cartCount = new cart_count_1.CartCount();
                    this.gtag = new gtag_4.Gtag();
                    this.cartID = '';
                    this.getCart();
                }
                Cart.reset = function () {
                    localStorage.removeItem('stores');
                    Cart.updateUUID();
                };
                Cart.prototype.getCart = function () {
                    try {
                        this.stores = JSON.parse(localStorage.getItem('stores')) || {};
                    }
                    catch (error) {
                        this.stores = {};
                    }
                };
                /**
                 * Pone los valores del carrito en el localstorage
                 */
                Cart.prototype.set = function () {
                    localStorage.setItem('stores', JSON.stringify(this.stores));
                    this.cartCount.count();
                };
                /**
                 * Trae el producto de la tienda o lo crea con 0
                 * @param store
                 * @param sku
                 * @param cb
                 */
                Cart.prototype.get = function (store, sku, cb) {
                    var _this = this;
                    if (!this.stores[store]) {
                        this.stores[store] = { cart: {}, name: '' };
                    }
                    var item = this.stores[store].cart[sku];
                    // no esta, se trae los datos
                    if (!(item === null || item === void 0 ? void 0 : item.sku)) {
                        var url = '';
                        if (vars_4.Vars.place) {
                            url = "products/" + sku + "?place=" + vars_4.Vars.place;
                        }
                        else {
                            url = "products/" + sku;
                        }
                        this.getApi.gs(url, store)
                            .done(function (data) {
                            var product = {
                                store: store,
                                sku: sku,
                                name: data.name,
                                categoryText: data.categoryText,
                                brandText: data.brandText,
                                price: data.price,
                                quantity: 0,
                                imagesSizes: data.imagesSizes,
                            };
                            _this.stores[store].cart[sku] = product;
                            _this.stores[store].name = data.storeName;
                            _this.set();
                            cb(product);
                        });
                    }
                    else {
                        cb(item);
                    }
                };
                /**
                 * Genera el html parra mostrar una imagen de un producto
                 * @param product
                 */
                Cart.lineImg = function (product) {
                    return "<div class=\"flex mt-1\"><div class=\"mr-1\">" + product_2.Product.imgNow(product, ['48x48', '96x96']) + "</div><div>" + product.name + "</div></div>";
                };
                Cart.updateUUID = function () {
                    localStorage.setItem('cartID', Cart.uuidv4());
                };
                Cart.uuidv4 = function () {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0;
                        var v = c === 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };
                /**
                 * Asigna un cartID
                 */
                Cart.prototype.getCartID = function () {
                    this.cartID = localStorage.getItem('cartID');
                    if (!this.cartID) {
                        this.cartID = Cart.uuidv4();
                        localStorage.setItem('cartID', this.cartID);
                    }
                    return this.cartID;
                };
                /**
                 * Asigna al carro de una tienda una cantidad a un producto
                 * @param productPre
                 * @param quantity
                 * @param list
                 */
                Cart.prototype.setQuantity = function (productPre, quantity, list) {
                    var _this = this;
                    this.getCartID();
                    this.get(productPre.store, productPre.sku, function (product) {
                        var _a;
                        if (product) {
                            var msg = Cart.lineImg(product);
                            if (quantity === 0) {
                                product.quantity = quantity;
                                _this.gtag.removeItem(product, quantity, list);
                                show_msg_2.ShowMsg.show([
                                    {
                                        code: 0,
                                        title: 'Producto eliminado',
                                        msg: msg,
                                    },
                                ], 'info');
                                (_a = _this.stores[product.store]) === null || _a === void 0 ? true : delete _a.cart[product.sku];
                            }
                            else if (product.quantity < quantity) {
                                _this.gtag.addItem(product, quantity - product.quantity, list);
                                product.quantity = quantity;
                                show_msg_2.ShowMsg.show([
                                    {
                                        code: 0,
                                        title: 'Producto agregado',
                                        msg: msg,
                                    },
                                ], 'info');
                            }
                            else if (product.quantity > quantity) {
                                _this.gtag.removeItem(product, product.quantity - quantity, list);
                                product.quantity = quantity;
                                show_msg_2.ShowMsg.show([
                                    {
                                        code: 0,
                                        title: 'Producto modificado',
                                        msg: msg,
                                    },
                                ], 'info');
                            }
                            else {
                                return;
                            }
                            _this.set();
                            _this.subtotal();
                            var cartList = new cart_list_1.CartList();
                            cartList.showCart();
                        }
                    });
                };
                Cart.prototype.getProduct = function (store, sku) {
                    var _a;
                    return (_a = this.stores[store]) === null || _a === void 0 ? void 0 : _a.cart[sku];
                };
                /**
                 * Suma el valor de los productos
                 */
                Cart.prototype.subtotal = function () {
                    var subtotal = 0;
                    $.each(this.stores, function (_slug, store) {
                        $.each(store.cart, function (_sku, product) {
                            subtotal += product.quantity * product.price;
                        });
                    });
                    $('.cart-subtotal').html("" + vars_4.Vars.formatMoney(subtotal));
                };
                /**
                 * Agrega 1 unidad a el producto de una tienda
                 * @param product
                 * @param list
                 */
                Cart.prototype.add = function (sku, list, store) {
                    var _a;
                    var product = (_a = this.stores[store]) === null || _a === void 0 ? void 0 : _a.cart[sku];
                    this.setQuantity({ store: store, sku: sku }, ((product === null || product === void 0 ? void 0 : product.quantity) || 0) + 1, list);
                };
                Cart.prototype.minus = function (sku, list, store) {
                    if (store === void 0) { store = vars_4.Vars.store; }
                    var product = this.stores[store].cart[sku];
                    if (product && product.quantity > 0) {
                        this.setQuantity(product, product.quantity - 1, list);
                    }
                };
                Cart.prototype.remove = function (sku, list, store) {
                    var product = this.stores[store].cart[sku];
                    if (product) {
                        this.setQuantity(product, 0, list);
                    }
                };
                Cart.getAddressJSON = function () {
                    try {
                        return JSON.parse(localStorage.getItem('address') || '{}');
                    }
                    catch (error) {
                        localStorage.removeItem('address');
                        return {};
                    }
                };
                Cart.setAddressJSON = function (address) {
                    if (typeof address === 'string') {
                        try {
                            address = JSON.parse(address);
                        }
                        catch (error) {
                            address = '';
                        }
                    }
                    localStorage.setItem('address', JSON.stringify(address));
                    return address;
                };
                Cart.prepareFormAddress = function () {
                    // llena datos de la direccion
                    var address = Cart.getAddressJSON();
                    if (address.form) {
                        $.each(address.form, function (_i, v) {
                            $("[name=\"" + v.name + "\"]").val(v.value);
                        });
                    }
                    if (address.address) {
                        $('.user-address').html(address.address);
                        $('.data-address .address').html(address.address.split(',')[0]);
                    }
                    else {
                        $('.user-address').html('<div class="msg error">Proporcione una dirección para continuar</div>');
                    }
                    $('#addressForm').data('post', Cart.checkAddress);
                    $('#mapForm .back').on('click', function () {
                        $('#addressForm').show();
                        $('#mapForm').hide();
                    });
                    $('#mapForm').data('post', function () {
                        var address = Cart.setAddressJSON($('#addressJSON').val());
                        sclib.modalHide('#address');
                        $('.user-address').html(address.address);
                        var cartList = new cart_list_1.CartList();
                        cartList.showStepAddress();
                    });
                };
                Cart.checkAddress = function (data) {
                    $('#map-container').html('<div id="map" class="w-100 h-460p"></div>');
                    var address = {
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
                    var coords = [data.location.lat || 4.646876, data.location.lng || -74.087547];
                    var map = L.map('map').setView(coords, 16);
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
                    var marker = L.marker(coords, {
                        draggable: true,
                    }).addTo(map);
                    marker.on('dragend', function () {
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
                };
                return Cart;
            }());
            exports_10("Cart", Cart);
        }
    };
});
System.register("libs/show_msg", ["libs/cart"], function (exports_11, context_11) {
    "use strict";
    var cart_3, ShowMsg;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (cart_3_1) {
                cart_3 = cart_3_1;
            }
        ],
        execute: function () {
            ShowMsg = /** @class */ (function () {
                function ShowMsg() {
                }
                // Muestra los errores del back
                ShowMsg.show = function (errors, alert) {
                    var _a;
                    if (alert === void 0) { alert = 'secondary'; }
                    var timeShow = 5000;
                    var em = $('.error-modal');
                    if (!em.length) {
                        em = $('<div class="error-modal fixed ab-0 w-100 p-1">').hide();
                        $('body').append(em);
                    }
                    em.show();
                    if ((_a = errors.data) === null || _a === void 0 ? void 0 : _a.values) {
                        errors = errors.data.values;
                    }
                    $.each(errors, function (_i, error) {
                        // error de los productos del carro, se pide actualizar
                        if (error.code === 1000) {
                            // cart.check();
                        }
                        // id de carro de compras dañado
                        if (error.code === 1001) {
                            cart_3.Cart.updateUUID();
                        }
                        // id de carro de compras procesado
                        if (error.code === 1002) {
                            cart_3.Cart.reset();
                            setTimeout(function () {
                                document.location.href = window.location.origin + window.location.pathname;
                            }, timeShow);
                        }
                        var msg = $("<div class=\"msg " + alert + " ab-2 fixed p-1 center op-1\">");
                        var close = $('<button class="btn-flat p-1 absolute ar-2" data-dismiss="modal" aria-label="Cerrar">')
                            .html('<span aria-hidden="true"><i class="fas fa-times"></i></span>')
                            .on('click', function () {
                            msg.removeClass('op-1');
                            setTimeout(function () {
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
                                .append("<div class=\"b\">" + error.title + "</div>");
                        }
                        msg
                            .append(error.msg);
                        em.append(msg);
                        setTimeout(function () {
                            msg.addClass('op-1');
                        }, 1);
                        setTimeout(function () {
                            close.trigger('click');
                        }, timeShow);
                    });
                };
                return ShowMsg;
            }());
            exports_11("ShowMsg", ShowMsg);
        }
    };
});
System.register("libs/amz", ["libs/vars"], function (exports_12, context_12) {
    "use strict";
    var vars_5, Amz;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (vars_5_1) {
                vars_5 = vars_5_1;
            }
        ],
        execute: function () {
            Amz = /** @class */ (function () {
                function Amz() {
                }
                // genera sku aleatorio
                Amz.makeStr = function (length) {
                    var result = '';
                    var characters = 'abcdefghijklmnopqrstuvwxyz';
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                };
                Amz.makeNumber = function (length) {
                    var result = '';
                    var characters = '0123456789';
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                };
                Amz.putName = function (data) {
                    $('#name').val(data.title);
                    $('#shortDescription').val(data.title);
                    $('#amzUrl').val($('#url').val());
                    $('#amzTrm').val(data.trm);
                    $('#amzUsd').val(data.price);
                    $('#weight').val(data.weight);
                    $('#length').val(data.dimensions[0]);
                    $('#height').val(data.dimensions[1]);
                    $('#width').val(data.dimensions[2]);
                    $('#sku').val(Amz.makeStr(5) + "-" + Amz.makeNumber(3));
                    $('#brandText').val(data.brandText);
                    $('#urlFiles').val(data.images.join('\n'));
                    $('#inventory').val('1');
                    $('#stock').val(2);
                    window.ckeditors[0].setData(data.longDescription);
                    $('#amzUsd').trigger('change');
                };
                Amz.actions = function () {
                    $('#weight,#length,#height,#width,#amzIncPrice,#amzIncWeight,#amzIncDimensions,#amzUsd').on('change', function () {
                        var trm = parseFloat($('#amzTrm').val());
                        var usd = parseFloat($('#amzUsd').val());
                        var incPrice = parseFloat($('#amzIncPrice').val());
                        var incW = parseFloat($('#amzIncWeight').val());
                        var incD = parseFloat($('#amzIncDimensions').val());
                        var we = parseFloat($('#weight').val());
                        var l = parseFloat($('#length').val());
                        var h = parseFloat($('#height').val());
                        var w = parseFloat($('#width').val());
                        var pcop = (usd * trm) * (incPrice / 100 + 1);
                        var pw = (incW * Math.ceil(we / 454)) * trm;
                        var pd = ((l * h * w) / 1000) * (incD * trm);
                        var price = Math.ceil((pcop + pw + pd) / 1000) * 1000;
                        $('#price').val(price);
                        $('.parts').html("<div>(" + trm + " &times; " + usd + ") &times; " + incPrice + "% = " + vars_5.Vars.formatMoney(pcop) + "</div>"
                            + ("<div>(" + incW + " &times; " + Math.ceil(we / 454) + ") &times; " + trm + " = " + vars_5.Vars.formatMoney(pw) + "</div>")
                            + ("<div>(" + l + " &times; " + h + " &times; " + w + ") &times; (" + incD + " &times; " + trm + ") = " + vars_5.Vars.formatMoney(pd) + "</div>"));
                    });
                };
                return Amz;
            }());
            exports_12("Amz", Amz);
        }
    };
});
System.register("admin", ["./libs/define", "libs/edit", "libs/util", "libs/show_msg", "libs/amz"], function (exports_13, context_13) {
    "use strict";
    var edit_1, util_1, show_msg_3, amz_1;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (_5) {
            },
            function (edit_1_1) {
                edit_1 = edit_1_1;
            },
            function (util_1_1) {
                util_1 = util_1_1;
            },
            function (show_msg_3_1) {
                show_msg_3 = show_msg_3_1;
            },
            function (amz_1_1) {
                amz_1 = amz_1_1;
            }
        ],
        execute: function () {
            new edit_1.Edit();
            new util_1.Util();
            amz_1.Amz.actions();
            window.showMsg = show_msg_3.ShowMsg.show;
            window.amz = amz_1.Amz.putName;
        }
    };
});
System.active();
