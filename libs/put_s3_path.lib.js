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
      sizes.original = `${appCnf.url.static}${pathImg}/original.jpg`;
      return sizes;
    });
  });
};

exports.putS3LogoPath = (stores) => {
  _.each(stores, (store) => {
    store.url = appCnf.site.url + store.slug;
    if (!store.images) {
      return;
    }
    store.imageSizes = {};
    _.each(store.images, (image, key) => {
      const sizes = {};
      const pathImg = `tenancy/${appCnf.tenancy}/ecommerce/${appCnf.s3.folder}/${store._id}/images/${key}`;

      _.each(global.storeImageSizes[key], (is) => {
        sizes[`${is.x}x${is.y}_jpg`] = `${appCnf.url.static}${pathImg}/${is.x}x${is.y}.jpg?v=${image}`;
      });

      _.each(global.storeImageSizes[key], (is) => {
        sizes[`${is.x}x${is.y}_webp`] = `${appCnf.url.static}${pathImg}/${is.x}x${is.y}.webp?v=${image}`;
      });
      sizes.original = `${appCnf.url.static}${pathImg}/original.jpg`;
      store.imageSizes[key] = sizes;
    });
  });
};
