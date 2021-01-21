/* eslint-disable no-param-reassign */
const schema = new mongoose.Schema({
  title: {
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
  client.del('__multimedias__');
  next();
}
schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}multimedias`, schema);

module.exports = Model;
