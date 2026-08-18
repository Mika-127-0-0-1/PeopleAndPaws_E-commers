import { NextResponse } from "next/server";

const colorsDisabled = () =>
    new NextResponse("Colors are not enabled for this store.", { status: 410 });

export async function GET() {
    return colorsDisabled();
}

export async function PATCH() {
    return colorsDisabled();
}

export async function DELETE() {
    return colorsDisabled();
}
