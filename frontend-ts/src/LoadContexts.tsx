import { CSRFContext, CSRFContextType } from "./contexts/CSRFContext";
import { UserContext, UserContextType } from "./contexts/UserContext";
import { CourseContext, CourseContextType } from "./contexts/CourseContext";


interface LoadContextsType {
    children: React.ReactNode,
    contextValues: {
        user: UserContextType,
        csrf_token: CSRFContextType,
        courses: CourseContextType,
    }
}

function LoadContexts({children, contextValues}:LoadContextsType) {
    return (
    <CSRFContext.Provider value={contextValues.csrf_token}>
        <UserContext.Provider value={contextValues.user}>
            <CourseContext.Provider value={contextValues.courses}>
                {children}
            </CourseContext.Provider>
        </UserContext.Provider>
    </CSRFContext.Provider>
    )
}

export default LoadContexts