mongoose.set('useFindAndModify', false);

const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}stores`,
    index: true,
    required: true,
  },
  store: {
    slug: String,
    name: String,
    images: {
      logo: {
        type: String,
        trim: true,
      },
    },
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}users`,
    index: true,
  },
  // estado orden
  status: {
    type: String,
    index: true,
    enum: ['created', 'verifying', 'rejected', 'paid', 'cancelled', 'cancelledAdmin', 'picking', 'ready', 'onway', 'arrived', 'missing', 'completed'],
    default: 'created',
  },
  statuses: [{
    date: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ['created', 'verifying', 'rejected', 'paid', 'cancelled', 'cancelledAdmin', 'picking', 'ready', 'onway', 'arrived', 'missing', 'completed'],
      default: 'created',
    },
    reason: {
      type: String,
      trim: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${appCnf.dbPrefix}users`,
    },
  }],
  // Id del navegador, para evitar una misma orden varias veces
  browserUUID: {
    type: String,
    trim: true,
    required: true,
  },
  // Id amigable para que se pueda copiar
  orderID: {
    type: Number,
    index: {
      unique: true,
    },
  },
  userData: {
    firstname: {
      type: String,
      trim: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    cellphone: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
  },
  products: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${appCnf.dbPrefix}products`,
      index: true,
    },
    imagesSizes: [],
    sku: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
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
    price: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
  }],
  order: {
    items: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  delivery: {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    personalDelivery: {
      type: Boolean,
    },
  },
  payment: {
    name: {
      type: String,
    },
    slug: {
      type: String,
    },
    pse: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    trust: {
      type: String,
    },
    fields: [{
      slug: {
        type: String,
        trim: true,
      },
      value: {
        type: String,
        trim: true,
      },
    }],
    fileCheck: {
      type: Boolean,
    },
    file: {
      type: String,
      trim: true,
    },
    mime: {
      type: String,
      trim: true,
    },
    rejectMsg: {
      type: String,
      trim: true,
    },
  },
  address: {
    address: {
      type: String,
      trim: true,
    },
    cellphone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    neighborhood: {
      type: String,
      trim: true,
    },
    extra: {
      type: String,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
    },
  },
}, { timestamps: true });

function preSave(next) {
  const doc = this;
  if (this.isNew) {
    models.Inc.findOneAndUpdate({ id: 'orderID' }, { $inc: { seq: 1 } }, (error, inc) => {
      if (error) {
        return next(error);
      }
      if (!inc) {
        const inc = new models.Inc({ id: 'orderID', seq: 101 });
        inc.save((error) => {
          if (error) {
            return next(error);
          }
          doc.orderID = 100;
          next();
        });
      } else {
        doc.orderID = inc.seq;
        next();
      }
    });
  } else {
    next();
  }
}
schema.pre('save', preSave);

schema.index({ browserUUID: 1, storeID: 1 }, { unique: true });
schema.index({ tenancy: 1, orderID: 1 }, { unique: true });

const Model = mongoose.model(`${appCnf.dbPrefix}orders`, schema);

module.exports = Model;
