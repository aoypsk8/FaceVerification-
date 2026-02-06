export const healthRoute = (app) => {
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  });
};
