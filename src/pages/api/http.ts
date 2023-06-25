import type { NextApiRequest, NextApiResponse } from 'next';

const http = (req: NextApiRequest, res: NextApiResponse) => {
  // get param code
  const { code } = req.query;
  if (typeof code !== 'number') {
    return res.status(200).json({ code: 200 });
  }
  res.status(code).json({ code });
};

export default http;
