/* eslint-disable no-param-reassign */
const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  title: {
    type: String,
    trim: true,
  },
  alt: {
    type: String,
    trim: true,
  },
  key: {
    type: String,
    index: {
      unique: true,
    },
  },
  mime: {
    type: String,
    trim: true,
  },
  files: [String],
  sizes: [String],
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__tenancy:${result.tenancy}__multimedias__`);
  if (result.key) {
    client.del(`__tenancy:${result.tenancy}__multimedia__${result.key}`);
  }
  next();
}
schema.post('validate', preUpdate);

const Model = mongoose.model(`${appCnf.dbPrefix}multimedias`, schema);

module.exports = Model;
