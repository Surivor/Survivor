import pool, { ensureUsersTable } from "../../../lib/db";

type UserPayload = {
    name?: string;
    email?: string;
    password?: string;
    firstname?: string;
    status?: string;
};

export async function GET() {
    await ensureUsersTable();
    const [rows] = await pool.query("SELECT * FROM users");
    return Response.json(rows);
}

export async function POST(request: Request) {
    await ensureUsersTable();

    const body = (await request.json()) as UserPayload;
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");
    const firstname = String(body.firstname ?? name);
    const status = String(body.status ?? "active");

    if (!name || !email) {
        return Response.json(
            { error: "name and email are required" },
            { status: 400 }
        );
    }

    await pool.execute(
        "INSERT INTO users (name, firstname, email, password, status) VALUES (?, ?, ?, ?, ?)",
        [name, firstname, email, password, status]
    );

    return Response.json(
        {
            name,
            firstname,
            email,
            status,
        },
        { status: 201 }
    );
}