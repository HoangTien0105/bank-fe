interface User {
  userId: string;
  name: string;
}

const testUser: User = {
  userId: "1",
  name: "Tien da den",
};

export async function getUser(userId: string) {
  return testUser;
}

export async function updateUser(userId: string, newName: string) {
  testUser.name = newName;
}
