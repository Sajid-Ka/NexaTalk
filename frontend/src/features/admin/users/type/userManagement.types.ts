export interface User {
  id: string;
  username: string;
  email: string;
  role: "Admin" | "User";
  status: "Online" | "Offline";
  accountStatus: "active" | "blocked" | "deleted";
  joinedDate: string;
  initials: string;
}
