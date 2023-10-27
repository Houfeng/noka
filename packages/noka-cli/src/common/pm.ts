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
        const { status, NOKA_ROOT: root } = item.pm2_env as any;
        if (!root) return;
        const { name, pid } = item;
        const { cpu, memory } = item.monit;
        apps.push({ name, pid, status, cpu, memory });
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
