import * as yup from "yup";

export const UpdateBranchSchema = yup.object().shape({
  name: yup.string().trim().required("Branch name is required"),
  location: yup.string().trim().required("Location is required"),
});
