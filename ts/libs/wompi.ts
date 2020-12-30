declare let WidgetCheckout: any;

export class Wompi {
  static key = 'pub_test_Utcl6o6rEhg8FHIhmI37vLFI16EjGSCc';

  static btn(getApi, obj: any) {
    obj.on('click', (event: any) => {
      const order = obj.data('order');
      if (!order) {
        return;
      }
      getApi.g(`orders/ref/${order}`)
        .done((data: any) => {
          event.stopPropagation();
          const checkout = new WidgetCheckout({
            currency: 'COP',
            amountInCents: data.amount * 100,
            reference: `${data.reference}`,
            publicKey: Wompi.key,
          });
          checkout.open(() => {
            setTimeout(() => {
              document.location.href = window.location.origin + window.location.pathname;
            }, 3000);
          });
        });
    });
  }
}
