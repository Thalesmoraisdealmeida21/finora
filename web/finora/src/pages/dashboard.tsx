import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { ArrowUp, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

const totalBalance: Number = 1000.00


  const getDollarQuotation = async () => {
    // // const response = await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL')
    return 5
  }

  
const dashboard = () => {
  const [dollarQuotation, setDollarQuotation] = useState(0)
  const [bitcoinQuotation, setBitcoinQuotation] = useState<number>(0)

  const getBitcoinQuotation = async () => {
    const response = await axios.get('https://api.mercadobitcoin.net/api/v4/tickers?symbols=BTC-BRL')
    setBitcoinQuotation(response.data[0].high.toFixed(2))
    return response.data[0].high.toFixed(2)
  }

  useEffect(() => {
    getDollarQuotation()
    getBitcoinQuotation()
  }, [])
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-2 py-4 flex flex-col justify-between">
        <div className="max-w-6xl">
          <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Card className="p-6 from-green-100 to-green-500 bg-linear-to-br">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground text-gray-500">Saldo Total (BRL)</p>
              <p className="text-3xl font-bold">
                R$ {totalBalance.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-linear-to-br">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground text-gray-500">Saldo Total (USD)</p>
              <p className="text-3xl font-bold">
                R$ {totalBalance.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-linear-to-br">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground text-gray-500">Dollar Today Quotation (BRL)</p>
              <p className="text-3xl font-bold">
                R$ {dollarQuotation.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Card>
          <Card className="p-6 bg-linear-to-br">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground text-gray-500">Bitcoin Today Quotation (USD)</p>
              <p className="text-3xl font-bold">
                R$ {bitcoinQuotation.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </Card>
        </div>
        <div>
          <Card className="p-6 bg-linear-to-br">
            <div className="space-y-2 flex items-center gap-2">
              <TrendingUp className="w-10 h-10 text-green-500 inline-block bg-green-200 rounded-2xl p-2" />
              <div>
                <p className="text-sm font-medium text-muted-foreground text-gray-500">Change in the Last month (BRL)</p>
                <p className="text-3xl font-bold text-green-500">
                  R$ {totalBalance.toFixed(2).replace('.', ',')}
                </p>
              </div>

            </div>
          </Card>
        </div>
      </div>

    </>
  )
}

export default dashboard