const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}users`,
    index: true,
  },
  token: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },
  ssid: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },
  name: String,
  version: String,
  os: String,
  ip: String,
  userAgent: String,
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__session__${result._id}`);
  next();
}
schema.post('validate', preUpdate);

const Model = mongoose.model(`${appCnf.dbPrefix}sessions`, schema);

module.exports = Model;
