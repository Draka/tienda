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
System.register("libs/vars", ["../util/products.d"], function (exports_1, context_1) {
    "use strict";
    var Vars;
    var __moduleName = context_1 && context_1.id;
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
            exports_1("Vars", Vars);
        }
    };
});
System.register("libs/get_api", ["../util/sclib.d", "libs/vars"], function (exports_2, context_2) {
    "use strict";
    var vars_1, GetApi;
    var __moduleName = context_2 && context_2.id;
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
            exports_2("GetApi", GetApi);
        }
    };
});
System.register("libs/session", ["libs/get_api"], function (exports_3, context_3) {
    "use strict";
    var get_api_1, Session;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (get_api_1_1) {
                get_api_1 = get_api_1_1;
            }
        ],
        execute: function () {
            Session = /** @class */ (function () {
                function Session() {
                    this.getApi = new get_api_1.GetApi();
                    this.userSession();
                }
                Session.prototype.userSession = function () {
                    var _this = this;
                    if (Session.session === null) {
                        Session.session = false;
                        this.getApi.g('users/me')
                            .done(function (data) {
                            Session.session = data;
                            $('.session').show();
                            _this.launcher('history');
                        });
                    }
                };
                Session.product = function (product) {
                    return "" + '<div class="col">'
                        + '<div class="h-100 white-sm white-md white-lg white-xl p-1-sm p-1-md p-1-lg p-1-xl sh-hover-sm sh-hover-md sh-hover-lg sh-hover-xl rd-0-2 oh">'
                        + '<div class="h-100 relative mb-0-5">'
                        + '<a class="mb-1" href="/tiendas/test-1/productos/udfji-249">'
                        + '<div class="relative rd-0-5 oh lh-0">'
                        + '<img class="w-100" alt="' + product.truncate + "\" src=\"" + product.imagesSizes[0]['392x392_jpg'] + "\" />"
                        + '<div class="absolute top black op-0-05 w-100 h-100"></div>'
                        + '</div>'
                        + '</a>'
                        + '<div class="w-100 mt-1-sm mt-1-md mt-1-lg mt-1-xl">'
                        + ("<a class=\"mb-1\" href=\"/tiendas/test-1/productos/udfji-249\" title=\"" + product.name + "\">")
                        + ("<div class=\"small oh ellipsis lines-2 mb-0-5\">" + product.name + "</div>")
                        + '<div class="b t t-gray-2">$120,000</div>'
                        + '<div class="b t-primary">$90,000</div>'
                        + '</a>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>';
                };
                Session.prototype.launcher = function (type) {
                    if ($('.products-line-history').length) {
                        this.getApi.g("users/" + type)
                            .done(function (data) {
                            var html = '';
                            for (var index = 0; index < data.length || index < 5; index++) {
                                html += Session.product(data[index]);
                            }
                            $('.products-line-history').html(html);
                        });
                    }
                };
                Session.session = null;
                return Session;
            }());
            exports_3("Session", Session);
        }
    };
});
System.register("libs/wompi", [], function (exports_4, context_4) {
    "use strict";
    var Wompi;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            Wompi = /** @class */ (function () {
                function Wompi() {
                }
                Wompi.btn = function (getApi, obj) {
                    obj.on('click', function (event) {
                        var order = obj.data('order');
                        var wompiKey = obj.data('wompiKey');
                        if (!order) {
                            return;
                        }
                        getApi.g("orders/ref/" + order)
                            .done(function (data) {
                            event.stopPropagation();
                            var checkout = new WidgetCheckout({
                                currency: 'COP',
                                amountInCents: data.amount * 100,
                                reference: "" + data.reference,
                                publicKey: wompiKey || Wompi.key,
                            });
                            checkout.open(function () {
                                setTimeout(function () {
                                    document.location.href = window.location.origin + window.location.pathname;
                                }, 3000);
                            });
                        });
                    });
                };
                Wompi.key = 'pub_test_Utcl6o6rEhg8FHIhmI37vLFI16EjGSCc';
                return Wompi;
            }());
            exports_4("Wompi", Wompi);
        }
    };
});
System.register("libs/userUtil", ["libs/session", "libs/get_api", "libs/wompi", "libs/vars"], function (exports_5, context_5) {
    "use strict";
    var session_1, get_api_2, wompi_1, vars_2, Util;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (session_1_1) {
                session_1 = session_1_1;
            },
            function (get_api_2_1) {
                get_api_2 = get_api_2_1;
            },
            function (wompi_1_1) {
                wompi_1 = wompi_1_1;
            },
            function (vars_2_1) {
                vars_2 = vars_2_1;
            }
        ],
        execute: function () {
            Util = /** @class */ (function () {
                function Util() {
                    this.session = new session_1.Session();
                    this.session = new session_1.Session();
                    this.getApi = new get_api_2.GetApi();
                    this.lazy();
                    this.address();
                    this.showDetailOrder();
                    this.scrollClick();
                    this.figure();
                }
                Util.prototype.figure = function () {
                    $('.help figure.image_resized').css({
                        width: '50%',
                        minWidth: '320px',
                    });
                    $('oembed[url]').each(function (_i, el) {
                        var ael = document.createElement('a');
                        ael.href = $(el).attr('url');
                        var urlParams = new URLSearchParams(ael.search);
                        var url = '';
                        if (ael.host === 'youtube.com' || ael.host === 'www.youtube.com') {
                            url = "//" + ael.host + "/embed/" + urlParams.get('v');
                        }
                        else if (ael.host === 'youtu.be') {
                            url = "//www.youtube.com/embed" + ael.pathname;
                        }
                        $(el).html("<iframe width=\"100%\" height=\"315\" src=\"" + url + "\" "
                            + 'title="YouTube video player" frameborder="0" '
                            + 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" '
                            + 'allowfullscreen></iframe>');
                    });
                };
                Util.prototype.scrollClick = function () {
                    $('.scroll-click').on('click', function (event) {
                        var $el = $(event.currentTarget);
                        var pl = $($el.data('target'));
                        var ll = pl.find('> ul li').first().width();
                        pl.scrollLeft(ll * $el.index());
                    });
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
                    $('.carousel-arrow-right').on('click', function () {
                        $(window).trigger('scroll');
                    });
                };
                Util.prototype.address = function () {
                    var address;
                    try {
                        address = JSON.parse(localStorage.getItem('address') || '{}');
                        $('.data-address .address').html(address.address.split(',')[0]);
                    }
                    catch (error) {
                        localStorage.removeItem('address');
                        address = {};
                    }
                };
                Util.prototype.showDetailOrder = function () {
                    var _this = this;
                    $('button.payment--wompi').each(function (_i, el) {
                        wompi_1.Wompi.btn(_this.getApi, $(el));
                    });
                    $('button.payment--file').on('click', function (event) {
                        var $el = $(event.currentTarget);
                        var payment = $el.data('payment');
                        $('#paymentFileOrder').data('page', "/usuario/pedidos/" + $el.data('id'));
                        $('#redirect').val("/usuario/pedidos/" + $el.data('orderid'));
                        $('#paymentFileOrderForm').attr('action', vars_2.Vars.urlApi + "orders/payment/" + $el.data('id'));
                        $('#paymentName').html(payment.info.name);
                        $('#paymentInstructions').html(payment.info.instructions);
                        var fields = '';
                        $.each(payment.fields, function (i, v) {
                            fields += "<div>" + payment.info.fields[i].label + ": <b>" + v.value + "</b></div>";
                        });
                        $('#paymentFields').html(fields);
                        sclib.modalShow('#paymentFileOrder');
                    });
                    $('.btn-cancel').on('click', function () {
                        sclib.modalShow('#cancelOrder');
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
System.register("page", ["./libs/define", "libs/userUtil", "libs/cart_count"], function (exports_8, context_8) {
    "use strict";
    var userUtil_1, cart_count_1;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (_5) {
            },
            function (userUtil_1_1) {
                userUtil_1 = userUtil_1_1;
            },
            function (cart_count_1_1) {
                cart_count_1 = cart_count_1_1;
            }
        ],
        execute: function () {
            new userUtil_1.Util();
            new cart_count_1.CartCount();
        }
    };
});
System.active();
