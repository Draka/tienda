const schema = new mongoose.Schema({
  input: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });
const Model = mongoose.model(`${config.dbPrefix}addresses`, schema);

module.exports = Model;
