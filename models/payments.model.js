const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}orders`,
    index: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}users`,
    index: true,
  },
  reference: {
    type: String,
    unique: true,
  },
  amount: {
    type: Number,
  },
  // estado pago
  status: {
    type: String,
    index: true,
    enum: ['created', 'approved', 'declined', 'voided', 'error'],
    default: 'created',
  },
  transaction: {},
  sentAt: {
    type: Date,
  },
  file: {
    type: String,
    trim: true,
  },
  fileCheck: {
    type: Boolean,
  },
  mime: {
    type: String,
    trim: true,
  },
  rejectMsg: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

const Model = mongoose.model(`${appCnf.dbPrefix}payments`, schema);

module.exports = Model;
/*

 {
    "id": "13203-1594104718-91112",
    "created_at": "2020-07-07T06:51:58.152Z",
    "amount_in_cents": 2050000,
    "reference": "mascarillas_12083_1",
    "currency": "COP",
    "payment_method_type": "CARD",
    "payment_method": {
      "type": "CARD",
      "extra": {
        "name": "VISA-4242",
        "brand": "VISA",
        "last_four": "4242"
      },
      "installments": 1
    },
    "redirect_url": null,
    "status": "APPROVED",
    "status_message": null,
    "merchant": {
      "name": "p4s.co Partners for Startups",
      "legal_name": "P4S INNOVACION ABIERTA SAS",
      "contact_name": "Diana Patricia Sierra",
      "phone_number": "+573002915559",
      "logo_url": null,
      "legal_id_type": "NIT",
      "email": "diana@p4s.co",
      "legal_id": "901150237-1"
    }
  }

 */
