const schema = new mongoose.Schema({
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}stores`,
    index: true,
    required: true,
  },
  publish: {
    type: Boolean,
    index: true,
    default: false,
  },
  delete: {
    type: Boolean,
    index: true,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  inventory: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
  sku: {
    type: String,
    trim: true,
    index: true,
  },
  upc: {
    type: String,
    trim: true,
    index: true,
  },
  brandText: {
    type: String,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
  },
  longDescription: {
    type: String,
    trim: true,
  },
  imagesURLs: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    trim: true,
  }],
  imagesSizes: [],
  categoryIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}categories`,
    index: true,
  }],
  categoryText: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  features: [{
    name: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    value: {
      type: String,
      trim: true,
    },
  }],
  export: {
    type: Date,
  },
  digital: {
    is: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      trim: true,
    },
  },
  available: {
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
  },
  groups: [{
    name: {
      type: String,
      trim: true,
    },
    products: [
      {
        meta: {
          type: String,
          trim: true,
        },
        aux: {
          type: String,
          trim: true,
        },
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: `${appCnf.dbPrefix}products`,
        },
      },
    ],
  }],
  fix: {
    type: Number,
    default: 1,
  },
  // Medidas para los paquetes
  // peso en gramos
  weight: {
    type: Number,
    default: 0,
    required: true,
  },
  // medidas en centimetros
  length: {
    type: Number,
    default: 0,
    required: true,
  },
  height: {
    type: Number,
    default: 0,
    required: true,
  },
  width: {
    type: Number,
    default: 0,
    required: true,
  },
  problems: {
    images: {
      alert: Boolean,
    },
    digital: {
      problem: Boolean,
    },
    dimensions: {
      problem: Boolean,
    },
  },
  amz: {
    url: {
      type: String,
      trim: true,
    },
    incPrice: {
      type: Number,
    },
    incWeight: {
      type: Number,
    },
    incDimensions: {
      type: Number,
    },
    trm: {
      type: Number,
    },
    usd: {
      type: Number,
    },
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__product__${result._id}`);
  if (result.sku) {
    client.del(`__product__${result.storeID}__${result.sku}`);
  }
  if (result.name) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  if (result.sku) {
    result.sku = _.kebabCase(_.deburr(_.get(result, 'sku')));
  }
  if (result.features) {
    result.features.forEach((e) => {
      e.slug = _.kebabCase(_.deburr(e.name));
    });
  }
  // if (result.problems.digital.problem) {
  //   result.publish = false;
  // }
  // if (result.problems.dimensions.problem) {
  //   result.publish = false;
  // }
  next();
}
schema.post('validate', preUpdate);

schema.index({ storeID: 1, sku: 1 }, { unique: true });

const Model = mongoose.model(`${appCnf.dbPrefix}products`, schema);

module.exports = Model;
