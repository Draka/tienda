/* eslint-disable no-param-reassign */
const schema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}users`,
    index: true,
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
  description: {
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
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del('__stores__');
  client.del(`__store__${result._id}`);
  if (result.slug) {
    result.slug = _.kebabCase(_.deburr(result.slug));
    client.del(`__store__${result.slug}`);
  }
  if (result.name && !result.slug) {
    result.slug = _.kebabCase(_.deburr(result.name));
  }
  next();
}
schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}stores`, schema);

module.exports = Model;
