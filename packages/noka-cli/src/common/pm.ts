/** @format */

import pm2 from "pm2";

export function connect() {
  return new Promise<void>((resolve, reject) => {
    pm2.connect((err) => (err ? reject(err) : resolve()));
  });
}

export function disconnect() {
  return pm2.disconnect();
}

export async function list() {
  await connect();
  return new Promise<any[]>((resolve, reject) => {
    pm2.list((err, data: pm2.ProcessDescription[]) => {
      disconnect();
      if (err) return reject(err);
      const apps: any[] = [];
      data.forEach((item) => {
        apps.push({
          name: item.name,
          pid: item.pid,
          status: item.pm2_env.status,
          uptime: new Date(item.pm2_env.pm_uptime).toLocaleString(),
          restart: item.pm2_env.restart_time,
          instances: item.pm2_env.instances,
          cpu: item.monit.cpu,
          memory: item.monit.memory,
        });
      });
      resolve(apps);
    });
  });
}

export async function remove(process: string | number) {
  await connect();
  return new Promise<void>((resolve, reject) => {
    pm2.delete(process, (err) => {
      disconnect();
      return err ? reject(err) : resolve();
    });
  });
}

export async function restart(process: string | number) {
  await connect();
  return new Promise<void>((resolve, reject) => {
    pm2.restart(process, (err) => {
      disconnect();
      return err ? reject(err) : resolve();
    });
  });
}

export async function start(options: pm2.StartOptions) {
  await connect();
  return new Promise<void>((resolve, reject) => {
    pm2.start(options, (err: any) => {
      disconnect();
      return err ? reject(err[0] || err) : resolve();
    });
  });
}

export async function stop(process: string | number) {
  await connect();
  return new Promise<void>((resolve, reject) => {
    pm2.stop(process, (err) => {
      disconnect();
      return err ? reject(err) : resolve();
    });
  });
}

export async function startup(platform: string) {
  await connect();
  return new Promise<void>((resolve, reject) => {
    const func = pm2.startup as any;
    func(<any>platform, { args: [] }, (err: Error) =>
      err ? reject(err) : resolve(),
    );
  });
}
