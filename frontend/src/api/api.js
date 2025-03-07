import { auth } from "@/api/authentication"
import { admin } from "@/api/admin_dashboard"
import { student } from "@/api/student_dashboard";
import { commonAPI } from "@/api/common_api";

export const api = {
  auth,
  admin,
  student,
  commonAPI
};
