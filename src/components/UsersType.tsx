import type { NavigationItem } from "./NavigatinonType";

export interface UserDetailTable {
  Name: string;
  UserID: string;
  Tier: string;
  BankAccount: string;
  Status: string;
}

interface IndexField {
  label: string;
  value: string | number;
}

interface UserDetailField {
  category: string;
  fields: IndexField[];
}

interface UserDetails {
  profileName: string;
  Table: UserDetailTable;
  fields: UserDetailField[];
  system: {
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Table {
  Organization: string;
  Username: string;
  Email: string;
  PhoneNumber: string;
  DateJoined: string;
  Status: string;
}

export interface Users {
  Table: Table;
}

export interface storeData {
  Users: Users;
  UserDetails: UserDetails;
}

export type UserDetailsProp = {
  userData: UserDetails[];
};

export type UserlistProps = {
  userData: Users[];
  currentTask: (NavigationItem | undefined)[];
  fetchData: () => Promise<void>;
  loading: boolean;
  error: boolean;
};
