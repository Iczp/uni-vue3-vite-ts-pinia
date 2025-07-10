import { getBadgeByCurrentUser, getChatObjectByCurrentUser } from '@/api/chatApi';

export const useChatStore = defineStore({
  id: 'chat-object',
  state: () => {
    return {
      currentIndex: 0,
      chatObjects: [],
      badges: [],
    } as {
      currentIndex: number;
      chatObjects: ChatApi.ChatObjectDto[];
      badges: ChatApi.BadgeDto[];
    };
  },
  getters: {
    current: state => {
      return state.chatObjects[state.currentIndex];
    },
    totalBadges: state => {
      return state.badges.reduce((total, item) => total + (item.badge || 0), 0);
    },
  },
  actions: {
    async getChatObjects() {
      const res = await getChatObjectByCurrentUser({});
      this.chatObjects = res.items;
      console.log('chatObjects', this.chatObjects);
    },
    async getBadges() {
      const items = await getBadgeByCurrentUser({});
      this.badges = items;
      console.log('badges', this.badges);
    },
  },
});
