import { NextApiRequest, NextApiResponse } from 'next';

const asyncHandler = (fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return (req: NextApiRequest, res: NextApiResponse): void => {
    fn(req, res).catch((err) => {
      res.status(500).json({ success: false, message: err.message });
    });
  };
};

export default asyncHandler;
