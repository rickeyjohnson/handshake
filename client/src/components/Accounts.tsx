import { IconBuildingBank } from "@tabler/icons-react"
import { useAccount } from "../contexts/AccountContext"

const Accounts = () => {
  const {accounts} = useAccount()
  return (
    <div className="rounded-xl border-1 border-stone-200 py-6 px-8 w-fit flex flex-col">
      <div className="flex gap-2 flex-row align-center">
        <IconBuildingBank size={20}/>
        <h1 className="self-center">Checking</h1>
        <p>${`${accounts}`}</p>
      </div>
    </div>
  )
}

export default Accounts