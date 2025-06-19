
export interface Admin {
  id: string;
  name: string;
  adminId: string;
  password: string;
}

export const admins: Admin[] = [
  { 
    id: "admin1", 
    name: "Rajesh Kumar", 
    adminId: "admin1", 
    password: "adminpass1" 
  },
  { 
    id: "admin2", 
    name: "Priya Sharma",
    adminId: "admin2", 
    password: "adminpass2" 
  },
  { 
    id: "admin3", 
    name: "Vikram Singh", 
    adminId: "admin3", 
    password: "adminpass3" 
  },
  { 
    id: "admin4", 
    name: "Sneha Patel", 
    adminId: "admin4", 
    password: "adminpass4" 
  }
];

export const getAdminByCredentials = (adminId: string, password: string): Admin | undefined => {
  return admins.find(admin => admin.adminId === adminId && admin.password === password);
};
