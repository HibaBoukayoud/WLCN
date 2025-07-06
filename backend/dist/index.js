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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Helper function to run Python scripts
const runPythonScript = async (scriptName) => {
    const options = {
        scriptPath: path_1.default.join(__dirname, '../python-scripts')
    };
    try {
        const result = await python_shell_1.PythonShell.run(scriptName, options);
        return { success: true, data: result };
    }
    catch (error) {
        console.error(`Error running ${scriptName}:`, error);
        return { success: false, error: error };
    }
};
// API Routes
app.get('/api/doppler', async (_req, res) => {
    try {
        const result = await runPythonScript('doppler.py');
        if (result.success) {
            // TODO: Process actual data from Python script
            res.json({ range: [0, 100], values: [25, 30, 45, 60, 75] });
        }
        else {
            res.status(500).json({ error: 'Failed to execute Python script' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/api/angle', async (_req, res) => {
    try {
        const result = await runPythonScript('angle.py');
        if (result.success) {
            // TODO: Process actual data from Python script
            res.json({ angle: 45, range: [-90, 90] });
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
            res.json({ count: 3, targets: [
                    { id: 1, distance: 50, angle: 30 },
                    { id: 2, distance: 75, angle: -15 },
                    { id: 3, distance: 120, angle: 60 }
                ] });
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
    try {
        const result = await runPythonScript('chart-data.py');
        if (result.success) {
            // TODO: Process actual data from Python script
            res.json({
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Targets Detected',
                        data: [12, 19, 3, 5, 2, 3]
                    }
                ]
            });
        }
        else {
            res.status(500).json({ error: 'Failed to execute Python script' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
