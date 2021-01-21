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
System.register("libs/vars", ["../util/products.d"], function (exports_2, context_2) {
    "use strict";
    var Vars;
    var __moduleName = context_2 && context_2.id;
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
            exports_2("Vars", Vars);
        }
    };
});
System.register("libs/get_api", ["../util/sclib.d", "libs/vars"], function (exports_3, context_3) {
    "use strict";
    var vars_1, GetApi;
    var __moduleName = context_3 && context_3.id;
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
                function GetApi(token) {
                    this.h = {};
                    if (token) {
                        this.h = {
                            Authorization: "bearer " + token,
                        };
                    }
                }
                /**
                 * GET: api la ruta de la tienda
                 * @param path ruta del api
                 * @param store Opcional, tienda activa
                 */
                GetApi.prototype.gs = function (path, store) {
                    if (store === void 0) { store = vars_1.Vars.store; }
                    return this.g(store + "/" + path);
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
                    return this.p(vars_1.Vars.store + "/" + path, data);
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
            exports_3("GetApi", GetApi);
        }
    };
});
System.register("libs/session", [], function (exports_4, context_4) {
    "use strict";
    var Session;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            Session = /** @class */ (function () {
                function Session() {
                    var _a, _b;
                    this.token = localStorage.getItem('token');
                    try {
                        this.user = JSON.parse(localStorage.getItem('user'));
                        if (this.token) {
                            if ((_b = (_a = this.user) === null || _a === void 0 ? void 0 : _a.personalInfo) === null || _b === void 0 ? void 0 : _b.firstname) {
                                $('.userFirstname').html(this.user.personalInfo.firstname.split(' ')[0]);
                            }
                            $('.nologin').hide();
                            $('.login').show();
                        }
                        else {
                            $('.login').hide();
                            $('.nologin').show();
                        }
                    }
                    catch (error) {
                        $('.login').hide();
                        $('.nologin').show();
                    }
                }
                Session.checkWebpFeature = function (feature, callback) {
                    var kTestImages = {
                        lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
                        lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
                        alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
                        animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
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
            exports_4("Session", Session);
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
                    this.getApi = new get_api_1.GetApi(this.session.token);
                    this.count();
                    this.lazy();
                    this.showDetailOrder();
                    this.changeTowns();
                    this.btnBbcodeImg();
                    this.openModalAction();
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
                Util.prototype.showDetailOrder = function () {
                    $('.btn-next-status').on('click', function () {
                        sclib.modalShow('#modalNextStatus');
                    });
                    $('.btn-cancel').on('click', function () {
                        sclib.modalShow('#cancelOrder');
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
                        $($el.data('target')).html($el.data('bbcode'));
                    });
                };
                Util.prototype.openModalAction = function () {
                    $('.open-modal-action').on('click', function (event) {
                        var $el = $(event.currentTarget);
                        var $modal = $('#modalGeneral');
                        var $form = $('#modalGeneralForm');
                        $form.attr('action', $el.data('url'));
                        $form.attr('method', $el.data('method'));
                        $form.data('page', $el.data('page'));
                        $modal.find('.title').html($el.data('title'));
                        $modal.find('.btn-action').html($el.data('action'));
                        $modal.find('.btn-cancel').html($el.data('cancel'));
                        sclib.modalShow('#modalGeneral');
                    });
                };
                return Util;
            }());
            exports_5("Util", Util);
        }
    };
});
System.register("admin", ["./libs/define", "libs/edit", "libs/util"], function (exports_6, context_6) {
    "use strict";
    var edit_1, util_1;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (_3) {
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
