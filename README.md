# Cloudflare Vulnerability History Analyzer

> ### [Download Latest Version (OSX / macOS only)](https://github.com/vector/cloudbleed-history-analyzer/releases/download/v1.0.0/CloudflareHistoryAnalyzer.app.zip)

On February 17, 2017, the "Cloudbleed" security bug was discovered. This bug affected Cloudflare's CDN product, which is used by millions of websites. For any websites that use Cloudflare, it is possible that users' private data may have been exposed to the public, including passwords, personally identifiable information, credit card numbers, etc. That data was also stored in search engine caches for some time after the bug was discovered, greatly amplifying the impact of this bug. Read more about [Cloudbleed on Wikipedia](https://en.wikipedia.org/wiki/Cloudbleed).

We recommend you change your password for any site that uses Cloudflare. This tool will analyze your Chrome browser history and report which sites you have visited that use Cloudflare so you can change your passwords.

_This tool does not share your browser history with any third-parties. The source code is [available on GitHub](https://github.com/vector/cloudbleed-history-analyzer)._

**Limitations:** This tool only works on default Chrome profiles. It doesn't scan other browsers. It can also only identify sites showing in your browsing history and that _currently_ use Cloudflare to serve the content on the root URL of the hostname.

## Warranty 

This application and code have no warranty of any kind. If you find a bug, please [contact us](mailto:ben@vectormediagroup.com). It's provided completely as-is; if something breaks, you lose data, or something else bad happens, the author(s) and owner(s) of this plugin are in no way responsible. We also can't guarantee completeness; this list is a starting point of information that _may_ be affected. It's almost certainly not exhaustive.

## Development

Built with [Electron](https://electron.atom.io/). Requires Node / NPM, NVM is supported.

```
npm install
npm run dev
```

## Credits

App and code by [@abenjaminsmith](https://twitter.com/abenjaminsmith), idea from [@mrw](https://twitter.com/mrw), proof of concept by [@kamaljoshi](https://gist.github.com/kamaljoshi/2cce5f6d35cd28de8f6dbb27d586f064).
## License

View the license [here](LICENSE.md).
