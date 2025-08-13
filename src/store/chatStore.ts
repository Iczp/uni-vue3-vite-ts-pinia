import { getBadgeByCurrentUser, getChatObjectByCurrentUser } from '@/api/chatApi';
import { jsonParse } from '@/utils/object';

export const useChatStore = defineStore({
  id: 'chat-object',
  state: () => {
    const chatObjectsJson = uni.getStorageSync('chatObjects');
    const currentIndex = Number(uni.getStorageSync('chatObjects-currentIndex') || 0);
    // console.log('chatObjectsJson', chatObjectsJson);
    const chatObjects = jsonParse<Chat.ChatObjectDto[]>(chatObjectsJson) || [];
    return {
      currentIndex,
      chatObjects,
      badges: [],
    } as {
      currentIndex: number;
      chatObjects: Chat.ChatObjectDto[];
      badges: Chat.BadgeDto[];
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
    setCurrentIndex(index: number) {
      this.currentIndex = index;
      uni.setStorageSync('chatObjects-currentIndex', index);
    },
    async getChatObjects() {
      const res = await getChatObjectByCurrentUser({});
      this.chatObjects = res.items;
      // console.log('chatObjects', this.chatObjects);
      uni.setStorageSync('chatObjects', JSON.stringify(this.chatObjects));
      return res.items;
    },
    async getBadges() {
      const items = await getBadgeByCurrentUser({});
      this.badges = items;
      console.log('badges', this.badges);
      return items;
    },
  },
});
