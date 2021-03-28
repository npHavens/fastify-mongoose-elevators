db.createUser(
    {
        user: "virbela_node_client",
        pwd: "32agrt56sg",
        roles: [
            {
                role: "readWrite",
                db: "virbela"
            }
        ]
    }
);
