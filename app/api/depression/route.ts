import { NextResponse } from "next/server";
import { loadModel, predict } from "@/lib/tf";
import advice from "@/data/generated_text";
import { sql } from "@vercel/postgres";
import normalAdvice from "@/data/normal_text";

export const POST = async(req: Request, res: Response) =>{
    const {options, age, gender, maritalStatus, employmentStatus} = await req.json();
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
        var adviceString1 = advice[Math.floor(Math.random() * 50)]?.split(".").slice(0, -1).join(".")
        var adviceString2 = advice[Math.floor(Math.random() * 100) + 50]?.split(".").slice(0, -1).join(".")
        if(result?.pred == 0){
            adviceString1 = normalAdvice[Math.floor(Math.random() * 9)]
            adviceString1 = normalAdvice[Math.floor(Math.random() * 9)+1]
        }
        const response_json = {
            age: age,
            gender: gender,
            maritalStatus: maritalStatus,
            employmentStatus: employmentStatus,
            status: result?.class,
            score: score,
            advice: adviceString1+ " " + adviceString2
        }
        await sql`INSERT INTO depression (age, gender, maritalStatus,employmentStatus, status, score, advice) 
        VALUES (${age}, ${gender}, ${maritalStatus}, ${employmentStatus}, ${result?.class}, ${score}, ${adviceString1+ " " + adviceString2})`
        return NextResponse.json(response_json, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({messsage:error}, {status: 500})
    }
}

export const GET = async (req: Request, res: Response) =>{
    try{
        const {rows: data} = await sql`SELECT * FROM depression`;
        return NextResponse.json(data,
        {status: 200}
        )
    }
    catch(err){
        NextResponse.json({messsage:err}, {status: 500})
    }
}