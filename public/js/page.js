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
System.register("libs/userUtil", [], function (exports_1, context_1) {
    "use strict";
    var Util;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /* eslint-disable class-methods-use-this */
            Util = /** @class */ (function () {
                function Util() {
                    this.lazy();
                }
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
                return Util;
            }());
            exports_1("Util", Util);
        }
    };
});
System.register("page", ["./libs/define", "libs/userUtil"], function (exports_2, context_2) {
    "use strict";
    var userUtil_1;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (_1) {
            },
            function (userUtil_1_1) {
                userUtil_1 = userUtil_1_1;
            }
        ],
        execute: function () {
            new userUtil_1.Util();
        }
    };
});
System.active();
