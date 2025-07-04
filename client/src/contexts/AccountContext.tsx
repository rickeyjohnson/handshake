import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react"

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

const initialAccount: Account = {
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
}

type AccountContextType = {
    account: Account
    setAccount: Dispatch<SetStateAction<Account>>
}

const defaultAccountContextType: AccountContextType = {
    account: initialAccount,
    setAccount: () => {}
}

export const AccountContext = createContext<AccountContextType>(defaultAccountContextType)

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
    const [account, setAccount] = useState<Account>(initialAccount)

    return (
        <AccountContext.Provider value={{ account, setAccount }}>
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = () => useContext(AccountContext)