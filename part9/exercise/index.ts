import express from 'express';
import { calculateBmi, parseArguments } from './calculateBmi';
import { parseExArguments, calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/bmi', (req, res) => {
    if (!req.query.weight || !req.query.height) {
        res.status(400).json({
            error: "Missing weight or height query parameter!"
        });
    }

    try {
        const input = parseArguments(["", "", String(req.query.height), String(req.query.weight)]);

        try {
            const output = calculateBmi(input.height, input.weight);
            res.status(200).json({
                weight: input.weight,
                height: input.height,
                bmi: output
            });
        } catch (e) {
            res.status(400).json({
                error: "Error while calculating bmi!"
            });
        }
    } catch (e) {
        res.status(400).json({
            error: "Error while parsing query parameters!"
        });
    }
});

app.post('/exercises', (req, res) => {
    const exercises: any = req.body.daily_exercises;
    const target: any = req.body.target;
    if (!exercises || !target) {
        res.status(400).json({
            error: "parameters missing"
        });
    }

    try {
        const input = parseExArguments(["", "", target, ...exercises]);

        try {
            const output = calculateExercises(input.hours, input.target);
            res.status(200).json(output);
        } catch (e) {
            res.status(400).json({
                error: "malformatted parameters"
            });
        }
    } catch (e) {
        res.status(400).json({
            error: "malformatted parameters"
        });
    }
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});