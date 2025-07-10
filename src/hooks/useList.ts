import { Ref } from 'vue';

export interface DataItem {
  id: string | number;
  [key: string]: any;
}

export function createListManager(listRef: Ref<DataItem[]>) {
  const idToIndexMap = new Map<string | number, number>();

  const buildIndex = () => {
    idToIndexMap.clear();
    listRef.value.forEach((item, index) => {
      idToIndexMap.set(item.id, index);
    });
  };

  // 初始化索引
  buildIndex();

  return {
    batchUpdate(
      updates: Partial<DataItem & { id: string | number }>[],
      sortField?: keyof DataItem,
      order?: 'desc' | 'asc',
    ) {
      let changed = false;

      for (const update of updates) {
        const index = idToIndexMap.get(update.id!);
        console.log(index);
        if (index !== undefined) {
          const current = listRef.value[index];
          const updated = { ...current, ...update };
          listRef.value[index] = updated;
          changed = true;
        }
      }

      if (changed) {
        if (sortField) {
          listRef.value.sort((a, b) => {
            const av = Number(a[sortField]) || 0;
            const bv = Number(b[sortField]) || 0;
            return order === 'desc' ? bv - av : av - bv;
          });
        }
        buildIndex(); // 重建索引映射
      }
    },

    replaceAll(newList: DataItem[]) {
      listRef.value = newList;
      buildIndex();
    },
  };
}
