import { ref, toRaw, watch } from 'vue';

export type PickerInput = {
  title?: string;
  isMultiple?: boolean;
  minCount?: number;
  maxCount?: number;
  selectedItems?: Array<Chat.IdDto>;
  disabledItems?: Array<Chat.IdDto>;
};

type ResultDto = {
  query?: Chat.GetListInput;
  items: any[];
  totalCount?: number;
  isPending: boolean;
  isEof: boolean;
  isBof: boolean;
  creationTime: Date;
};

export const usePicker = <TDto extends IdDto>({
  picker,
  selectable: isSelectable,
}: {
  picker?: PickerInput;
  selectable?: boolean;
}) => {
  const selectable = ref(isSelectable);
  const selectedList = ref<IdDto[]>(picker?.selectedItems || []);
  const disabledList = ref<IdDto[]>(picker?.disabledItems || []);
  const maxCount = ref<number | undefined>(picker?.maxCount);
  const isMultiple = ref(false);

  const pickerRef = ref(picker);

  watch(
    pickerRef,
    v => {
      maxCount.value = v?.maxCount;
      selectedList.value = v?.selectedItems || [];
      disabledList.value = v?.disabledItems || [];
      isMultiple.value = v?.isMultiple || false;
    },
    {
      immediate: true,
    },
  );

  watch(
    () => selectedList.value,
    v => {
      console.log('selectedList', v);
    },
  );

  const isChecked = (item: TDto): boolean =>
    selectedList.value.some(x => x.id?.toString() == item.id?.toString());
  const isDisabled = ref((item: TDto, andPredicate?: boolean): boolean =>
    disabledList.value.some(x => x.id?.toString() == item.id?.toString()),
  );
  // const isDisabled = (item: TDto, andPredicate?: boolean): boolean =>
  //   disabledList.value.some(x => x.id == item.id); //|| !item.setting?.isInputEnabled || false;

  const toggleSingleChecked = (item: TDto): void => {
    selectedList.value = isChecked(item) ? [] : [item];
  };

  const toggleMultipleChecked = (item: TDto): void => {
    if (isChecked(item)) {
      const findIndex = selectedList.value.findIndex(x => x.id?.toString() == item.id?.toString());
      if (findIndex != -1) {
        selectedList.value.splice(findIndex, 1);
      } else {
        console.log('Not such entity id:', item.id);
        // message.error({ content: t('NotFoundId', [item.id]) });
        return;
      }
    } else {
      if (maxCount.value && selectedList.value.length >= Number(maxCount.value)) {
        // message.warn({
        //   content: t('MaxSelected', [maxSelectCount.value]),
        //   key: 'max-select-count',
        // });
        uni.showToast({ title: `最多选择 ${maxCount.value} 项`, icon: 'none' });
        return;
      }
      selectedList.value.push(item as TDto);
    }
  };

  const toggleChecked = (item: TDto): void => {
    console.log('isMultiple', isMultiple.value);
    console.log('item', item);
    console.log('selectedList', selectedList.value);
    console.log('disabledList', disabledList.value, isDisabled.value(item), isDisabled.value);
    console.log(
      'disabledList1- some',
      disabledList.value.some(x => x.id == item.id),
    );
    if (isDisabled.value(item)) {
      return;
    }

    if (isMultiple.value) {
      toggleMultipleChecked(item);
    } else {
      toggleSingleChecked(item);
    }
  };

  const getSelectItems = (): TDto[] => selectedList.value.map(x => toRaw(x) as TDto);

  const selectedCount = computed(() => selectedList.value.length);

  return {
    selectable,
    isMultiple,
    isChecked,
    toggleChecked,
    selectedList,
    disabledList,
    isDisabled,
    maxCount,
    picker: pickerRef,
    getSelectItems,
    selectedCount,
  };
};
