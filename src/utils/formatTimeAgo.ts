export const formatTimeAgo = (time: Date | string | null | undefined) => {
  let inputTime: Date;
  if (!time) {
    return '-';
  } else if (time instanceof Date) {
    inputTime = time;
  } else {
    inputTime = new Date(time);
  }

  const now = new Date();
  const diffInMilliseconds = now.getTime() - inputTime.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  const hhmm = `${String(inputTime.getHours()).padStart(2, '0')}:${String(
    inputTime.getMinutes(),
  ).padStart(2, '0')}`;
  let timeText = '';
  if (diffInMinutes < 1) {
    timeText = '刚刚';
  } else if (diffInHours < 1) {
    timeText = `${diffInMinutes}分前`;
  } else if (diffInDays < 1) {
    timeText = `${hhmm}`;
  } else if (diffInDays === 1) {
    timeText = `昨天 ${hhmm}`;
  } else if (inputTime.getFullYear() === now.getFullYear()) {
    timeText = `${inputTime.getMonth() + 1}-${inputTime.getDate()} ${hhmm}`;
  } else {
    timeText = `${inputTime.getFullYear()}-${inputTime.getMonth() + 1}-${inputTime.getDate()}`;
  }
  return timeText;
};
