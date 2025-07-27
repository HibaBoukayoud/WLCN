"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const python_shell_1 = require("python-shell");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)()); // Permette al frontend di chiamare il backend
app.use(express_1.default.json());
// Helper function to run Python scripts
const runPythonScript = async (scriptName) => {
    const scriptPath = path_1.default.join(__dirname, '../python-scripts');
    console.log('Script path:', scriptPath);
    console.log('Running script:', scriptName);
    console.log('Full path:', path_1.default.join(scriptPath, scriptName));
    const options = {
        scriptPath: scriptPath,
        pythonPath: 'python', // You might need to specify the full Python path
    };
    try { // Esegue lo script Python e cattura l'output
        const result = await python_shell_1.PythonShell.run(scriptName, options);
        //console.log('Python script executed successfully, output:', result);
        return { success: true, data: result };
    }
    catch (error) {
        console.error(`Error running ${scriptName}:`, error);
        console.error('Error details:', error.message);
        return { success: false, error: error };
    }
};
// API Routes
app.get('/api/doppler', async (req, res) => {
    const max_frames = req.query.max_frames ? String(req.query.max_frames) : '100';
    const frame_index = req.query.frame_index ? String(req.query.frame_index) : '0';
    const target_type = req.query.target_type ? String(req.query.target_type) : '1';
    const args = [target_type, frame_index, max_frames];
    console.log('Doppler endpoint called');
    try {
        console.log('Running Python script: doppler.py');
        const result = await runPythonScript('doppler.py');
        //console.log('Python script result:', result);
        if (result.success) {
            console.log('Python script executed successfully');
            // Parse the JSON output from Python script
            const pythonOutput = result.data.join('');
            //console.log('Python output:', pythonOutput);
            const dopplerData = JSON.parse(pythonOutput);
            //console.log('Parsed doppler data:', dopplerData);
            res.json({
                "Range-Doppler Map": dopplerData["Range-Doppler Map"]
            });
        }
        else {
            console.error('Python script failed:', result.error);
            res.status(500).json({ error: 'Failed to execute Python script' });
        }
    }
    catch (error) {
        console.error('Error processing doppler data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/angle', async (_req, res) => {
    try {
        const result = await runPythonScript('angle.py');
        if (result.success) {
            console.log('Python script executed successfully');
            // TODO: Process actual data from Python script
            res.json({ angle: 70, range: [-90, 90] });
        }
        else {
            res.status(500).json({ error: 'Failed to execute Python script' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/targets', async (_req, res) => {
    try {
        const result = await runPythonScript('targets.py');
        if (result.success) {
            
            // TODO: Process actual data from Python script
            res.json({ count: 1, targets: [
                    { id: 1, distance: 50, angle: 30 }
                ] });
            console.log('Python script executed successfully');
        }
        else {
            res.status(500).json({ error: 'Failed to execute Python script' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/chart-data', async (_req, res) => {
    console.log('Chart data endpoint called');
    try {
        console.log('Running Python script: chart-data.py');
        const result = await runPythonScript('chart-data.py');
        //console.log('Python script result:', result);
        if (result.success) {
            console.log('Python script executed successfully');
            // Parse the JSON output from Python script
            const pythonOutput = result.data.join('');
            //console.log('Python output:', pythonOutput);
            const chartData = JSON.parse(pythonOutput);
            //console.log('Parsed chart data:', chartData);
            res.json({
                hours: chartData.hours,
                targets: chartData.targets,
                total_detections: chartData.total_detections,
                peak_hour: chartData.peak_hour,
                avg_per_hour: chartData.avg_per_hour
            });
        }
        else {
            console.error('Python script failed:', result.error);
            res.status(500).json({ error: 'Failed to execute Python script' });
        }
    }
    catch (error) {
        console.error('Error processing chart data:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
