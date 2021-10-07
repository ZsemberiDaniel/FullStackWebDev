interface BmiCategory {
    name: string;
    min: number | null;
    max: number | null;
}

export interface BmiInput {
    weight: number;
    height: number;
}

const categories: Array<BmiCategory> = [
    {
        name: "Underweight (Severe thinness)",
        min: 0,
        max: 16.0
    },
    {
        name: "Underweight (Moderate thinness)",
        min: 16.0,
        max: 17.0
    },
    {
        name: "Underweight (Mild thinness)",
        min: 17.0,
        max: 18.5
    },
    {
        name: "Normal range",
        min: 18.5,
        max: 25.0
    },
    {
        name: "Overweight (Pre-obese)",
        min: 25.0,
        max: 30.0
    },
    {
        name: "Obese (Class I)",
        min: 30.0,
        max: 35.0
    },
    {
        name: "Obese (Class II)",
        min: 35.0,
        max: 40.0
    },
    {
        name: "Obese (Class III)",
        min: 40.0,
        max: null
    }
];

export const parseArguments = (args: Array<string>): BmiInput => {
    if (args.length !== 4) throw new Error("Program needs 2 input parameters!");

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            weight: Number(args[3]),
            height: Number(args[2])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

export const calculateBmi = (height: number, weight: number): string => {
    if (height <= 0) return "Invalid height!";
    if (weight <= 0) return "Invalid weight!";

    const bmi: number = weight / height / height * 10000;

    for (const category of categories) {
        if ((category.min === null || category.min <= bmi) &&
            (category.max === null || category.max > bmi)) {
            return category.name;
        }
    }

    return "Invalid height or weight!";
};

// try {
//     const { weight, height } = parseArguments(process.argv);
//     console.log(calculateBmi(height, weight))
// } catch (e) {
//     console.log('Error, something bad happened, message: ', e.message);
// }