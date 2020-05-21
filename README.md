# wiki
A simple self-hosted wiki using markdown files

## Dependencies
- node >=v12.6.3
- docker >=v19.03.9
- yarn >=v1.22.4

## Production
```bash
# Build docker image
yarn build

# Run docker image
yarn production
```

Access the wiki at http://localhost:8080

## Development
```bash
# Install dependencies
yarn

# Run development server
yarn dev
```

Access the development server at http://localhost:8080.
The development server will automatically restart when server files are changed.

## License
[MIT](./LICENSE)

## Other Links
- [Docsify](https://docsify.js.org/)
- [StackEdit](https://stackedit.io/)
