import { Application } from "noka";

Application.create()
  .launch()
  .then(({ port, logger }) => {
    logger.warn("Running:", `[ http://localhost:${port} ]`);
  })
  .catch((err) => {
    //eslint-disable-next-line
    console.error(err);
  });
