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
System.register("libs/gtag", ["../util/products.d"], function (exports_1, context_1) {
    "use strict";
    var Gtag;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (_1) {
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
            exports_1("Gtag", Gtag);
        }
    };
});
System.register("libs/cart_count", ["../util/products.d", "libs/gtag"], function (exports_2, context_2) {
    "use strict";
    var gtag_1, CartCount;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (_2) {
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
            exports_2("CartCount", CartCount);
        }
    };
});
System.register("libs/vars", ["../util/products.d"], function (exports_3, context_3) {
    "use strict";
    var Vars;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (_3) {
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
            function (_4) {
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
            exports_4("GetApi", GetApi);
        }
    };
});
System.register("libs/show_msg", ["libs/cart"], function (exports_5, context_5) {
    "use strict";
    var cart_1, ShowMsg;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (cart_1_1) {
                cart_1 = cart_1_1;
            }
        ],
        execute: function () {
            ShowMsg = /** @class */ (function () {
                function ShowMsg() {
                }
                // Muestra los errores del back
                ShowMsg.show = function (errors, alert) {
                    if (alert === void 0) { alert = 'secondary'; }
                    var timeShow = 5000;
                    var em = $('.error-modal');
                    if (!em.length) {
                        em = $('<div class="error-modal fixed ab-0 w-100 p-1">').hide();
                        $('body').append(em);
                    }
                    em.show();
                    if (errors.responseJSON && errors.responseJSON.values) {
                        errors = errors.responseJSON.values;
                    }
                    $.each(errors, function (_i, error) {
                        // error de los productos del carro, se pide actualizar
                        if (error.code === 1000) {
                            // cart.check();
                        }
                        // id de carro de compras dañado
                        if (error.code === 1001) {
                            cart_1.Cart.updateUUID();
                        }
                        // id de carro de compras procesado
                        if (error.code === 1002) {
                            cart_1.Cart.reset();
                            setTimeout(function () {
                                document.location.href = window.location.origin + window.location.pathname;
                            }, timeShow);
                        }
                        var msg = $("<div class=\"msg " + alert + " p-1 trn-3 op-0\">");
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
            exports_5("ShowMsg", ShowMsg);
        }
    };
});
System.register("libs/product", ["libs/vars", "libs/gtag", "libs/cart"], function (exports_6, context_6) {
    "use strict";
    var vars_2, gtag_2, cart_2, Product;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (vars_2_1) {
                vars_2 = vars_2_1;
            },
            function (gtag_2_1) {
                gtag_2 = gtag_2_1;
            },
            function (cart_2_1) {
                cart_2 = cart_2_1;
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
                        + ("<a href=\"/" + vars_2.Vars.store + "/productos/" + product.sku + "\">" + Product.img(product) + "</a>")) + (product.brandText ? "<div class=\"t-white-700 small mb-1\">" + product.brandText + "</div>" : '') + "<div class=\"t-primary tc b small\">" + product.name + "</div>"
                        + ("<div class=\"t-secondary b big\">" + vars_2.Vars.formatMoney(product.price) + "</div>")
                        + ("<div class=\"t-action small mb-4\">" + msg + "</div>")
                        + '<div class="absolute w-100c2 ab-1">'
                        + '<button class="secondary w-100 add"><i class="fas fa-cart-plus"></i> Agregar</button>'
                        + '</div>'
                        + '</div>'
                        + '</div>');
                    productHTML.find('.add').click(function (event) {
                        var cart = new cart_2.Cart();
                        cart.add(product.sku, list, product.store);
                    });
                    productHTML.find('a').click(function (event) { return gtag.clickItem($(event.currentTarget), product, pos, list); });
                    return productHTML;
                };
                return Product;
            }());
            exports_6("Product", Product);
        }
    };
});
/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */
System.register("libs/cart", ["libs/vars", "libs/get_api", "libs/gtag", "libs/cart_count", "libs/show_msg", "libs/product", "libs/cart_list"], function (exports_7, context_7) {
    "use strict";
    var vars_3, get_api_1, gtag_3, cart_count_1, show_msg_1, product_1, cart_list_1, Cart;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (vars_3_1) {
                vars_3 = vars_3_1;
            },
            function (get_api_1_1) {
                get_api_1 = get_api_1_1;
            },
            function (gtag_3_1) {
                gtag_3 = gtag_3_1;
            },
            function (cart_count_1_1) {
                cart_count_1 = cart_count_1_1;
            },
            function (show_msg_1_1) {
                show_msg_1 = show_msg_1_1;
            },
            function (product_1_1) {
                product_1 = product_1_1;
            },
            function (cart_list_1_1) {
                cart_list_1 = cart_list_1_1;
            }
        ],
        execute: function () {/* eslint-disable no-mixed-operators */
            /* eslint-disable no-bitwise */
            Cart = /** @class */ (function () {
                function Cart() {
                    this.getApi = new get_api_1.GetApi('');
                    this.cartCount = new cart_count_1.CartCount();
                    this.gtag = new gtag_3.Gtag();
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
                        if (vars_3.Vars.place) {
                            url = "products/" + sku + "?place=" + vars_3.Vars.place;
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
                    return "<div class=\"flex mt-1\"><div class=\"mr-1\">" + product_1.Product.imgNow(product, ['48x48', '96x96']) + "</div><div>" + product.name + "</div></div>";
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
                                show_msg_1.ShowMsg.show([
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
                                show_msg_1.ShowMsg.show([
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
                                show_msg_1.ShowMsg.show([
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
                    $('.cart-subtotal').html("" + vars_3.Vars.formatMoney(subtotal));
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
                    if (store === void 0) { store = vars_3.Vars.store; }
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
            exports_7("Cart", Cart);
        }
    };
});
System.register("libs/session", [], function (exports_8, context_8) {
    "use strict";
    var Session;
    var __moduleName = context_8 && context_8.id;
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
            exports_8("Session", Session);
        }
    };
});
System.register("libs/cart_list", ["libs/cart", "libs/product", "libs/vars", "libs/get_api", "libs/session", "libs/gtag", "libs/show_msg"], function (exports_9, context_9) {
    "use strict";
    var cart_3, product_2, vars_4, get_api_2, session_1, gtag_4, show_msg_2, CartList;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (cart_3_1) {
                cart_3 = cart_3_1;
            },
            function (product_2_1) {
                product_2 = product_2_1;
            },
            function (vars_4_1) {
                vars_4 = vars_4_1;
            },
            function (get_api_2_1) {
                get_api_2 = get_api_2_1;
            },
            function (session_1_1) {
                session_1 = session_1_1;
            },
            function (gtag_4_1) {
                gtag_4 = gtag_4_1;
            },
            function (show_msg_2_1) {
                show_msg_2 = show_msg_2_1;
            }
        ],
        execute: function () {
            CartList = /** @class */ (function () {
                function CartList() {
                    this.cart = new cart_3.Cart();
                    this.gtag = new gtag_4.Gtag();
                    this.session = new session_1.Session();
                    this.paymentsMethods = {};
                    this.sum = { subtotal: 0, shipping: 0, total: 0 };
                    this.session = new session_1.Session();
                    this.getApi = new get_api_2.GetApi(this.session.token);
                }
                CartList.prototype.putTotals = function () {
                    var _this = this;
                    // Valor del sub total
                    $('.cart-subtotal').html(vars_4.Vars.formatMoney(this.sum.subtotal));
                    // Valor del sub total
                    this.sum.shipping = 0;
                    $.each(this.cart.stores, function (i) {
                        var val = parseFloat($("input[name=\"shipping-methods-" + i + "\"]:checked").data('price'));
                        if (val) {
                            _this.sum.shipping += val;
                        }
                    });
                    $('.cart-shipping').html(vars_4.Vars.formatMoney(this.sum.shipping));
                    // Valor del sub total
                    this.sum.total = this.sum.subtotal + this.sum.shipping;
                    $('.cart-total').html(vars_4.Vars.formatMoney(this.sum.total));
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
                                var lineStore = $("<div id=\"cart_" + slug + "\" class=\"mb-5\">")
                                    .append("<div class=\"title\">Pedido de: " + elem.name + "</div>");
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
                                    var img = product_2.Product.img(product, ['48x48', '96x96']);
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
                                        + ("<td class=\"tr\">" + vars_4.Vars.formatMoney(product.price) + "</td>"))
                                        .append($('<td class="tr">').append(controls.clone(true, true)))
                                        .append("<td class=\"tr t-secondary b\">" + vars_4.Vars.formatMoney(product.quantity * product.price) + "</td>"));
                                    // Mobile
                                    mobile_1
                                        .append($('<table class="table table--striped small">')
                                        .append("<tr><th class=\"h-img-48\">" + img + "</th><td class=\"b big\">" + product.name + "</td></tr>")
                                        .append($('<tr>')
                                        .append("<th class=\"b\">PRECIO</th><td class=\"t-secondary tr\">" + vars_4.Vars.formatMoney(product.price) + "</td>"))
                                        .append($('<tr>')
                                        .append('<th class="b">CANTIDAD</th>')
                                        .append($('<td>').append(controls.clone(true, true))))
                                        .append($('<tr>')
                                        .append("<th class=\"b\">SUBTOTAL</th><td class=\"t-secondary tr b\">" + vars_4.Vars.formatMoney(product.quantity * product.price) + "</td>")));
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
                                        + ("<td class=\"tr t-secondary\">" + vars_4.Vars.formatMoney(product.quantity * product.price) + "</td>");
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
                                _this.getApi.p("stores/" + i + "/services/search-shipping-methods", cart_3.Cart.getAddressJSON())
                                    .done(function (data) {
                                    var m = '';
                                    $.each(data.shippingMethods, function (k, methods) {
                                        if ((data.inArea && methods.personalDelivery) || !methods.personalDelivery) {
                                            m += "<div class=\"mt-1 mb-1 ml-1 small\"><label data-payments='" + JSON.stringify(methods.payments) + "'>"
                                                + ("<input id=\"r-shipping-methods-" + i + "-" + k + "\" type=\"radio\" class=\"radio\" name=\"shipping-methods-" + i + "\" ")
                                                + ("value=\"" + methods.slug + "\" data-price=\"" + methods.price + "\" " + (k === 0 ? 'checked="checked"' : '') + ">")
                                                + ("<span>" + methods.name + "</span> - <span class=\"t-secondary\">" + vars_4.Vars.formatMoney(methods.price) + "</span></label>")
                                                + ("<div class=\"remark\">" + methods.description + "</div>")
                                                + '</div>';
                                        }
                                    });
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
                        var address = cart_3.Cart.getAddressJSON();
                        if (_this.checkAddress() && !address.address) {
                            return sclib.modalShow('#address');
                        }
                        var errors = [];
                        $('.errors-cart2').html('');
                        $.each(_this.cart.stores, function (i, store) {
                            if (Object.keys(store.cart).length === 0) {
                                return;
                            }
                            if (!$("input[name=\"shipping-methods-" + i + "\"]:checked").val()) {
                                errors.push("Seleccione el M\u00E9todo de Env\u00EDo para <b>" + store.name + "</b>");
                            }
                            _this.cart.stores[i].shipping = $("input[name=\"shipping-methods-" + i + "\"]:checked").val();
                            if (!$("input[name=\"payments-methods-" + i + "\"]:checked").val()) {
                                errors.push("Seleccione el M\u00E9todo de Pago para <b>" + store.name + "</b>");
                            }
                            _this.cart.stores[i].payment = $("input[name=\"payments-methods-" + i + "\"]:checked").val();
                        });
                        // if (!$('#pptu').is(':checked')) {
                        //   errors.push('Debes aceptar <b>la Política de privacidad y los Términos de uso*</b>');
                        // }
                        if (errors.length) {
                            $.each(errors, function (i, error) {
                                $('.errors-cart2').append("<div class=\"msg error\">" + error + "</div>");
                            });
                            show_msg_2.ShowMsg.show(errors);
                            return;
                        }
                        $('.errors-cart2').hide();
                        // Manda a back
                        _this.getApi.p('orders', {
                            stores: _this.cart.stores,
                            cartID: _this.cart.getCartID(),
                            address: address,
                            pptu: $('#pptu').is(':checked'),
                        })
                            .done(function (data) {
                            cart_3.Cart.reset();
                            document.location.href = window.location.origin + "/carrito-resumen";
                        })
                            .fail(show_msg_2.ShowMsg.show);
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
System.register("cart", ["./libs/define", "libs/cart_count", "libs/cart_list", "libs/cart"], function (exports_10, context_10) {
    "use strict";
    var cart_count_2, cart_list_2, cart_4, cartList;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (_5) {
            },
            function (cart_count_2_1) {
                cart_count_2 = cart_count_2_1;
            },
            function (cart_list_2_1) {
                cart_list_2 = cart_list_2_1;
            },
            function (cart_4_1) {
                cart_4 = cart_4_1;
            }
        ],
        execute: function () {
            new cart_count_2.CartCount();
            cartList = new cart_list_2.CartList();
            cartList.showCart();
            cartList.showStepAddress();
            cartList.fixProductsInCart();
            cart_list_2.CartList.showAddresss();
            cart_4.Cart.prepareFormAddress();
        }
    };
});
System.active();
