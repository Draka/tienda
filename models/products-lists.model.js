const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  slug: {
    type: String,
    required: true,
    immutable: true,
  },
  last: {
    type: Boolean,
    default: true,
    index: true,
  },
  date: {
    type: String,
    trim: true,
    immutable: true,
  },
  dateStart: {
    type: Date,
    immutable: true,
  },
  dateEnd: {
    type: Date,
    immutable: true,
  },
  order: {
    type: Number,
    default: 0,
    immutable: true,
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}products`,
    required: true,
  },

}, { timestamps: true });

function preUpdate(result, next) {
  // Control de cache no se maneja, este modelo debe ser solo lectura
  if (result.slug) {
    result.slug = _.kebabCase(_.deburr(result.slug));
  }
  next();
}
schema.post('validate', preUpdate);

schema.index({
  tenancy: 1, slug: 1, date: 1,
});

const Model = mongoose.model(`${appCnf.dbPrefix}products-lists`, schema);

module.exports = Model;
