import React, { useEffect, useState } from "react";
import { fetchUsers } from "./services/api";

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user, idx) => (
          <li key={idx}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
