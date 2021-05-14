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
  active: {
    type: Boolean,
    index: true,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
  address: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  schedule: {
    monday: [String],
    thuesday: [String],
    wednesday: [String],
    thurday: [String],
    friday: [String],
    saturday: [String],
    sunday: [String],
    holiday: [String],
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__tenancy:${result.tenancy}__place__${result._id}`);
  client.del(`__tenancy:${result.tenancy}__places__${result.storeID}`);
  if (_.get(result, 'name')) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  next();
}
schema.post('validate', preUpdate);
schema.index({ tenancy: 1, storeID: 1, slug: 1 }, { unique: true });
const Model = mongoose.model(`${appCnf.dbPrefix}places`, schema);

module.exports = Model;
