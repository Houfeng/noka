import { Application } from "noka";

const application = Application.create();

application
  .launch()
  .then(({ port, logger }) => {
    logger?.info("Running:", `[http://localhost:${port}]`);
  })
  .catch((err) => application.logger?.error(err));
