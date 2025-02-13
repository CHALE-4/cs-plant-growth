import fs from 'fs/promises';

export default async function handler(req, res) {
    try {
        const data = await fs.readFile('data/plants.json', 'utf8');
        let plants = JSON.parse(data).plants;
        const now = new Date();

        // Growth time in hours (change as needed)
        const growthStages = [0, 24, 48]; // Hours for each stage

        plants = plants.map(plant => {
            const startTime = new Date(plant.start_time);
            const elapsedTime = (now - startTime) / (1000 * 60 * 60); // Convert ms to hours

            // Determine new stage
            let newStage = plant.stage;
            for (let i = growthStages.length - 1; i >= 0; i--) {
                if (elapsedTime >= growthStages[i]) {
                    newStage = i + 1;
                    break;
                }
            }

            return { ...plant, stage: newStage };
        });

        // Save updates
        await fs.writeFile('data/plants.json', JSON.stringify({ plants }, null, 2));

        res.status(200).json({ success: true, plants });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

