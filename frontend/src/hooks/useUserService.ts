import { toast } from "sonner";
import { useUserContext } from "@/context/AuthContext";
import * as userService from "@/services/user.service";
import { UpdateUserProps } from "@/services/user.service";

export default function useUserService() {
  const { updateUserState } = useUserContext();

  const updateProfile = async (updateProps: UpdateUserProps) => {
    const result = await userService.updateProfile(updateProps);
    if (!result.success) {
      toast(result.message);
    } else {
      toast("Profile updated successfully");
      updateUserState(result.data.updates);
    }
  };

  return {
    updateProfile,
  };
}
