/* eslint-disable no-param-reassign */
const schema = new mongoose.Schema({
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${config.dbPrefix}stores`,
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
  points: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__coverages-areas__${result.storeID}`);
  client.del(`__coverage-area__${result._id}`);
  next();
}
schema.post('validate', preUpdate);

const Model = mongoose.model(`${config.dbPrefix}coverages-areas`, schema);

module.exports = Model;
