import { getSessionUnitItemDetail } from '@/api/chatApi';
import { ObjectTypes } from '@/utils/enums';

export function useSessionUnitDetail({ sessionUnitId }: { sessionUnitId: string }) {
  const sessionUnit = ref<Chat.SessionUnitDto | null>(null);
  const setting = computed(() => sessionUnit.value?.setting);
  const destination = computed(() => sessionUnit.value?.destination);
  const owner = computed(() => sessionUnit.value?.owner);
  const isInputEnabled = computed(() => setting.value?.isInputEnabled || false);
  const isShopkeeperOrWaiter = computed(() =>
    [ObjectTypes.ShopKeeper, ObjectTypes.ShopWaiter].includes(
      sessionUnit.value?.ownerObjectType || ObjectTypes.Anonymous,
    ),
  );

  const isPending = ref(false);
  const isImmersed = computed(() => sessionUnit.value?.setting?.isImmersed || false);

  const storageKey = `session-unit-${sessionUnitId}-detail`;

  const loadSessionUnitDetail = () => {
    const sessionUnitJson = uni.getStorageSync(storageKey);
    if (sessionUnitJson) {
      sessionUnit.value = JSON.parse(sessionUnitJson);
    }
    isPending.value = true;
    getSessionUnitItemDetail({ id: sessionUnitId })
      .then(res => {
        console.log('getSessionUnitItem', res);
        res.localTime = new Date();
        sessionUnit.value = res;
        uni.setStorageSync(storageKey, JSON.stringify(res));
      })
      .catch(err => {
        console.error('Error fetching session unit item:', err);
      })
      .finally(() => {
        isPending.value = false;
      });
  };

  loadSessionUnitDetail();

  return {
    sessionUnit,
    setting,
    destination,
    owner,
    isInputEnabled,
    isShopkeeperOrWaiter,
    isImmersed,
    loadSessionUnitDetail,
  };
}
