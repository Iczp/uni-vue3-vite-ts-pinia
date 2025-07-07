export const useUser = defineStore({
  id: 'user',
  state: () => {
    return {
      erpUserInfo: null,
    } as {
      erpUserInfo: User.ErpUserInfo | null;
    };
  },
  getters: {
    userId: state => {
      return state.erpUserInfo?.userId;
    },
    name: state => {
      return state.erpUserInfo?.name;
    },
    depName: state => {
      return state.erpUserInfo?.departmentname;
    },
    positionName: state => {
      return state.erpUserInfo?.positionName;
    },
    headImage: state => {
      return state.erpUserInfo?.headImage;
    },
  },
  actions: {
    setUserInfo(userInfo: User.ErpUserInfo) {
      this.erpUserInfo = userInfo;
      // Object.assign(this.erpUserInfo, userInfo);
    },
  },
});
