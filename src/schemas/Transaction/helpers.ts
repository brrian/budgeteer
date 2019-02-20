export const getTransactionData = (service: string, transaction: any) => {
  switch (service) {
    case 'personal-capital':
      return {
        serviceId: transaction.userTransactionId,
        data: {
          categoryId: transaction.categoryId,
          date: transaction.transactionDate,
          description: transaction.description,
          originalAmount: transaction.amount,
        },
      };
    default:
      throw new Error(`Unknown service id "${service}"`);
  }
};
