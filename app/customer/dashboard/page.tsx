"use client"

import BankAccountsList from "@/app/dashboard/_components/BankAccountsList";
import Profile from "@/app/dashboard/_components/Profile";
import Navigation from "@/components/common/Navigation";
import { Text } from "@chakra-ui/react";
import { useState } from "react";
import { LuBanknote, LuList, LuUser } from "react-icons/lu";

const Page = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: "profile",
      label: "Profile",
      icon: <LuUser />,
    },
    {
      id: "bank-accounts",
      label: "Bank Accounts",
      icon: <LuBanknote />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <LuList />,
    },
  ]);
  return (
    <>
      <Navigation items={menuItems}></Navigation>
      <Text>Customer page</Text>
    </>
  );
};

export default Page;
