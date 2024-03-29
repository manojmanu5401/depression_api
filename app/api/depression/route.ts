import { NextResponse } from "next/server";
import { loadModel, predict } from "@/lib/tf";
import advice from "@/data/generated_text";

export const POST = async(req: Request, res: Response) =>{
    const {options} = await req.json();
    const answers: number[] = options as number[];
    try {
        const url = process.env.URL as string
        await loadModel(url);
        const result = await predict(options,0);
        console.log("res:", result);
        var sum =0
        answers.forEach(n => {
            sum+=n
        });
        const score = Math.floor((sum/30) * 100)
        const adviceString1 = advice[Math.floor(Math.random() * 50)]
        ?.split(".")
        .slice(0, -1)
        .join(".")
        const adviceString2 = advice[Math.floor(Math.random() * 100) + 50]
        ?.split(".")
        .slice(0, -1)
        .join(".")
        return NextResponse.json({
            status: result?.class,
            score: score,
            advice: adviceString1+ " " + adviceString2
        }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({messsage:error}, {status: 500})
    }
}