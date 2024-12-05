// utils/calculateAge.ts
export const calculateAge = (birthdate: string | Date): number => {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const isBeforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

  if (isBeforeBirthday) {
    age -= 1;
  }

  return age;
};
