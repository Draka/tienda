/* eslint-disable no-param-reassign */
const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  email: {
    title: {
      type: String,
      trim: true,
    },
    emailNoreply: {
      type: String,
      trim: true,
    },
    emailInfo: {
      type: String,
      trim: true,
    },
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
  sameAs: [{
    type: String,
    trim: true,
  }],
}, { timestamps: true });

function preUpdate(result, next) {
  client.del('__site__');
  next();
}
schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}sites`, schema);

module.exports = Model;
