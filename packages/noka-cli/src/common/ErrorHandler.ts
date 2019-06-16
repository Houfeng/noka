import { isArray } from "util";

export function handleError(errors: Error[] | Error) {
  errors = isArray(errors) ? errors : [errors];
  errors.forEach(err => console.error(err.message));
  process.exit(2);
}
