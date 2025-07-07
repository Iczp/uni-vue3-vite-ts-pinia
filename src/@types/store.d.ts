declare namespace User {
  interface ErpUserInfo {
    name: string;
    headImage: string;
    lastdepartmentname: string;
    departmentname: string;
    positionName: string;
    userDeptPositionInfos: UserDeptPositionInfo[];
    userId: string;
    departmentId: string;
    menuList: {
      [key: string]: string;
    };
  }

  interface UserDeptPositionInfo {
    userID: string;
    employeeNo: string;
    name: string;
    organizationID: string;
    organizationName: string;
    departmentID: string;
    departmentName: string;
    departmentType?: string | null;
    departmentShortName: string;
    parentDeptId?: string | null;
    parentDeptName?: string | null;
    parentDeptShortName?: string | null;
    positionID: string;
    positionName: string;
    positionShortName: string;
    grade?: string | null;
    userJobType: number;
    headImage: string;
  }
}

declare namespace Auth {
  interface Token {
    access_token?: string | null;
    expires_in?: Number | null;
    token_type?: string | null;
    refresh_token?: string | null;
    creation_time?: string | Date | null;
  }
}
