import express, { Request, Response } from 'express';
import cors from 'cors';
import { PythonShell } from 'python-shell';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permette al frontend di chiamare il backend
app.use(express.json());

// Helper function to run Python scripts
const runPythonScript = async (scriptName: string): Promise<any> => {
  const options = {
    scriptPath: path.join(__dirname, '../python-scripts')
  };
  
  try { // Esegue lo script Python e cattura l'output
    const result = await PythonShell.run(scriptName, options);
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error running ${scriptName}:`, error);
    return { success: false, error: error };
  }
};

// API Routes
app.get('/api/doppler', async (_req: Request, res: Response) => {
  try {
    const result = await runPythonScript('doppler.py');
    if (result.success) {
      // TODO: Process actual data from Python script
      res.json({ range: [0, 100], values: [25, 30, 45, 60, 75] });
    } else {
      res.status(500).json({ error: 'Failed to execute Python script' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/angle', async (_req: Request, res: Response) => {
  try {
    const result = await runPythonScript('angle.py');
    if (result.success) {
      // TODO: Process actual data from Python script
      res.json({ angle: 70, range: [-90, 90] });
    } else {
      res.status(500).json({ error: 'Failed to execute Python script' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/targets', async (_req: Request, res: Response) => {
  try {
    const result = await runPythonScript('targets.py');
    if (result.success) {
      // TODO: Process actual data from Python script
      res.json({ count: 3, targets: [
        { id: 1, distance: 50, angle: 30 },
        { id: 2, distance: 75, angle: -15 },
        { id: 3, distance: 120, angle: 60 }
      ]});
    } else {
      res.status(500).json({ error: 'Failed to execute Python script' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/chart-data', async (_req: Request, res: Response) => {
  try {
    const result = await runPythonScript('chart-data.py');
    if (result.success) {
      // Parse the JSON output from Python script
      const pythonOutput = result.data.join('');
      const chartData = JSON.parse(pythonOutput);
      
      res.json({
        hours: chartData.hours,
        targets: chartData.targets,
        total_detections: chartData.total_detections,
        peak_hour: chartData.peak_hour,
        avg_per_hour: chartData.avg_per_hour
      });
    } else {
      res.status(500).json({ error: 'Failed to execute Python script' });
    }
  } catch (error) {
    console.error('Error processing chart data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
