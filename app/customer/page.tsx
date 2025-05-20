"use client";

import Navigation from "@/components/common/Navigation";
import { useEffect, useState } from "react";
import { LuBanknote, LuList, LuUser } from "react-icons/lu";
import Profile from "./_components/Profile";
import { CustomerProfile as ICustomerProfile } from "../../types/customer";
import { me } from "@/api/auth";
import { toaster } from "@/components/ui/toaster";
import TransactionsList from "@/components/common/TransactionsList";
import AccountsList from "./_components/AccountsList";

const Page = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<ICustomerProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await me();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tất cả dữ liệu khi component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch profile data
        const profileResponse = await me();
        if (profileResponse.success) {
          setProfile(profileResponse.response);
        }

        // Fetch bank accounts data (thêm API call thực tế ở đây)
        // const bankAccountsResponse = await getBankAccounts();
        // setBankAccountsData(bankAccountsResponse.response);

        // Fetch transactions data (thêm API call thực tế ở đây)
        // const transactionsResponse = await getTransactions();
        // setTransactionsData(transactionsResponse.response);
      } catch (error) {
        console.error("Error fetching data:", error);
        toaster.error({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <LuUser />,
      data: { profile: profile },
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

  const handleTabChange = (item: any) => {
    setActiveTab(item.id);
  };

  const renderContent = (itemId: string, data: any) => {
    switch (itemId) {
      case "profile":
        return <Profile profile={data?.profile} />;
      case "bank-accounts":
        return <AccountsList/>
      case "transactions":
        return (
          <TransactionsList customerId={data?.customerId} variant="customer" />
        );
      default:
        return null;
    }
  };

  return (
    <Navigation
      items={menuItems}
      renderContent={renderContent}
      defaultValue={activeTab}
      onMenuItemClick={handleTabChange}
    ></Navigation>
  );
};

export default Page;
