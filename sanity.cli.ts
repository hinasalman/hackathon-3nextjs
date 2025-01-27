import { createClient } from 'next-sanity';

const client = createClient({
  projectId: process.env.layiu75e,
  dataset: process.env.hina213,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-01-01',
  useCdn: true,
});

export default client;
