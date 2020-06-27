import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeValues = this.transactions
      .filter(t => t.type === 'income')
      .map(t => t.value);

    const outcomeValues = this.transactions
      .filter(t => t.type === 'outcome')
      .map(t => t.value);

    let sumIncome = 0;
    let sumOutcome = 0;

    if (incomeValues.length) {
      sumIncome = incomeValues.reduce(
        (acumulator: number, value: number) => acumulator + value,
      );
    }
    if (outcomeValues.length) {
      sumOutcome = outcomeValues.reduce(
        (acumulator: number, value: number) => acumulator + value,
      );
    }

    const balance = {
      income: sumIncome,
      outcome: sumOutcome,
      total: sumIncome - sumOutcome,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    const balance = this.getBalance();
    if (transaction.type === 'outcome' && balance.total < 0) {
      const transactionIndex = this.transactions.findIndex(
        t => t.id === transaction.id,
      );
      this.transactions.splice(transactionIndex, 1);
      throw Error('Balance is negative!!');
    }
    return transaction;
  }
}

export default TransactionsRepository;
