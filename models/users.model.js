/* eslint-disable no-param-reassign */
const bcrypt = require('bcrypt-nodejs');

function hash(obj, key) {
  return new Promise((resolve, reject) => {
    if (!obj[key]) {
      resolve();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      bcrypt.hash(obj[key], salt, null, (errh, hashh) => {
        if (errh) {
          return reject(errh);
        }
        obj[key] = hashh;
        resolve();
      });
    });
  });
}

function preUpdate(result, next) {
  client.del(`__user__${result._id}`);
  if (_.get(result, 'personalInfo.firstname') && _.get(result, 'personalInfo.lastname')) {
    result.personalInfo.name = `${_.trim(result.personalInfo.firstname)} ${_.trim(result.personalInfo.lastname)}`;
  }
  if (_.get(result, 'personalInfo.callsign') && _.get(result, 'personalInfo.cellphone')) {
    result.personalInfo.allCellphone = `${_.trim(result.personalInfo.callsign)}${_.trim(result.personalInfo.cellphone)}`;
  }
  if (!this.isModified('password') && !this.isNew) {
    return next();
  }
  Promise.all(['password', 'passwordTemp'].map((field) => hash(result, field))).then(() => next(), (err) => next(err));
}

const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  emailNormalized: {
    type: String,
    trim: true,
    index: true,
    required: true,
    validate: {
      validator(v) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  passwordTemp: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    index: true,
    default: true,
  },
  admin: {
    type: Boolean,
    index: true,
    default: false,
  },
  adminStore: {
    type: Boolean,
    index: true,
    default: false,
  },
  bank: {
    name: {
      type: String,
      trim: true,
    },
    nameBank: {
      type: String,
      trim: true,
    },
    number: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    idType: {
      type: String,
      trim: true,
    },
    id: {
      type: String,
      trim: true,
    },
    fileCheck: {
      type: Boolean,
    },
    file: {
      type: String,
      trim: true,
    },
    mime: {
      type: String,
      trim: true,
    },
    rejectMsg: {
      type: String,
      trim: true,
    },
  },
  personalInfo: {
    firstname: {
      type: String,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    callsign: {
      type: String,
      trim: true,
    },
    cellphone: {
      type: String,
      trim: true,
    },
    allCellphone: {
      type: String,
      trim: true,
    },
  },
  acceptance: {
    tycc: {
      date: Date,
      check: Boolean,
    },
    tycv: {
      date: Date,
      check: Boolean,
    },
    pptd: {
      date: Date,
      check: Boolean,
    },
    adult: {
      date: Date,
      check: Boolean,
    },
  },
  check: {
    email: {
      key: String,
      date: Date,
      result: {
        type: Boolean,
        default: false,
      },
    },
    cellphone: {
      key: String,
      date: Date,
      result: {
        type: Boolean,
        default: false,
      },
    },
    bank: {
      date: Date,
      result: {
        type: Boolean,
        default: false,
      },
    },
  },
  options: {
    storeSelect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${appCnf.dbPrefix}stores`,
    },
  },
}, { timestamps: true });

schema.post('validate', preUpdate);
schema.index({ tenancy: 1, emailNormalized: 1 }, { unique: true });
const Model = mongoose.model(`${appCnf.dbPrefix}users`, schema);

module.exports = Model;
