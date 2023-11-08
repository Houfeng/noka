import { useQuery } from "./common/Hooks";
import { observable, observer } from "mota";
import React from "react";
import { createRoot } from "react-dom/client";

const model = observable<{ users: Array<any> }>({ users: [] });

const load = async () => {
  const res = await fetch("/api/users/");
  model.users = (await res.json()).items;
};

const submit = async () => {
  await fetch("/api/users/", { method: "post" });
  await load();
};

const App = observer(function App() {
  useQuery(load, []);
  return (
    <div style={{ color: "white" }}>
      <table border={0}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th style={{ width: 160 }}>
              <button onClick={submit}>Add</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {model.users.map((it) => (
            <tr key={it.id}>
              <td>{it.id}</td>
              <td>{it.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
