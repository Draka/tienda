/* eslint-disable no-param-reassign */
const { deleteKeysByPattern } = require('../libs/redis.lib');

const schema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}users`,
    index: true,
  },
  mode: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
  },
  oldSlugs: [{
    type: String,
    trim: true,
  }],
  slogan: {
    type: String,
    trim: true,
  },
  seo: {
    type: String,
    trim: true,
  },
  vision: {
    type: String,
    trim: true,
  },
  descriptionLong: {
    type: String,
    trim: true,
  },
  contacts: [{
    slug: {
      type: String,
      trim: true,
    },
    value: {
      type: String,
      trim: true,
    },
  }],
  approve: {
    type: Boolean,
    default: false,
    index: true,
  },
  amz: {
    type: Boolean,
    default: false,
  },
  showcase: {
    type: Boolean,
    default: false,
  },
  publish: {
    type: Boolean,
    default: false,
    index: true,
  },
  images: {
    logo: {
      type: String,
      trim: true,
    },
    header: {
      type: String,
      trim: true,
    },
    social: {
      type: String,
      trim: true,
    },
  },
  // defaultPlace: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: `${appCnf.dbPrefix}places`,
  //   index: true,
  // },
  inventory: {
    type: Boolean,
    default: false,
  },
  taxes: {
    type: Array,
    default: ['iva'],
  },
  // featuredCategories: [{
  //   quantity: {
  //     type: Number,
  //     default: 8,
  //   },
  //   category: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: `${appCnf.dbPrefix}categories`,
  //   },
  // }],
  deliveries: [
    {
      active: {
        type: Boolean,
        default: false,
      },
      slug: {
        type: String,
        trim: true,
      },
      value: {
        type: Number,
        default: 0,
      },
    },
  ],
  payments: [
    {
      active: {
        type: Boolean,
        default: false,
      },
      slug: {
        type: String,
        trim: true,
      },
    },
  ],
  department: {
    type: String,
    trim: true,
  },
  town: {
    type: String,
    trim: true,
  },
  primaryActivity: {
    type: String,
    trim: true,
    enum: global.activities,
    default: _.last(global.activities),
  },
  secondaryActivity: {
    type: String,
    trim: true,
  },
  problems: {
    imageLogo: {
      problem: Boolean,
    },
    seo: {
      alert: Boolean,
    },
    coveragesAreas: {
      problem: Boolean,
    },
    localDelivery: {
      problem: Boolean,
    },
    deliveries: {
      problem: Boolean,
      alert: Boolean,
    },
    localPayment: {
      problem: Boolean,
    },
    payments: {
      problem: Boolean,
    },
    categories: {
      problem: Boolean,
    },
    products: {
      problem: Boolean,
    },
    productsImage: {
      alert: Boolean,
    },
    productsDelivery: {
      alert: Boolean,
    },
  },
  messages: {
    deliveryTime: {
      type: String,
      trim: true,
    },
    rightOfWithdrawal: {
      type: String,
      trim: true,
    },
    warranty: {
      type: String,
      trim: true,
    },
  },
}, { timestamps: true });

function preUpdate(result, next) {
  deleteKeysByPattern('__store*');
  if (result.slug) {
    result.slug = _.kebabCase(_.deburr(result.slug));
  }
  if (result.name && !result.slug) {
    result.slug = _.kebabCase(_.deburr(result.name));
  }
  next();
}
schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}stores`, schema);

module.exports = Model;
