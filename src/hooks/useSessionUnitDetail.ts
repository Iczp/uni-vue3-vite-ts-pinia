import { getSessionUnitItemDetail } from '@/api/chatApi';
import { ObjectTypes } from '@/utils/enums';

export function useSessionUnitDetail({
  sessionUnitId,
  auto = true,
}: {
  sessionUnitId: string;
  auto?: boolean;
}) {
  const sessionUnit = ref<Chat.SessionUnitDto | null>(null);
  const setting = computed(() => sessionUnit.value?.setting);
  const destination = computed(() => sessionUnit.value?.destination);
  const destinationObjectType = computed(
    () => sessionUnit.value?.destinationObjectType || destination.value?.objectType,
  );
  const owner = computed(() => sessionUnit.value?.owner);
  const ownerObjectType = computed(
    () => sessionUnit.value?.ownerObjectType || owner.value?.objectType,
  );
  const isInputEnabled = computed(() => setting.value?.isInputEnabled || false);
  const isShopkeeperOrWaiter = computed(() =>
    [ObjectTypes.ShopKeeper, ObjectTypes.ShopWaiter].includes(
      sessionUnit.value?.ownerObjectType || ObjectTypes.Anonymous,
    ),
  );

  const isPending = ref(false);
  const isImmersed = computed(() => sessionUnit.value?.setting?.isImmersed || false);

  const storageKey = `session-unit-${sessionUnitId}-detail`;

  const setStorage = (value: any) => {
    uni.setStorageSync(storageKey, JSON.stringify(value));
  };

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
        setStorage(res);
      })
      .catch(err => {
        console.error('Error fetching session unit item:', err);
      })
      .finally(() => {
        isPending.value = false;
      });
  };

  if (auto) {
    loadSessionUnitDetail();
  }

  return {
    isPending,
    sessionUnit,
    setting,
    destination,
    destinationObjectType,
    owner,
    ownerObjectType,
    isInputEnabled,
    isShopkeeperOrWaiter,
    isImmersed,
    loadSessionUnitDetail,
  };
}
