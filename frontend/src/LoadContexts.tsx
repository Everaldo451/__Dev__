import { UserContext, UserContextType } from "./contexts/UserContext";
import { CourseContext, CourseContextType } from "./contexts/CourseContext";


interface LoadContextsType {
    children: React.ReactNode,
    contextValues: {
        user: UserContextType,
        courses: CourseContextType,
    }
}

function LoadContexts({children, contextValues}:LoadContextsType) {
    return (
        <UserContext.Provider value={contextValues.user}>
            <CourseContext.Provider value={contextValues.courses}>
                {children}
            </CourseContext.Provider>
        </UserContext.Provider>
    )
}

export default LoadContexts