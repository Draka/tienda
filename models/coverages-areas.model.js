/* eslint-disable no-param-reassign */
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
  price: {
    type: Number,
    default: 0,
  },
  points: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__tenancy:${result.tenancy}__coverages-areas__${result.storeID}`);
  client.del(`__tenancy:${result.tenancy}__coverage-area__${result._id}`);
  next();
}
schema.post('validate', preUpdate);

const Model = mongoose.model(`${appCnf.dbPrefix}coverages-areas`, schema);

module.exports = Model;
