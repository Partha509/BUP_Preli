export async function GET() {
  return Response.json(
    { status: "ok" },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
