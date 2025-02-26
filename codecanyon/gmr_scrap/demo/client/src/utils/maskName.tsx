export const maskName = (name: string) => {
  if (!name || !name.includes(" ")) return name;
  const [firstName, lastName] = name.split(" ");
  return firstName + " " + lastName[0] + ".";
}
  