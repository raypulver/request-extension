# request-extension

Factory function for standalone node modules that can extend or alter the functionality of request, the popular HTTP request library. The modules that are produced can be used the same way as request-debug, meaning there is no package depenency on request; the instance of request to be extended is passed into the module, and in the same way extensions can be unmounted from request.

Extensions can alter the request object itself, or provide middleware to be called when a request is initiated.

## Example

See [request-extension-debug](http://github.com/raypulver/request-extension-debug) for an example

## Tests

Make sure mocha is installed globally, run `npm install` in the project directory, and run
```
npm test
```

to run the test suite.

## License

MIT

## Author

Raymond Pulver IV
