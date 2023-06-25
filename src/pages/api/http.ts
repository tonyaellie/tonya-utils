import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const http = (req: NextApiRequest, res: NextApiResponse) => {
  // get param code
  const { code } = req.query;
  if (
    z
      .string()
      .regex(/^[0-9]+$/)
      .length(3)
      .parse(code as string)
  ) {
    return res.status(200).json({ code: 200 });
  }
  res.status(Number(code)).json({ code: Number(code) });
};

export default http;
