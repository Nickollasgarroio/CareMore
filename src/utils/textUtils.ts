import { DateValue } from "@internationalized/date";
export const formatDate = (date: string): string => {
  return date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1");
};

export const handleDateChange = (value: DateValue | "") => {
  const formattedDate = value.toString(); // Convert to string

  return formattedDate;
};
