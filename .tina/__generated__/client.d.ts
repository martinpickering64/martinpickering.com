import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'c284168b9cec60515687cddf0fb40be7573ffaf4', queries,  });
export default client;
  