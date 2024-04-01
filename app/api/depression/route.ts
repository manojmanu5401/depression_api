import { NextResponse } from "next/server";
import { loadModel, predict } from "@/lib/tf";
import advice from "@/data/generated_text";
import depression_data from "@/data/depression_data.json";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), 'data/depression_data.json');

export const POST = async(req: Request, res: Response) =>{
    const {options, age, gender, maritalStatus, employmentStatus} = await req.json();
    const data = JSON.stringify(depression_data);
    const jsonData = JSON.parse(data);
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
        const adviceString1 = advice[Math.floor(Math.random() * 50)]?.split(".").slice(0, -1).join(".")
        const adviceString2 = advice[Math.floor(Math.random() * 100) + 50]?.split(".").slice(0, -1).join(".")

        const response_json = {
            age: age,
            gender: gender,
            maritalStatus: maritalStatus,
            employmentStatus: employmentStatus,
            status: result?.class,
            score: score,
            advice: adviceString1+ " " + adviceString2
        }
        jsonData.push(response_json)
        await fs.writeFile(dataFilePath, JSON.stringify(jsonData))
        return NextResponse.json(response_json, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({messsage:error}, {status: 500})
    }
}

export const GET = async (req: Request, res: Response) =>{
    try{
        return NextResponse.json(depression_data,
        {status: 200}
        )
    }
    catch(err){
        NextResponse.json({messsage:err}, {status: 500})
    }
}