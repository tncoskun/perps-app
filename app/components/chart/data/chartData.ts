export const getLast7DaysData = () => {
  const today = new Date();
  const data = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setSeconds(0);
    date.setMinutes(0);

    const timestamp = date.getTime();

    const open = Number((Math.random() * 1000 + 100).toFixed(2));
    const high = Number((open + Math.random() * 50).toFixed(2));
    const low = Number((open - Math.random() * 50).toFixed(2));
    const close = Number((Math.random() * (high - low) + low).toFixed(2));
    const volume = Number((Math.random() * 1000000).toFixed(0));

    data.push({
      time: Math.floor(timestamp / 1000),
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return data.reverse();
};
