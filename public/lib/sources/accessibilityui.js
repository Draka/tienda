
//idioma de la página
var lang = $('html').attr('lang');
// evento de foco sobre los inputs
function focus(self) {
  var up = self.closest('.form-group');
  var label = up.find('label');
  label.addClass('focus');
  //up.find('fieldset legend').css('width', label.innerWidth());
}
var inputsFocus = ['datetime-local', 'date', 'time'];
$('.form-group .form-control input,.form-group .form-control textarea').each(function () {
  var _el = $(this);
  _el.after('<fieldset><legend><span>&#8203</span></legend></fieldset>');
  if (_el.val() || inputsFocus.indexOf(_el.attr('type')) >= 0) {
    focus(_el);
  }
});
$('.form-group .form-control select').each(function () {
  var _el = $(this);
  _el.after('<fieldset><legend><span>&#8203</span></legend></fieldset>');
  var up = _el.closest('.form-group');
  var label = up.find('label');
  label.addClass('select');
  // up.find('fieldset legend').css('width', label.innerWidth());
});
$('.form-group .form-control input[type="file"]').each(function () {
  var _el = $(this);
  var up = _el.closest('.form-group');
  var label = up.find('label').first();
  label.addClass('select');
  // up.find('fieldset legend').css('width', label.innerWidth());
});
$('input,textarea').on('focus', function () {
  focus($(this));
});
$('input,textarea').on('action', function () {
  var _el = $(this);
  if (_el.val() || inputsFocus.indexOf(_el.attr('type')) >= 0) {
    return;
  }
  var up = $(this).parent().parent();
  var label = up.find('label');
  label.removeClass('focus');
});
$('input,textarea').on('blur', function () {
  $(this).trigger('action');
});
//espera un rato y activa la acción


// auto heiht para textarea
$('[autoresize]').on('change drop keydown cut paste', function () {
  var _el = $(this);
  _el.height('auto');
  _el.height(_el.prop('scrollHeight'));
});
// acordiones
//expande acordiones
function initExpanse() {
  $('.expanse .expanse-root').not('.ready').addClass('ready').click(function () {
    var _el = $(this);
    _el.closest('.expanse').find('.expanse-container').slideToggle('slow', function () {
      _el.closest('.expanse').toggleClass('open');
    });

    // _el.closest('.expanse-group').find('.expanse').removeClass('open');
    // _el.closest('.expanse').addClass('open');
    // if (_el.hasClass('radio')) {
    //   _el.find('input[type="radio"]').prop('checked', true);
    // }
  });
  // evento de click en Radio, expande acordiones
  $('.expanse .expanse-root.radio input[type="radio"]').not('.ready').addClass('ready').change(function () {
    var _el = $(this);
    if (_el.is(':checked')) {
      _el.closest('.expanse-group').find('.expanse').removeClass('open');
      _el.closest('.expanse').addClass('open');
    }
  });
}
initExpanse();
//Checkbox - grupos
$('.checkbox-group label').each(function () {
  var _el = $(this);
  _el.attr('tabindex', 0).keypress(function (event) {
    if (event.which === 32) {
      _el.trigger('click');
    }
  });
});
//Checkbox - Normales
function initChecks() {
  $('.form-check,.expanse .expanse-root.radio').not('.ready').each(function () {
    var _el = $(this);
    _el.addClass('ready').attr('tabindex', 0).keypress(function (event) {
      if (event.which === 32) {
        _el.find('input[type="checkbox"],input[type="radio"]').trigger('click');
      }
    });
  });
}
initChecks();

//sidevar
$('.sidenav-action').each(function () {
  var _el = $(this);
  var _target = $(_el.data('target'));
  _el.click(function (event) {

    //_target.addClass('shownav');
    _target.attr({ 'role': 'dialog', 'aria-modal': 'true' });
    _target.fadeIn(200, function () {
      _target.addClass('shownav');
    });
    $('body').addClass('modal-open');
    event.preventDefault();
  });
  _target.click(function () {
    $('body').removeClass('modal-open');
    _target.removeClass('shownav');
    _target.fadeOut(200, function () {
    });
  });
  _target.find('.sidenav-body').click(function (event) {
    event.stopPropagation();
  });
});

