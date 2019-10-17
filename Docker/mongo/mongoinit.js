db.createUser(
    {
        user: "admin",
        pwd: "example123",
        roles: [
            {
                role: "dbAdmin",
                db: "BotFramework"
            }
        ]
    }
);