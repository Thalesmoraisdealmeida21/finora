import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { CreateAccount } from "@/components/CreateAccount"
import { UpdateAccount } from "@/components/UpdateAccount"
import { Spinner } from "@/components/ui/spinner"
import api from "@/lib/api"
import axios from "axios"
import { Link } from "react-router-dom"

interface Account {
    id: string;
    name: string;
    balance: number;
    isDollar: boolean;
}

const account = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [accountId, setAccountId] = useState<string >('')
    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [priceDollar, setPriceDollar] = useState(0)
    const fetchAccounts = async () => {
        setIsLoading(true)
        const response = await api.get('/accounts')
        setAccounts(response.data)
        setIsLoading(false)
    }

    const getQuotation = async () => {
        try {
            // Verifica se há cotação em cache (válida por 1 hora)
            const cachedQuotation = localStorage.getItem('dollarQuotation')
            const cachedTimestamp = localStorage.getItem('dollarQuotationTimestamp')
            
            if (cachedQuotation && cachedTimestamp) {
                const timestamp = parseInt(cachedTimestamp)
                const now = Date.now()
                const oneHour = 60 * 60 * 1000 // 1 hora em milissegundos
                
                // Se a cotação em cache é recente (menos de 1 hora), usa ela
                if (now - timestamp < oneHour) {
                    setPriceDollar(Number(cachedQuotation))
                    return
                }
            }

            // Se não há cache válido, faz nova requisição
            const response = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL')
            const price = Number(response.data.USDBRL.high)
            
            // Salva no cache
            localStorage.setItem('dollarQuotation', price.toString())
            localStorage.setItem('dollarQuotationTimestamp', Date.now().toString())
            
            setPriceDollar(price)
        } catch (err) {
            console.error('Error fetching dollar quotation:', err)
            
            // Se falhar, tenta usar cache mesmo que antigo
            const cachedQuotation = localStorage.getItem('dollarQuotation')
            if (cachedQuotation) {
                setPriceDollar(Number(cachedQuotation))
            } else {
                // Valor padrão se não houver cache
                setPriceDollar(5.33)
            }
        }
    }
    
    useEffect(() => {
        fetchAccounts()
        getQuotation()
    }, [])

    return (
        <>
            <Header />
            <div className="max-w-6xl mx-auto px-2 py-4 flex flex-row justify-between">
                <div className="max-w-6xl">
                    <h2 className="text-3xl font-bold mb-4">Accounts</h2>
                    <p className="text-muted-foreground">Manage your bank accounts</p>
                </div>
                <div>
                    <Button
                        className="bg-green-300 text-white hover:bg-green-500 hover:cursor-pointer rounded-tr-md ml-auto"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Add Account
                    </Button>
                    <div className="text-sm font-medium">
                        Total 🇧🇷{(() => {
                            const totalReais = accounts.reduce((acc, account) => {
                                if (account.isDollar) {
                                    return acc + (account.balance * priceDollar);
                                }
                                return acc + account.balance;
                            }, 0);
                            return totalReais.toLocaleString('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        })()}
                    </div>
                    <div className="text-sm font-medium">
                        Total 🇺🇸:    {(() => {
                            const totalDolares = accounts.reduce((acc, account) => {
                                if (account.isDollar) {
                                    return acc + account.balance;
                                }
                                return acc + (account.balance / priceDollar);
                            }, 0);
                            return totalDolares.toLocaleString('pt-BR', { 
                                style: 'currency', 
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        })()}
                    </div>
                </div>
            </div>
            <CreateAccount
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onAccountCreated={fetchAccounts}
            />
                <UpdateAccount
                    open={isUpdateDialogOpen}
                    onOpenChange={setIsUpdateDialogOpen}
                    onAccountCreated={fetchAccounts}
                    accountId={accountId}
                />
            


            {isLoading ? (
                <div className="align-baseline mx-auto">
                    <Spinner className="w-16 h-16 mx-auto" />
                    <h2 className="text-2xl font-bold mx-auto text-center">Loading...</h2>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto px-1 py-4 flex flex-row flex-wrap gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-6">
                        {accounts.map((account) => (
                            <div key={account.id}>
                                <div className="px-6 hover:shadow-lg transition-shadow bg-white border border-gray-200 py-2 box-shadow-md rounded-md">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">{account.name}</h3>
                                                <p className="text-3xl font-bold mt-1 flex items-center gap-2">
                                                    <span>{account.isDollar ? '🇺🇸' : '🇧🇷'}</span>
                                                    <span>{account.isDollar ? 'U$' : 'R$'} {account.balance.toLocaleString(account.isDollar ? 'en-US' : 'pt-BR', { style: 'decimal', currency: account.isDollar ? 'USD' : 'BRL' })}</span>
                                                </p>
                                                {priceDollar > 0 && (
                                                    <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
                                                        <span>{account.isDollar ? '🇧🇷' : '🇺🇸'}</span>
                                                        <span>{account.isDollar ? 'R$' : 'U$'} {account.isDollar 
                                                            ? (account.balance * priceDollar).toLocaleString('pt-BR', { style: 'decimal', currency: 'BRL' })
                                                            : (account.balance / priceDollar).toLocaleString('en-US', { style: 'decimal', currency: 'USD' })
                                                        }</span>
                                                    </p>
                                                )}
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <Button variant="outline" className="bg-green-300 text-white hover:bg-green-500 hover:cursor-pointer rounded-tr-md" onClick={() => {
                                                setIsUpdateDialogOpen(true)
                                                setAccountId(account.id)
                                            }}>Update</Button>
                                            <Button onClick={() => navigate(`/balance-log/${account.id}`)} className="bg-white-300 border border-gray-200 text-black hover:bg-gray-300 hover:cursor-pointer rounded-tr-md">History</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {accounts.length === 0 && (
                        <div className="max-w-6xl mx-auto px-6 py-4 text-center mt-11">
                            <Wallet className="w-14 h-14 text-7xl text-gray-900 mx-auto mb-4 bg-gray-200 rounded-full p-2"></Wallet>
                            <h1 className="text-2xl font-bold mb-4">No Bank accounts registered</h1>
                            <p className="text-muted-foreground">Start by creating your first account to manage your finances</p>
                        </div>
                    )}
                </div>

            )}




        </>
    )
}

export default account