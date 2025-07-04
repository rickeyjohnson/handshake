import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { UserProvider } from './contexts/UserContext.tsx'
import { AccountProvider } from './contexts/AccountContext.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UserProvider>
			<AccountProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</AccountProvider>
		</UserProvider>
	</StrictMode>
)
