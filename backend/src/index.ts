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
  const scriptPath = path.join(__dirname, '../python-scripts');
  console.log('Script path:', scriptPath);
  console.log('Running script:', scriptName);
  console.log('Full path:', path.join(scriptPath, scriptName));
  
  const options = {
    scriptPath: scriptPath,
    pythonPath: 'python', // You might need to specify the full Python path
  };
  
  try { // Esegue lo script Python e cattura l'output
    const result = await PythonShell.run(scriptName, options);
    console.log('Python script executed successfully, output:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error running ${scriptName}:`, error);
    console.error('Error details:', (error as any).message);
    return { success: false, error: error };
  }
};

// API Routes
app.get('/api/doppler', async (_req: Request, res: Response) => {
  console.log('Doppler endpoint called');
  try {
    console.log('Running Python script: doppler.py');
    const result = await runPythonScript('doppler.py');
    console.log('Python script result:', result);
    
    if (result.success) {
      // Parse the JSON output from Python script
      const pythonOutput = result.data.join('');
      console.log('Python output:', pythonOutput);
      const dopplerData = JSON.parse(pythonOutput);
      console.log('Parsed doppler data:', dopplerData);
      
      res.json({
        "Range-Doppler Map": dopplerData["Range-Doppler Map"]
      });
    } else {
      console.error('Python script failed:', result.error);
      res.status(500).json({ error: 'Failed to execute Python script' });
    }
  } catch (error) {
    console.error('Error processing doppler data:', error);
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
  console.log('Chart data endpoint called');
  try {
    console.log('Running Python script: chart-data.py');
    const result = await runPythonScript('chart-data.py');
    console.log('Python script result:', result);
    
    if (result.success) {
      // Parse the JSON output from Python script
      const pythonOutput = result.data.join('');
      console.log('Python output:', pythonOutput);
      const chartData = JSON.parse(pythonOutput);
      console.log('Parsed chart data:', chartData);
      
      res.json({
        hours: chartData.hours,
        targets: chartData.targets,
        total_detections: chartData.total_detections,
        peak_hour: chartData.peak_hour,
        avg_per_hour: chartData.avg_per_hour
      });
    } else {
      console.error('Python script failed:', result.error);
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
