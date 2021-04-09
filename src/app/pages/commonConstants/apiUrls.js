// const APP_URL  = 'https://localhost:44397/api/';
 const APP_URL ='http://healthesb.ir/api/';
export const GetPrescriptionActivityApi =APP_URL+ 'PrescriptionBarcodeDetailes/GetPrescriptionActivity';
export const GetPrescriptionBarcodeForActivationApi =APP_URL+ 'PrescriptionBarcodeDetailes/GetPrescriptionBarcodeForActivation';
export const ReActiveByPrescriptionIdApi =APP_URL+ 'PrescriptionBarcode/ReActiveByPrescriptionId';

export const AdminUserLoginApi = APP_URL+'AuthManagement/Login';
export const AdminUsergetUsersApi = APP_URL+'AuthManagement/getUsersAsync';
export const AdminUserUpdateUserApi = APP_URL+'AuthManagement/UpdateUser';
export const AdminUserCreateUserApi = APP_URL+'AuthManagement/CreateUser';
export const AdminUserGetUserRoleApi = APP_URL+'AuthManagement/getUserRolesByUserIdAsync';

export const AdminUserGetRolesApi = APP_URL+'AuthManagement/GetRoles';
export const AdminUserCreateRolesApi = APP_URL+'AuthManagement/CreateRoles';
export const AdminUserUpdateRolesApi = APP_URL+'AuthManagement/UpdateRoles';
export const AdminUserGetClaimListApi = APP_URL+'AuthManagement/GetClaimList';
export const AdminUserAssignRoleToClaimsApi = APP_URL+'AuthManagement/AssignRoleToClaims';
export const AdminUserGetRoleClaimsApi = APP_URL+'AuthManagement/GetRoleClaims';


