import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner";
import { Input } from "./ui/input";
import api from "@/lib/api";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

interface CreateAccountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountCreated?: () => void;
}

interface AccountFormData {
  accountName: string;
  balance: string;
  isDollar: boolean;
}

export const CreateAccount = ({ open, onOpenChange, onAccountCreated }: CreateAccountProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AccountFormData>({
    mode: "onChange",
  });

  // Função para formatar valor como R$
  const formatCurrency = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");

    if (!numbers) return "";

    // Converte para número e divide por 100 para ter centavos
    const amount = parseFloat(numbers) / 100;

    // Formata como R$ X.XXX,XX
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Função para remover formatação e retornar apenas números
  const removeCurrencyFormat = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "0";
    // Retorna o valor dividido por 100 (já que formatamos multiplicando por 100)
    return (parseFloat(numbers) / 100).toString();
  };

  const onSubmit = async (data: AccountFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Remove a formatação do balance antes de enviar
      const balanceValue = removeCurrencyFormat(data.balance);

      await api.post("accounts", {
        name: data.accountName,
        balance: parseFloat(balanceValue),
        isDollar: data.isDollar,
      });

      reset();
      onOpenChange(false);
      toast.success("Account created successfully");

      // Chama o callback para atualizar a lista de contas
      if (onAccountCreated) {
        onAccountCreated();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create account");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add a new account</DialogTitle>
            <DialogDescription>
              Add a new account to your financial management.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="accountName">Account Name</label>
              <Input
                id="accountName"
                type="text"
                placeholder="Enter your account name"
                {...register("accountName", {
                  required: "Account name is required",
                })}
              />
              {errors.accountName && (
                <p className="text-sm text-red-500">{errors.accountName.message}</p>
              )}

              <label htmlFor="balance">Balance</label>
              <Controller
                name="balance"
                control={control}
                rules={{
                  validate: (value) => {
                    const numbers = value.replace(/\D/g, "");
                    if (!numbers || parseFloat(numbers) === 0) {
                      return "Balance must be greater than 0";
                    }
                    return true;
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    id="balance"
                    className="border-gray-300 h-10 px-3 py-2 rounded-md"
                    type="text"
                    placeholder="$ 0,00"
                    value={value || ""}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      onChange(formatted);
                    }}
                  />
                )}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}

              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>
            <DialogFooter>
              <div className="flex items-center space-x-2">
                <Controller
                  name="isDollar"
                  control={control}
                  render={({ field }) => (
                    <Checkbox 
                      id="dollar-mode" 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="active:cursor-pointer"
                    />
                  )}
                />
                <Label htmlFor="dollar-mode">Dollar U$</Label>
              </div>
             
              <Button
                type="submit"
                className="bg-green-700 text-white hover:bg-green-500 hover:cursor-pointer rounded-tr-md ml-auto"
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="w-4 h-4" /> : "Save changes"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};