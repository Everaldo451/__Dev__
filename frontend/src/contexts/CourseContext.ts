import { createContext, SetStateAction } from "react";
import { CourseType } from "../types/CourseType";

export type CourseContextType=[CourseType[],React.Dispatch<SetStateAction<CourseType[]>>]
export const CourseContext=createContext<CourseContextType>([[],()=>null])