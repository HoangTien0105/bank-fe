"use client";

import Navigation from "@/components/common/Navigation";
import { useEffect, useState } from "react";
import { LuBanknote, LuList, LuUser } from "react-icons/lu";
import Profile from "./_components/Profile";
import { CustomerProfile as ICustomerProfile } from "./_types/customer";
import { me } from "@/api/auth";

const Page = () => {
  const [profile, setProfile] = useState<ICustomerProfile | null>(null);
  const menuItems = [
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
  ];

  const renderContent = (itemId: string) => {
    switch (itemId) {
      case "profile":
        return profile ? <Profile key={profile.id} profile={profile} /> : null;
      case "bank-accounts":
        return <div>Bank Accounts Content</div>;
      case "transactions":
        return <div>Transactions Content</div>;
      default:
        return null;
    }
  };

  //Lấy customer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await me();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Navigation items={menuItems} renderContent={renderContent}></Navigation>
  );
};

export default Page;