//validación de formularios
$('form.validate').on('submit', function (e) {
  var errors = [];
  accessibilityUI.push(errors, accessibilityUI.validateAndError($(this).find(':input')));
  if (errors.length) {
    e.preventDefault();
    return false;
  }
  return true;
});
//validación de formularios api
$('form.validate-rest').on('submit', function (e) {
  e.preventDefault();
  var errors = [];
  var _el = $(this);
  accessibilityUI.push(errors, accessibilityUI.validateAndError(_el.find(':input')));
  if (errors.length) {
    return false;
  }
  var headers = {}, c;
  var authorization = localStorage.getItem('token');
  if (authorization) {
    headers['Authorization'] = 'bearer ' + localStorage.getItem('token');
  }
  $.getJSON({
    url: _el.attr('action'),
    method: _el.attr('method'),
    data: _el.serialize(),
    headers: headers
  }).done(function (data) {
    //ejecuta el valor de data-post
    if (_el.data('post')) {
      var dp = _el.data('post');
      if (typeof dp === 'function') {
        dp(data, function () {
          window.location.replace(_el.data('page'));
        });
        return;
      }
      var c = dp.split('.');
      if (c.length === 1) {
        window[c[0]](data, function () {
          window.location.replace(_el.data('page'));
        });
      } else if (c.length === 2) {
        window[c[0]][c[1]](data, function () {
          window.location.replace(_el.data('page'));
        });
      }
    } else {
      window.location.replace(_el.data('page'));
    }
  }).fail(function (data) {
    //ejecuta el valor de data-fnc-error
    if (_el.data('fncError')) {
      c = _el.data('fncError').split('.');
      if (c.length === 1) {
        window[c[0]](data);
      } else if (c.length === 2) {
        window[c[0]][c[1]](data);
      }
    }
    if (_el.data('error')) {
      $(_el.data('error')).html(accessibilityUI.errorsToHtml(data.responseJSON));
    }
  });
  return false;
});
//validación de inputs
$('form.validate,form.validate-rest').find(':input').on('blur', function () {
  accessibilityUI.push([], accessibilityUI.validateAndError($(this)));
});


//menus desplegables
$('.btn-menu').each(function () {
  var _this = $(this);
  var _control = $('#' + _this.attr('aria-controls'));

  _this.on('keypress', function (e) {
    if (e.which === 13 || e.which === 32) {
      _this.trigger('click');
      e.preventDefault();
    }
  });

  _control.on('keydown', function (e) {
    if (e.which === 27) {
      _this.trigger('click');
      _this.focus();
      e.preventDefault();
    }
  });

  _this.attr({
    'tabindex': 0,
    'aria-haspopup': true
  }).click(function (event) {
    if (_control.hasClass('show')) {
      _control.removeClass('show');
      _this.removeAttr('aria-expanded').removeClass('open');
    } else {
      _control.addClass('show');
      _this.attr({ 'aria-expanded': true }).addClass('open');
    }

    event.stopPropagation();
    event.preventDefault();
  });

  menuControls(_control);
});
//cierra todos los desplegables
$(document).click(function () {
  $('.btn-menu[aria-expanded="true"]').each(function () {
    var _this = $(this);
    var _control = $('#' + _this.attr('aria-controls'));
    _control.removeClass('show');
    _this.removeAttr('aria-expanded').removeClass('open');
  });
});
//Items de menús desplegables se llenan con funciones
function menuControls(_control) {
  _control.find('ul > li').attr({ 'role': 'menuitem', 'tabindex': 0, 'aria-disabled': false });
}




