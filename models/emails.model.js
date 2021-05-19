const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}users`,
    index: true,
  },
  template: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  error: {
    type: Boolean,
    defauly: false,
  },
  s3: {},
}, { timestamps: true });
const Model = mongoose.model(`${appCnf.dbPrefix}emails`, schema);

module.exports = Model;
