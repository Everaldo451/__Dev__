import { createContext, SetStateAction } from "react";

export type CSRFContextType = [string|null, React.Dispatch<SetStateAction<string|null>>]
export const CSRFContext = createContext<CSRFContextType>([null,()=>null])