import { NextResponse } from "next/server"
import { env } from "process"

export const GET = async(req: Request, res: Response) =>{
    try{
        const flag = process.env.FLAG
        return NextResponse.json({
            flag: flag
        },
        {status: 200}
        )
    }
    catch(err){
        NextResponse.json({messsage:err}, {status: 500})
    }
    
}