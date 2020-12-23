exports.putS3Path = (items, store) => {
  _.each(items, (o) => {
    o.imagesSizes = _.map(o.images, (i) => {
      const sizes = {};
      const pathImg = `tenancy/${appCnf.tenancy}/ecommerce/${appCnf.s3.folder}/${store._id}/products/${o._id}/${i}`;

      _.each(global.imagesSizes, (is) => {
        sizes[`${is.x}x${is.y}_jpg`] = `${appCnf.url.static}${pathImg}/${is.x}x${is.y}.jpg`;
      });

      _.each(global.imagesSizes, (is) => {
        sizes[`${is.x}x${is.y}_webp`] = `${appCnf.url.static}${pathImg}/${is.x}x${is.y}.webp`;
      });
      sizes.original = `${appCnf.url.static}${pathImg}/original`;
      return sizes;
    });
  });
};

exports.putS3LogoPath = (stores) => {
  _.each(stores, (store) => {
    if (!store.image) {
      return;
    }
    const sizes = {};
    const pathImg = `tenancy/${appCnf.tenancy}/ecommerce/${appCnf.s3.folder}/${store._id}/logo`;

    _.each(global.imagesSizes, (is) => {
      sizes[`${is.x}x${is.y}_jpg`] = `${appCnf.url.static}${pathImg}/${is.x}x${is.y}.jpg?v=${store.image}`;
    });

    _.each(global.imagesSizes, (is) => {
      sizes[`${is.x}x${is.y}_webp`] = `${appCnf.url.static}${pathImg}/${is.x}x${is.y}.webp?v=${store.image}`;
    });
    sizes.original = `${appCnf.url.static}${pathImg}/original`;
    store.imageSizes = sizes;
  });
};
