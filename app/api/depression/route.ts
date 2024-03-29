import { NextResponse } from "next/server";
import { loadModel, predict } from "@/lib/tf";

export const POST = async(req: Request, res: Response) =>{
    const {options} = await req.json();
    try {
        console.log("http://localhost:3001/model/depression/model.json");
        await loadModel("http://localhost:3001/model/depression/model.json");
        const result = await predict(options,0);
        console.log("res:", result);
        return NextResponse.json(result, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({messsage:error}, {status: 500})
    }
}