declare let WidgetCheckout: any;

export class Wompi {
  static key = 'pub_test_Utcl6o6rEhg8FHIhmI37vLFI16EjGSCc';

  static btn(obj: any, order: any) {
    if (!order.ref || !order.ref.reference) {
      return;
    }
    obj.click((event: any) => {
      event.stopPropagation();
      const checkout = new WidgetCheckout({
        currency: 'COP',
        amountInCents: order.order.total * 100,
        reference: `${order.ref.reference}`,
        publicKey: Wompi.key
      });
      checkout.open((result: any) => {
        setTimeout(() => {
          document.location.href = window.location.origin + window.location.pathname;
        }, 3000);
      });
    });
  }
}
