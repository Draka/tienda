interface ProducInterface {
  store: string,
  sku: string,
  name: string,
  categoryText: Array<string>,
  brandText: string,
  price: number,
  quantity: number,
  imagesSizes?: Array<any>,
  inventory?: boolean,
  stock?: number,
  digital?: {
    streaming: boolean
    msg?: string
    url?: string
  }
}
interface ProducsInterface {
  [sku: string] : ProducInterface
}

interface StoreInterface {
  shipping?: string | number | string[] | undefined;
  payment?: string | number | string[] | undefined;
  name: string
  cart: ProducsInterface
}

interface StoresInterface {
  [stores: string] : StoreInterface
}

interface GProductInterface { // Provide product details in an impressionFieldObject.
  id: string, // Product ID (string).
  name: string, // Product name (string).
  category: string, // Product category (string).
  brand: string, // Product brand (string).
  // eslint-disable-next-line camelcase
  list_name: string, // Product list (string).
  position: number, // Product position (number).
  price: number,
  quantity?: number,
  store: string
}
