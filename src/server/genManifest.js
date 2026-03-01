import { runManifestCli } from './manifest.js';

if (import.meta.url === `file://${process.argv[1]}`) {
	runManifestCli();
}
