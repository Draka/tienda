declare let WidgetCheckout: any;

export class Wompi {
  static key = 'pub_test_Utcl6o6rEhg8FHIhmI37vLFI16EjGSCc';

  static btn(obj: any) {
    const order = obj.data('order');
    if (!order.ref) {
      return;
    }
    obj.on('click', (event: any) => {
      event.stopPropagation();
      const checkout = new WidgetCheckout({
        currency: 'COP',
        amountInCents: order.total * 100,
        reference: `${order.ref}`,
        publicKey: Wompi.key,
      });
      checkout.open((result: any) => {
        setTimeout(() => {
          document.location.href = window.location.origin + window.location.pathname;
        }, 3000);
      });
    });
  }
}
