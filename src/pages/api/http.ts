import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const http = (req: NextApiRequest, res: NextApiResponse) => {
  // get param code
  const { code } = req.query;
  const schema = z
    .string()
    .regex(/^[0-9]+$/)
    .length(3)
    .safeParse(code as string);
  if (!schema.success) {
    return res.status(200).json({ code: 200 });
  }
  res.status(Number(code)).json({ code: Number(code) });
};

export default http;
