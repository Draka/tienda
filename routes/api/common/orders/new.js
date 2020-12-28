const geolib = require('geolib');
const validateProducts = require('../../../../libs/validate_products.lib');
const queryStore = require('../../../../libs/query_store.lib');

module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['stores', 'address', 'cartID']);

  async.auto({
    validate: (cb) => {
      if (!body.cartID) {
        errors.push({ field: 'cartID', msg: __('Carrito de compras inválido, intente recargar la página.') });
      }

      const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!re.test(body.cartID)) {
        errors.push({ code: 1001, field: 'cartID', msg: __('Identificador de Carrito de compras inválido, intente recargar la página.') });
      }
      let cartEmpty = true;
      _.each(body.stores, (store, i) => {
        // const schedule = (store.schedule || '').split(',');
        // if (schedule.length !== 2) {
        //   errors.push({ field: 'schedule', msg: __('Seleccione una fecha de entrega válida.') });
        // }

        if (store.cart && Object.keys(store.cart).length) {
          cartEmpty = false;
        } else {
          delete body.stores[i];
        }
      });

      if (cartEmpty) {
        errors.push({ field: 'cart', msg: __('El carrito de compras esta vacio.') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    orders: ['validate', (_results, cb) => {
      async.mapValues(body.stores, (store, slug, cb) => {
        async.auto({
          store: (cb) => {
            queryStore.storeBySlug(slug, cb);
          },
          delivery: ['store', (results, cb) => {
            if (!results.store) {
              errors.push({ field: 'store', msg: __('No existe la tienda o esta desactivada') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            const d = results.store.deliveries.find((d) => d.slug === store.shipping && d.active);
            if (!d) {
              errors.push({ field: 'delivery', msg: __('No existe el Método de Envío o esta desactivado') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            const delivery = _.find(global.deliveries, { slug: d.slug });
            cb(null, {
              slug: delivery.slug,
              active: _.get(d, 'active') || false,
              name: delivery.name,
              description: delivery.description,
              payments: delivery.payments,
              value: _.get(d, 'value') || 0,
              personalDelivery: delivery.personalDelivery,
            });
          }],
          payment: ['store', (results, cb) => {
            const p = results.store.payments.find((d) => d.slug === store.payment && d.active);
            if (!p) {
              errors.push({ field: 'delivery', msg: __('No existe el Método de Pago o esta desactivada') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            const d = global.deliveries.find((d) => d.slug === store.shipping);
            if (!d || d.payments.indexOf(p.slug) === -1) {
              errors.push({ field: 'delivery', msg: __('No existe el Método de Pago o esta desactivada') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            const payment = _.find(global.payments, { slug: p.slug });
            cb(null, {
              slug: payment.slug,
              active: _.get(d, 'active') || false,
              name: payment.name,
              description: payment.description,
            });
          }],
          coveragesAreas: ['delivery', 'payment', (results, cb) => {
            if (results.delivery && results.delivery.personalDelivery) {
              queryStore.coveragesAreas(results.store._id, cb);
            } else {
              return cb(null, []);
            }
          }],
          range: ['coveragesAreas', (results, cb) => {
            if (results.delivery && !results.delivery.personalDelivery) {
              return cb(null, false);
            }
            if (results.delivery && results.delivery.personalDelivery && !results.coveragesAreas.length) {
              errors.push({ field: 'delivery', msg: __('No puede atender su solicitud, elija otro medio de entrega') });
              // TODO: Enviar mensaje correo que la configuración tienda esta mal
              return cb(listErrors(400, null, errors));
            }
            const latitude = _.get(req.body, 'address.location.lat');
            const longitude = _.get(req.body, 'address.location.lng');
            if (!latitude || !longitude) {
              errors.push({ field: 'delivery', msg: __('No se puede encontrar la dirección de envío, Latitud y Longitud para este tipo de entrega') });
              // TODO: Enviar mensaje correo que la configuración tienda esta mal
              return cb(listErrors(400, null, errors));
            }
            async.mapLimit(results.coveragesAreas, 5, (area, cb) => {
              const inArea = geolib.isPointInPolygon(
                {
                  latitude,
                  longitude,
                },
                area.points.map((point) => ({
                  latitude: point.lat,
                  longitude: point.lng,
                })),
              );
              cb(null, inArea);
            }, (_err, results) => {
              if (results.lastIndexOf(true) === -1) {
                errors.push({ field: 'delivery', msg: __('No puede atender su solicitud por estar fuera de su covertura') });
                return cb(listErrors(400, null, errors));
              }
              cb(null, true);
            });
          }],
          // busca que el uuid no este
          findUUIDOrders: ['delivery', (results, cb) => {
            models.Order
              .countDocuments({
                browserUUID: body.cartID,
                storeID: results.store._id,
              })
              .exec(cb);
          }],
          checkUUID: ['findUUIDOrders', (results, cb) => {
            if (results.findUUIDOrders) {
              errors.push({ field: 'activeOrders', code: 1002, msg: __('Este carrito de compras ya se ha procesado.') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            cb();
          }],
          validateProducts: ['store', (results, cb) => {
            validateProducts(results.store, store.cart, cb);
          }],
          checkProducts: ['validateProducts', (results, cb) => {
            store.cart = results.validateProducts.items;
            if (results.validateProducts.noActives.length || results.validateProducts.changePrice.length) {
              errors.push({
                code: 1000, store: slug, field: 'products', msg: __('Algunos productos no se encuentran disponibles en la tienda seleccionada, se ha actualizado el carrito'),
              });
              return cb(listErrors(400, null, errors));
            }
            cb();
          }],
        }, cb);
      }, cb);
    }],
    save: ['orders', (results, cb) => {
      async.map(results.orders, (order, cb) => {
        const items = _.values(order.validateProducts.items);

        const orderDoc = {
          storeID: order.store._id,
          store: {
            slug: order.store.slug,
            name: order.store.name,
            image: order.store.image,
          },
          // Id del navegador, para evitar una misma orden varias veces
          browserUUID: body.cartID,
          userID: req.user._id,
          userData: {
            name: req.user.personalInfo.name,
            cellphone: `${req.user.personalInfo.callsign}${req.user.personalInfo.cellphone}`,
            firstname: req.user.personalInfo.firstname,
            lastname: req.user.personalInfo.lastname,
            email: req.user.email,
          },
          products: items,
          order: {
            items: items.length,
            subtotal: _.sumBy(items, (o) => o.price * o.quantity),
            shipping: order.delivery.value,
            total: (_.sumBy(items, (o) => o.price * o.quantity) + order.delivery.value),
          },
          delivery: {
            name: order.delivery.name,
            slug: order.delivery.slug,
            personalDelivery: order.delivery.personalDelivery,
          },
          payment: {
            name: order.payment.name,
            slug: order.payment.slug,
          },
          statuses: [{ status: 'created' }],
        };
        if (orderDoc.payment.slug === 'contra-entrega' || orderDoc.total <= 0) {
          orderDoc.payment.pse = false;
        } else {
          orderDoc.payment.pse = true;
        }

        if (body.address && body.address.address) {
          orderDoc.address = {
            address: body.address.address,
            cellphone: `${req.user.personalInfo.callsign}${req.user.personalInfo.cellphone}`,
            city: body.address.city,
            neighborhood: _.get(_.find(body.address.form, { name: 'neighborhood' }), 'value'),
            extra: body.extra,
            location: {
              type: 'Point',
              coordinates: [_.get(body, 'address.location.lng') || 0, _.get(body, 'address.location.lat') || 0],
            },
          };
        }
        // Si el tipo de pago es contraentrega
        if (!orderDoc.payment.pse) {
          orderDoc.status = 'picking';
          orderDoc.statuses.push({ status: 'picking' });
        }
        const xorder = new models.Order(orderDoc);
        xorder.save(cb);
      }, cb);
    }],
  }, (err, results) => {
    // console.log(JSON.stringify(results));
    if (err) {
      return next(err);
    }
    res.status(201).send({ orderIDs: _.map(results.save, (o) => o.orderID).join(','), orders: results.save });
  });
};
