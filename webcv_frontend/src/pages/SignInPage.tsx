import { fetcher } from '@/api/Fetcher';
import type { User } from '@/types/UserType';
import React, { useState, useEffect } from 'react';

const SignInPage: React.FC = () => {

  //ví dụ khi muốn lấy danh sách user:
  const [user, setUser] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetcher<User[]>({
          url: "/users",
          method: "get",
        });
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);
  console.log(user);
  return (
    <>
      <div>Đây là trang đăng nhập</div>
    </>
  );
};

export default SignInPage;