export interface User {
  id: string;
  username: string;
  email: string;
  role: "Admin" | "User";
  status: "Online" | "Offline";
  joinedDate: string;
  initials: string;
}