## migration

change the **POSTGRES_HOST** to `localhost` if inside docker
to create a migration

```sh
cd packages/db
```

then

```sh
bun run generate <migration-name>
```

move the file into **./src/migrations/** folder and include it in **./src/data-source.ts**
