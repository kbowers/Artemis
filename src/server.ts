import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const JWT_SECRET = process.env.JWT_SECRET;

console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', JWT_SECRET ? 'Set' : 'Not set');
console.log('Using PORT:', PORT);

// Middleware
app.use(express.json());

// Health endpoint
app.get('/health', (req: Request, res: Response) => {
  console.log('Health endpoint accessed');
  res.json({ ok: true });
});

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
  });
}

// Export app for testing
export default app;