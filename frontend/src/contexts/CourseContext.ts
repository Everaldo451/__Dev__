import { createContext, SetStateAction } from "react";
import { CourseType } from "../types/CourseType";

export type CourseContextType=[Set<CourseType>,React.Dispatch<SetStateAction<Set<CourseType>>>]
export const CourseContext=createContext<CourseContextType>([new Set<CourseType>([]),()=>null])