import { useQuery } from "./common/Hooks";
import { observable, observer } from "mota";
import React from "react";
import { createRoot } from "react-dom/client";
import { User } from "./entities/User";

const model = observable<{ users: Array<User> }>({ users: [] });

const loadItems = async () => {
  const res = await fetch("/api/users/");
  model.users = (await res.json()).items;
};

const createItem = async () => {
  await fetch("/api/users/", { method: "post" });
  await loadItems();
};

const removeItem = async (id: number) => {
  await fetch(`/api/user/${id}`, { method: "delete" });
  await loadItems();
};

const App = observer(function App() {
  useQuery(loadItems, []);
  return (
    <div className="p-8 prose m-auto my-8 shadow-lg bg-gray-800 rounded-md">
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th className="text-right">
              <button className="btn btn-sm" onClick={createItem}>
                ADD
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {model.users.map((it) => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.name}</td>
              <td className="text-right">
                <button
                  className="btn btn-sm"
                  onClick={() => removeItem(it.id)}
                >
                  DEL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
