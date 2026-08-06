export async function POST(req: Request)
{
    const b = await req.json()
    return Response.json(b)
}