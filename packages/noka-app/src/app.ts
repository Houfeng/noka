import { Application } from "noka";

Application
  .create()
  .launch()
  .then(({ root, port, logger }) => {
    logger.info("Root:", root);
    logger.info("Running:", `[ http://localhost:${port} ]`);
  })
  .catch(err => {
    console.error(err);
  });
