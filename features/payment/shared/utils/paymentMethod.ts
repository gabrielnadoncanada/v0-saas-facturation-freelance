export function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case "card":
      return "Carte bancaire";
    case "cash":
      return "Espèces";
    case "transfer":
      return "Virement";
    case "stripe":
      return "Stripe";
    default:
      return method;
  }
}
