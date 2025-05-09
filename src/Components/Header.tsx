import { useEffect, useState } from 'react';

const Header = ({ adminName, onLogout }) => {
  const [username, setUsername] = useState("");

useEffect(() => {
  // حاول أولاً من localStorage وإذا ما لقيت جرّب من sessionStorage
  const storedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUsername(parsedUser.name); // أو parsedUser.name حسب شو بدك يظهر
  }
}, []);


  return (
    <header className="flex items-center p-4 bg-zinc-800 shadow-md">
      <div className="ml-auto flex items-center gap-4 w-full justify-between sm:w-auto">
        {/* اسم المسؤول */}
        <span className="text-lg font-medium text-white truncate sm:mr-4">{username}</span>

        {/* زر تسجيل الخروج */}
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
