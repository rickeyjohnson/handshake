import { IconCircleCheck } from "@tabler/icons-react"

const NotificationToast = () => {
  return (
    <div className="flex justify-center col-span-full gap-2 rounded-lg w-fit bg-white fixed right-3 top-3 py-3 px-5 border-1 border-stone-200">
      <IconCircleCheck size={24} className="pt-1"/>
      <div>
        <h1 className="font-medium text-md">Success! Your chnages have been saved.</h1>
        <p className="font-light text-stone-400 text-sm">Uyen will be notified of your changes.</p>
      </div>
    </div>
  )
}

export default NotificationToast