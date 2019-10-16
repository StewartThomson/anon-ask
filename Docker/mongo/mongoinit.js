db.createUser(
    {
        user: "admin",
        pwd: "example123",
        roles: [
            {
                role: "readWrite",
                db: "anon-bot"
            }
        ]
    }
);