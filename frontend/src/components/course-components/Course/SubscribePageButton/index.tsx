import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../contexts/UserContext";
import CustomButton from "../../../CustomButton";

interface SubscribePageButtonProps {
    children: React.ReactNode,
    onClickIfUserIsStudent: (e:React.MouseEvent<HTMLButtonElement>) => Promise<void>
}

export default function SubscribePageButton(
    {children, onClickIfUserIsStudent}:SubscribePageButtonProps
) {
    const [user, _] = useContext(UserContext)
    const navigate = useNavigate()

    async function onclickIfNotUser(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        navigate("/login")
    }

    function onClick() {
        if (!user) {return onclickIfNotUser}
        if (user.user_type == "student") {return onClickIfUserIsStudent}
    }

    return <CustomButton onClick={onClick()}>{children}</CustomButton>
}