interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

export interface ExInput {
    hours: Array<number>;
    target: number;
}

export const parseExArguments = (args: Array<string>): ExInput => {
    if (args.length < 4) throw new Error("Program at least 2 input parameters!");

    const hours: Array<number> = [];
    for (let i = 3; i < args.length; i++) {
        if (isNaN(Number(args[i]))) {
            throw new Error(`Provided ${i - 1}th value (${args[i]}) was not number!`);
        } else {
            hours.push(Number(args[i]));
        }
    }

    if (!isNaN(Number(args[2]))) {
        return {
            hours: hours,
            target: Number(args[2])
        };
    } else {
        throw new Error(`Provided 1st value was not number!`);
    }
};

export const calculateExercises = (hoursPerDay: Array<number>, targetPerDay: number): Result => {
    const avg: number = hoursPerDay.length === 0 ? 0 : hoursPerDay.reduce((a, b) => a + b) / hoursPerDay.length;
    const rating: number = avg < targetPerDay - 2 ? 1 : (avg < targetPerDay ? 2 : 3);
    const ratingMsg: string = rating === 1 ? "Better next time!" : (rating === 2 ? "Good job!" : "Amazing performance!");
    return {
        periodLength: hoursPerDay.length,
        trainingDays: hoursPerDay.filter(h => h > 0).length,
        target: targetPerDay,
        average: avg,
        success: avg >= targetPerDay,
        rating: rating,
        ratingDescription: ratingMsg
    };
};

// try {
//     const { hours, target } = parseExArguments(process.argv);
//     console.log(calculateExercises(hours, target))
// } catch (e) {
//     console.log('Error, something bad happened, message: ', e.message);
// }
