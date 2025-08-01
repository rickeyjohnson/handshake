import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { UserProvider } from './contexts/UserContext.tsx'
import { AccountProvider } from './contexts/AccountContext.tsx'
import { TransactionProvider } from './contexts/TransactionsContext.tsx'
import { WebSocketProvider } from './contexts/WebsocketContext.tsx'

createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<UserProvider>
			<AccountProvider>
				<TransactionProvider>
					<WebSocketProvider>
						<App />
					</WebSocketProvider>
				</TransactionProvider>
			</AccountProvider>
		</UserProvider>
	</BrowserRouter>
)