var accessibilityUI = {};
(function ($) {


  $.fn.hasAttr = function (name, options) {
    return this.attr(name) !== undefined || (options && options[name]);
  };

  var lang = $('html').attr('lang');
  var msgErros = {
    'es': {
      'required': 'El campo es requerido.',
      'nan': 'No es un número válido.',
      'min': 'El valor debe ser igual o mayor a %s.',
      'email': 'No es un correo válido',
      'cellphone': 'No es un número de célular válido'
    }
  };


  accessibilityUI = {
    push: function (array, val) {
      if (val && val.length > 0) {
        array.push(val);
      }
    },

    lang: function () {
      return lang;
    },
    validate: function (obj, options) {
      var val = obj.val();
      var errors = [], re;

      // obligatorio
      if (obj.hasAttr('required', options)) {
        if (val === '') {
          errors.push({ msg: 'required', value: val });
        }
      }

      // atributo mínimo o máximo => es número
      if (obj.hasAttr('min', options) || obj.hasAttr('max', options)) {
        if (isNaN(parseFloat(val))) {
          errors.push({ msg: 'nan', value: val });
        }
      }

      // valor mínimo
      if (obj.hasAttr('min', options)) {
        if (!isNaN(parseFloat(val)) && parseFloat(val) < obj.attr('min', options)) {
          errors.push({ msg: 'min', value: val });
        }
      }

      // valor máximo
      if (obj.hasAttr('max', options)) {
        if (!isNaN(parseFloat(val)) && parseFloat(val) > obj.attr('max', options)) {
          errors.push({ msg: 'max', value: val });
        }
      }

      // correo
      if (val !== '' && obj.attr('type') === 'email') {
        re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(val).toLowerCase())) {
          errors.push({ msg: 'email', value: val });
        }
      }

      // cellphone
      if (obj.hasAttr('cellphone', options)) {
        re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (!re.test(String(val).toLowerCase())) {
          errors.push({ msg: 'cellphone', value: val });
        }
      }

      return {
        obj: obj, errors: errors
      };
    },
    validateAndError: function (objs, options) {
      var _self = this;
      var errors = [];
      objs.each(function () {
        var _el = $(this);
        var r = _self.validate(_el, options);
        var fg = _el.closest('.form-group');
        fg.find('.msg-error').remove();
        if (r.errors.length) {
          fg.addClass('error').append('<span class="msg-error">' + msgErros[lang][r.errors[0].msg] + '</span>');
          errors.push(r.errors);
        }
      });
      return errors;
    },
    errorsToHtml: function (data) {
      var li = [];
      if (data) {
        $.each(data.values, function (i, item) {
          li.push('<a href="#" onclick="$(\'[name=\\\'' + item.field + '\\\']\').focus()">' + item.msg + '</a>');
        })
      } else {
        li.push('No hay conexión a internet');
      }
      return '<div class="alert alert-error">' + li.join() + '</div>';
    },
    //utilidades
    util: {
      push: function (array, val, unique) {
        if (val && val.length > 0) {
          if (unique) {
            //recorre arreglo para buscar
            for (var x in val) {
              if (val[x].unique === val.unique) {
                return;
              }
            }
          }
          array.push(val);
        }
      },
      setCookie: function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
      },
      getCookie: function (cname) {
        var name = cname + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return '';
      }
    },
    showModal: function (name) {
      $(name)
      .addClass('show')
      .fadeIn('slow')
      .find('.close-modal')
      .not('.ready')
      .click(function(){
        $(this).addClass('ready')
        accessibilityUI.hideModal(name)
      });
      var obj = $('.modal-backdrop');
      if (!obj.length) {
        obj = $('<div class="modal-backdrop">');
        $('body').append(obj);
      }
      obj.addClass('show').fadeIn('slow');
      $('body').addClass('modal-open');
      $('input,textarea').each(function () {
        focus($(this));
      });
    },
    hideModal: function (name) {
      $(name).removeClass('show').hide();
      $('.modal-backdrop').fadeOut('slow', function () { $(this).remove(); });
      $('body').removeClass('modal-open');
    },
    initExpanse: initExpanse,
    initChecks: initChecks
  };
  $('input,textarea').each(function () {
    focus($(this));
  });
})(jQuery);

$(document).ready(function () {
  setTimeout(function () {
    var text_val = $('input,textarea').val();
    $('input,textarea').each(function () {
      $(this).trigger('action');
    });

  }, 1000);
});