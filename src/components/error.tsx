interface IErrorMessage {
  message: string
  log: string
}

export const ErrorMessage = ({ message, log }: IErrorMessage ) => {
  return <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-red-200 border border-red-600 dark:bg-red-800 dark:border-red-400">
    <span className="text-xl text-red-800 dark:text-red-200">{message}</span> 
    <span className="text-sm text-neutral-600 dark:text-neutral-400">{log}</span> 
  </div>
}