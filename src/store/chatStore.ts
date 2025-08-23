import { getBadgeByCurrentUser, getChatObjectByCurrentUser } from '@/api/chatApi';
import { jsonParse } from '@/utils/object';

export const useChatStore = defineStore({
  id: 'chat-object',
  state: () => {
    const chatObjectsJson = uni.getStorageSync('chatObjects');
    const chatObjects = jsonParse<Chat.ChatObjectDto[]>(chatObjectsJson) || [];
    let currentIndex = Number(uni.getStorageSync('chatObjects-currentIndex') || 0);
    if (currentIndex >= chatObjects.length) {
      console.warn('currentIndex >=chatObjects.length', currentIndex, chatObjects.length);
      currentIndex = 0;
    }
    // console.log('chatObjectsJson', chatObjectsJson);

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
      return state.chatObjects[state.currentIndex || 0];
    },
    totalBadges: state => {
      return state.badges.reduce((total, item) => total + (item.badge || 0), 0);
    },
    otherBadges: state => {
      const currentId = state.chatObjects[state.currentIndex]?.id;
      return state.badges
        .filter(x => x.chatObjectId != currentId)
        .reduce((total, item) => total + (item.badge || 0), 0);
    },
    items: state => {
      if (!state.chatObjects[0]?.id) {
        return [];
      }
      const currentId = state.chatObjects[state.currentIndex]?.id;
      return state.chatObjects.map(x => ({
        owner: x,
        object: state.badges.find(d => d.chatObjectId == x.id),
        badge: state.badges.find(d => d.chatObjectId == x.id)?.badge || 0,
        isCurrent: x.id == currentId,
      }));
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
