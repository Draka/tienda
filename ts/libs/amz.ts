export class Amz {
  static putName(data) {
    $('#name').val(data.title);
    $('#price').val(data.price);
    $('#amzUrl').val($('#url').val());
  }
}
