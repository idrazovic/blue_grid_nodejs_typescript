import express, { NextFunction, Request, Response, Router } from 'express';

import filesRoutes from './routes/files';

const router = Router();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/', router);

router.use('/files', filesRoutes);

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to BlueGrid.io test');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
