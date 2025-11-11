import { Header } from "@/components/Header"

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    accountName: string;
    date: string;
}

const BalanceLog = () => {
    // Função para formatar data em português brasileiro completo
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    // Dados mockados de transações
    const transactions: Transaction[] = [
        {
            id: '1',
            type: 'income',
            description: 'Salário',
            amount: 5000.00,
            accountName: 'Nubank',
            date: '2025-01-15',
        },
        {
            id: '2',
            type: 'expense',
            description: 'Supermercado',
            amount: -350.50,
            accountName: 'Nubank',
            date: '2025-01-14',
        },
        {
            id: '3',
            type: 'expense',
            description: 'Conta de luz',
            amount: -120.00,
            accountName: 'Inter',
            date: '2025-01-13',
        },
        {
            id: '4',
            type: 'income',
            description: 'Freelance',
            amount: 1500.00,
            accountName: 'Nubank',
            date: '2025-01-12',
        },
        {
            id: '5',
            type: 'expense',
            description: 'Restaurante',
            amount: -85.90,
            accountName: 'Inter',
            date: '2025-01-11',
        },
        {
            id: '6',
            type: 'expense',
            description: 'Gasolina',
            amount: -200.00,
            accountName: 'Nubank',
            date: '2025-01-10',
        },
        {
            id: '7',
            type: 'income',
            description: 'Venda de produto',
            amount: 250.00,
            accountName: 'Inter',
            date: '2025-01-09',
        },
    ];

    return (
        <>
            <Header />
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-4">Balance Log</h2>
                    <p className="text-muted-foreground">See your balance history</p>
                </div>
                <div className="backdrop-blur-md border border-gray-200 rounded-2xl">
                    <table className="w-full rounded-4xl">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-4 font-semibold">Date</th>
                                <th className="text-right p-4 font-semibold">Balance</th>
                                <th className="text-right p-4 font-semibold">Diferença</th>
                            </tr>
                        </thead>
                        <tbody>

                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                >
                                    <td className="text-left p-4 ">
                                        <b>{formatDate(transaction.date)}</b>
                                        <br />
                                    </td>
                                    <td className="text-right p-4 "> R$ {Math.abs(transaction.amount).toFixed(2).replace('.', ',')}
                                    </td>
                                    <td className="text-right p-4 font-semibold">
                                    {Math.abs(transaction.amount).toFixed(2).replace('.', ',')}

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default BalanceLog;