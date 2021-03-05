export class Amz {
  // genera sku aleatorio

  static makeStr(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static makeNumber(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static putName(data) {
    $('#name').val(data.title);
    $('#shortDescription').val(data.title);

    $('#amzUrl').val($('#url').val());
    $('#amzTrm').val(data.trm);
    $('#amzUsd').val(data.price);

    $('#weight').val(data.weight);
    $('#length').val(data.dimensions[0]);
    $('#height').val(data.dimensions[1]);
    $('#width').val(data.dimensions[2]);

    $('#sku').val(`${Amz.makeStr(5)}-${Amz.makeNumber(3)}`);
    $('#brandText').val(data.brandText);
    $('#urlFiles').val(data.images.join('\n'));
    $('#inventory').val('1');
    $('#stock').val(2);

    window.ckeditors[0].setData(data.longDescription);
    $('#amzUsd').trigger('change');
  }

  static actions() {
    $('#weight,#length,#height,#width,#amzIncPrice,#amzIncWeight,#amzIncDimensions,#amzUsd').on('change', () => {
      const trm = parseFloat(<string>$('#amzTrm').val());
      const usd = parseFloat(<string>$('#amzUsd').val());
      const incPrice = parseFloat(<string>$('#amzIncPrice').val());
      const incW = parseFloat(<string>$('#amzIncWeight').val());
      const incD = parseFloat(<string>$('#amzIncDimensions').val());
      const we = parseFloat(<string>$('#weight').val());
      const l = parseFloat(<string>$('#length').val());
      const h = parseFloat(<string>$('#height').val());
      const w = parseFloat(<string>$('#width').val());

      const pcop = (usd * trm) * (incPrice / 100 + 1);
      const pw = incW * Math.ceil(we / 454);
      const pd = ((l * h * w) / 1000) * incD;

      const price = Math.ceil((pcop + pw + pd) / 1000) * 1000;
      $('#price').val(price);
    });
  }
}
