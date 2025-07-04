import { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react"

type Account = {
    id: string | number
    account_name: string
    bank_name: string
    user_id: string
    balances: {
        available: number
        current: number
        currency_code: string
    }
    subtype: string
    type: string
}

const initialAccounts: Account[] = [{
    id: -1,
    account_name: '',
    bank_name: '',
    user_id: '',
    balances: {
        available: 0,
        current: 0,
        currency_code: ''
    },
    subtype: '',
    type: ''
}]

type AccountContextType = {
    accounts: Account[]
    setAccounts: Dispatch<SetStateAction<Account[]>>
}

const defaultAccountContextType: AccountContextType = {
    accounts: initialAccounts,
    setAccounts: () => {}
}

export const AccountContext = createContext<AccountContextType>(defaultAccountContextType)

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts)

    return (
        <AccountContext.Provider value={{ accounts, setAccounts }}>
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = () => useContext(AccountContext)