import * as pm2 from "pm2";
import { handleError } from "../common/ErrorHandler";
// import { resolve } from "dns";

// export async function getApps(){
//   return new Promise((resolve,reject)=>{

//   })
// }

export async function list() {
  pm2.connect(err => {
    if (err) return handleError(err);
    pm2.list((err, data: pm2.ProcessDescription[]) => {
      pm2.disconnect();
      if (err) return handleError(err);
      const apps: any[] = [];
      data.forEach(item => {
        const { status, NOKA_ROOT: root } = item.pm2_env as any;
        if (!root) return;
        const { name, pid } = item;
        const { cpu, memory } = item.monit;
        apps.push({ name, pid, status, cpu, memory, root });
      });
      if (apps.length > 0) console.table(apps);
    });
  });
}
