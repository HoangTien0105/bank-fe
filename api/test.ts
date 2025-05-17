interface User {
  userId: string;
  name: string;
}

// const testUser: User = {
//   userId: "1",
//   name: "Tien da den",
// };

(global as any).testUser = {
  userId: "1",
  name: "tien da den",
};

export async function getUser(userId: string): Promise<User> {
  return global.testUser;
}

export async function updateUser(
  userId: string,
  newName: string,
): Promise<void> {
  global.testUser.name = newName;
}
