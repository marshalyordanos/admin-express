import * as yup from "yup";

export const AssignManagerSchema = yup.object().shape({
  managerID: yup.string().trim().required("Manager ID is required"),
  branchID: yup.string().trim().required("Branch ID is required"),
});
